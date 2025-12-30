import React, { useState } from "react";
import axios from "axios";
import { ethers } from "ethers";

interface Certificate {
  certId: string;
  studentName: string;
  course: string;
  grade: string;
  description: string;
  ipfsHash: string;
  status: string;
  txHash?: string;
}

const IssuerPanel: React.FC = () => {
  const [issuerName, setIssuerName] = useState("");
  const [studentName, setStudentName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [grade, setGrade] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [cert, setCert] = useState<Certificate | null>(null);
  const [status, setStatus] = useState<string>("");

  // ✅ Adjust this baseURL if your backend runs on a different port
  const BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Upload PDF to Pinata and MongoDB
  const handleUpload = async () => {
    if (!file || !studentName || !courseName) {
      alert("Please fill all fields and upload a PDF.");
      return;
    }

    try {
      setStatus("📤 Uploading certificate to IPFS...");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("studentName", studentName);
      formData.append("course", courseName);
      formData.append("grade", grade);
      formData.append("description", description);

      // ✅ Include full backend URL to avoid AxiosError
      const res = await axios.post(`${BASE_URL}/api/certificates`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setCert(res.data.cert);
      setStatus("✅ Uploaded to Pinata and MongoDB. Ready to issue on blockchain.");
    } catch (err: any) {
      console.error("❌ Upload failed:", err.response?.data || err.message);
      setStatus(
        `❌ Upload failed: ${err.response?.data?.message ||
        err.message ||
        "Unknown error"
        }`
      );
    }
  };

  // Issue certificate on Polygon (MetaMask)
  const handleIssue = async () => {
    if (!cert) {
      alert("Please upload certificate first.");
      return;
    }

    try {
      setStatus("🔗 Connecting to MetaMask...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Fetch latest ABI + address from backend
      const abiResponse = await axios.get(`${BASE_URL}/api/abi`);
      const { abi, contractAddress } = abiResponse.data;

      const contract = new ethers.Contract(contractAddress, abi, signer);

      setStatus("⏳ Sending blockchain transaction...");
      const tx = await contract.issueCertificate(
        issuerName || "Unknown Issuer",
        cert.studentName,
        cert.course,
        cert.ipfsHash
      );

      setStatus("⛓️ Waiting for transaction confirmation...");
      const receipt = await tx.wait();

      if (!receipt?.hash) throw new Error("Transaction failed or not confirmed.");

      setStatus(`✅ Certificate issued! TX: ${receipt.hash}`);

      // Update backend (MongoDB)
      await axios.put(`${BASE_URL}/api/certificates/${cert.certId}/issue`, {
        txHash: receipt.hash,
      });

      setCert({ ...cert, txHash: receipt.hash, status: "issued" });
    } catch (err: any) {
      console.error("❌ Blockchain transaction failed:", err);
      setStatus("❌ Blockchain transaction failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-gray-800 shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Certificate Issuer Panel
        </h1>

        {/* Form Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Issuer Name"
            value={issuerName}
            onChange={(e) => setIssuerName(e.target.value)}
            className="border border-gray-600 w-full p-2 rounded mb-4 bg-gray-700 text-white"
          />
          <input
            type="text"
            placeholder="Student Name"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="border border-gray-600 w-full p-2 rounded mb-4 bg-gray-700 text-white"
          />
          <input
            type="text"
            placeholder="Course Name"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            className="border border-gray-600 w-full p-2 rounded mb-4 bg-gray-700 text-white"
          />
          <input
            type="text"
            placeholder="Grade"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="border border-gray-600 w-full p-2 rounded mb-4 bg-gray-700 text-white"
          />
        </div>

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border border-gray-600 w-full p-2 rounded mb-4 bg-gray-700 text-white"
        />

        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="mt-4"
        />

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={handleUpload}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
             Upload Certificate
          </button>
          <button
            onClick={handleIssue}
            disabled={!cert}
            className={`${cert ? "bg-green-600 hover:bg-green-700" : "bg-gray-400"
              } text-white px-4 py-2 rounded`}
          >
             Issue on Blockchain
          </button>
        </div>

        {/* Status */}
        <p className="mt-6 text-center text-gray-700">{status}</p>

        {/* Certificate Info */}
        {cert && (
          <div className="mt-6 p-4 bg-gray-100 rounded-xl">
            <h2 className="font-semibold text-lg mb-2">Certificate Info</h2>
            <p><b>ID:</b> {cert.certId}</p>
            <p><b>Student:</b> {cert.studentName}</p>
            <p><b>Course:</b> {cert.course}</p>
            <p><b>Status:</b> {cert.status}</p>
            <p>
              <b>IPFS:</b>{" "}
              <a
                href={`https://gateway.pinata.cloud/ipfs/${cert.ipfsHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View File
              </a>
            </p>
            {cert.txHash && (
              <p>
                <b>Txn:</b>{" "}
                <a
                  href={`https://amoy.polygonscan.com/tx/${cert.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 underline"
                >
                  View on PolygonScan
                </a>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default IssuerPanel;
