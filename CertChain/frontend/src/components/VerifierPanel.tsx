import React, { useState } from "react";
import axios from "axios";
import { ethers } from "ethers";

// Backend base (adjust in environment if needed)
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const VerifierPanel: React.FC = () => {
  const [mode, setMode] = useState<"cid" | "certId" | "txHash">("cid");
  const [searchValue, setSearchValue] = useState("");
  const [result, setResult] = useState<any>(null);
  const [status, setStatus] = useState("");

  const zeroBytes32 =
    "0x0000000000000000000000000000000000000000000000000000000000000000";

  // Helper: fetch ABI + contract address from backend
  async function fetchAbiAndAddress() {
    const res = await axios.get(`${BACKEND_URL}/api/abi`);
    return { abi: res.data.abi, contractAddress: res.data.contractAddress };
  }

  // Helper: query backend Mongo for txHash by blockchainCertId
  async function getTxHashFromBackend(blockchainCertId: string) {
    if (!blockchainCertId) return null;
    try {
      const r = await axios.get(`${BACKEND_URL}/api/certificates/blockchain/${blockchainCertId}`);
      if (r.data && r.data.cert && r.data.cert.txHash) return r.data.cert.txHash;
      return null;
    } catch (err) {
      // ignore backend errors silently; return null so UI can still show on-chain details
      return null;
    }
  }

  // Main verify function
  const verify = async () => {
    setResult(null);
    if (!searchValue || searchValue.trim() === "") {
      alert("Please enter a value to verify.");
      return;
    }
    setStatus("⛓️ Connecting to blockchain...");
    try {
      // Ensure MetaMask
      if (!(window as any).ethereum) {
        alert("Please install MetaMask (or another Web3 provider).");
        setStatus("");
        return;
      }

      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();

      // Get ABI + address from backend
      const { abi, contractAddress } = await fetchAbiAndAddress();
      if (!contractAddress) {
        setStatus("❌ Contract address missing from backend.");
        return;
      }

      const contract = new ethers.Contract(contractAddress, abi, signer);
      setStatus("⏳ Querying on-chain...");

      let onChainData: any = null;
      let ipfsHash: string | null = null;
      let certificateId: string | null = null;
      let txHashFromBackend: string | null = null;

      if (mode === "cid") {
        // 1) Call verifyByCID
        const res = await contract.verifyByCID(searchValue);
        // res may be tuple-like or named; handle both
        const valid = res?.valid ?? (Array.isArray(res) ? res[0] : false);
        if (!valid) {
          setStatus("❌ Certificate invalid or not found.");
          setResult({ valid: false, message: "Not found or invalid" });
          return;
        }

        // Extract certificateId (res.certificateId or res[1])
        certificateId = res?.certificateId ?? (Array.isArray(res) ? res[1] : null);

        // If verifyByCID didn't include ipfsHash, call verifyById to fetch ipfsHash and other canonical fields
        if (!res.ipfsHash) {
          if (certificateId && certificateId !== zeroBytes32) {
            const byId = await contract.verifyById(certificateId);
            ipfsHash = byId?.ipfsHash ?? byId[4] ?? null;
            onChainData = byId;
          } else {
            // fallback: maybe res included some fields in tuple positions
            ipfsHash = res?.ipfsHash ?? null;
            onChainData = res;
          }
        } else {
          ipfsHash = res.ipfsHash ?? null;
          onChainData = res;
        }

        // Query backend Mongo for txHash for this blockchainCertId (if present)
        if (certificateId) {
          txHashFromBackend = await getTxHashFromBackend(certificateId.toString());
        }
      } else if (mode === "certId") {
        // Direct verify by certificate ID
        const res = await contract.verifyById(searchValue);
        const valid = res?.valid ?? (Array.isArray(res) ? res[0] : false);
        if (!valid) {
          setStatus("❌ Certificate invalid or not found.");
          setResult({ valid: false, message: "Not found or invalid" });
          return;
        }
        certificateId = searchValue;
        ipfsHash = res?.ipfsHash ?? res[4] ?? null;
        onChainData = res;

        // Look up txHash from backend using blockchainCertId
        txHashFromBackend = await getTxHashFromBackend(certificateId.toString());
      } else {
        // txHash mode: parse the tx receipt, extract CertificateIssued event
        const txHash = searchValue.trim();
        setStatus("⏳ Fetching transaction receipt...");
        const receipt = await provider.getTransactionReceipt(txHash);
        if (!receipt || !receipt.logs) {
          setStatus("❌ Transaction receipt not found or no logs.");
          setResult({ valid: false, message: "Transaction not found or has no logs" });
          return;
        }

        // Create interface and parse logs for CertificateIssued event
        const iface = new ethers.Interface(abi);
        // Find the event log for CertificateIssued
        const parsed = receipt.logs
          .map((log: any) => {
            try {
              return iface.parseLog(log);
            } catch {
              return null;
            }
          })
          .find((p: any) => p && p.name === "CertificateIssued");

        if (!parsed) {
          setStatus("❌ CertificateIssued event not found in transaction logs.");
          setResult({ valid: false, message: "No CertificateIssued event in tx" });
          return;
        }

        // Extract data from event args
        // event signature: (bytes32 certificateId, string studentName, string courseName, string ipfsHash, address issuer)
        certificateId = parsed.args?.certificateId?.toString?.() ?? null;
        ipfsHash = parsed.args?.ipfsHash ?? null;
        // we'll query verifyById to confirm and get canonical fields
        if (certificateId && certificateId !== zeroBytes32) {
          const byId = await contract.verifyById(certificateId);
          onChainData = byId;
        } else {
          onChainData = {
            issuerName: parsed.args?.issuerName ?? parsed.args?.issuer ?? "",
            studentName: parsed.args?.studentName ?? parsed.args?.student ?? "",
            courseName: parsed.args?.courseName ?? parsed.args?.course ?? "",
            ipfsHash,
            issueDate: parsed.blockNumber ? parsed.blockNumber : undefined,
            issuer: parsed.args?.issuer ?? "",
          };
        }

        // txHash is the input; also try to find if Mongo knows it
        txHashFromBackend = txHash;
      }

      // Normalize ipfsHash (bytes32 -> string) if necessary
      if (ipfsHash && ethers.isBytesLike(ipfsHash)) {
        try {
          ipfsHash = ethers.decodeBytes32String(ipfsHash);
        } catch {
          ipfsHash = ipfsHash.toString();
        }
      }

      if (!ipfsHash) ipfsHash = "Not Available";

      // Build final result object for UI (defensive reads for named or indexed tuple returns)
      const final = {
        valid: (onChainData?.valid ?? true) as boolean,
        issuerName:
          onChainData?.issuerName ??
          (Array.isArray(onChainData) ? onChainData[1] ?? "" : ""),
        studentName:
          onChainData?.studentName ??
          (Array.isArray(onChainData) ? onChainData[2] ?? "" : ""),
        courseName:
          onChainData?.courseName ??
          (Array.isArray(onChainData) ? onChainData[3] ?? "" : ""),
        ipfsHash,
        issueDate: (() => {
          const raw =
            onChainData?.issueDate ??
            (Array.isArray(onChainData) ? onChainData[5] : undefined);
          const num = Number(raw) || 0;
          // convert seconds->ms if needed
          if (num > 0 && num < 9999999999) return new Date(num * 1000).toLocaleString();
          if (num > 0) return new Date(num).toLocaleString();
          return "Unknown";
        })(),
        issuer: onChainData?.issuer ?? (Array.isArray(onChainData) ? onChainData[6] : ""),
        certificateId: certificateId ?? null,
        txHash: txHashFromBackend ?? null,
      };

      setResult(final);
      setStatus("✅ Verified (on-chain + backend lookup).");
    } catch (err: any) {
      console.error("Verification error:", err);
      setStatus(`❌ Verification failed: ${err?.message ?? String(err)}`);
      setResult({ valid: false, message: "Verification error" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-gray-800 shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Certificate Verifier Panel
        </h1>

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-4 justify-center">
          <button
            onClick={() => setMode("cid")}
            className={`px-3 py-1 rounded ${mode === "cid" ? "bg-blue-600 text-white" : "bg-gray-600 text-gray-300"}`}
          >
            Verify by CID
          </button>
          <button
            onClick={() => setMode("certId")}
            className={`px-3 py-1 rounded ${mode === "certId" ? "bg-blue-600 text-white" : "bg-gray-600 text-gray-300"}`}
          >
            Verify by Certificate ID
          </button>
          <button
            onClick={() => setMode("txHash")}
            className={`px-3 py-1 rounded ${mode === "txHash" ? "bg-blue-600 text-white" : "bg-gray-600 text-gray-300"}`}
          >
            Verify by TxHash
          </button>
        </div>

        {/* Input Field */}
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder={
            mode === "cid"
              ? "Enter IPFS CID (Qm...)"
              : mode === "certId"
                ? "Enter Certificate ID (bytes32)"
                : "Enter Transaction Hash (0x...)"
          }
          className="border border-gray-600 w-full p-2 rounded mb-4 bg-gray-700 text-white"
        />

        {/* Verify Button */}
        <div className="flex justify-center gap-4">
          <button
            onClick={verify}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-all"
          >
            Verify
          </button>
        </div>

        {/* Status */}
        <p className="mt-6 text-center text-gray-300">{status}</p>

        {/* Results */}
        {result && (
          <div className="mt-6 p-4 bg-gray-700 rounded-xl">
            {!result.valid ? (
              <p className="text-red-400 text-center">{result.message || "Not found or invalid"}</p>
            ) : (
              <>
                <p><b>Issuer:</b> {result.issuerName}</p>
                <p><b>Student:</b> {result.studentName}</p>
                <p><b>Course:</b> {result.courseName}</p>
                <p>
                  <b>IPFS:</b>{" "}
                  {result.ipfsHash && result.ipfsHash !== "Not Available" ? (
                    <a href={`https://gateway.pinata.cloud/ipfs/${result.ipfsHash}`} target="_blank" rel="noopener noreferrer" className="text-green-400 underline">
                      {result.ipfsHash}
                    </a>
                  ) : (
                    <span className="text-gray-400">Not Available</span>
                  )}
                </p>
                <p><b>Date:</b> {result.issueDate}</p>
                <p><b>Issuer Address:</b> {result.issuer}</p>
                {result.certificateId && <p><b>Certificate ID:</b> {result.certificateId}</p>}
                {result.txHash ? (
                  <p>
                    <b>TxHash:</b>{" "}
                    <a href={`https://amoy.polygonscan.com/tx/${result.txHash}`} target="_blank" rel="noopener noreferrer" className="text-green-400 underline">
                      {result.txHash}
                    </a>
                  </p>
                ) : (
                  <p><b>TxHash:</b> <span className="text-gray-400">Not available in DB</span></p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifierPanel;
