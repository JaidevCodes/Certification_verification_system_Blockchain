// ========== Environment & Dependencies ==========
const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: path.resolve(__dirname, ".env") }); // ensure .env loads from backend folder

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const FormData = require("form-data");
const multer = require("multer");
const mongoose = require("mongoose");
const { ethers } = require("ethers");
const rateLimit = require("express-rate-limit");

// ========== Load ABI ==========
let abi;
try {
  abi = require(path.join(__dirname, "contractAbi.json"));
} catch (e) {
  console.error("❌ Failed to load contractAbi.json:", e.message);
  abi = null;
}

const app = express();

// ========== Environment Debug ==========
console.log("🔍 Loaded Environment Variables:");
console.log(" MONGO_URI:", process.env.MONGO_URI ? "✅" : "❌ Missing");
console.log(" RPC_URL:", process.env.RPC_URL ? "✅" : "❌ Missing");
console.log(" CONTRACT_ADDRESS:", process.env.CONTRACT_ADDRESS || "❌ Missing");
console.log(" PINATA_JWT:", process.env.PINATA_JWT ? "✅" : "❌ Missing");
console.log(" ABI loaded:", abi ? "✅" : "❌ Missing");

// ========== Middleware ==========
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST", "PUT"],
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 240 }));

// ========== MongoDB ==========
async function connectDB() {
  try {
    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected Successfully!");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  }
}
connectDB();

// ========== Mongoose Schema ==========
const certificateSchema = new mongoose.Schema({
  certId: { type: String, required: true, unique: true },
  blockchainCertId: String,
  studentName: String,
  course: String,
  grade: String,
  description: String,
  issueDate: String,
  ipfsHash: String,
  status: { type: String, enum: ["pending", "issued"], default: "pending" },
  txHash: String,
  issuer: String,
  issuedAt: Date,
  createdAt: { type: Date, default: Date.now },
});
const Certificate =
  mongoose.models.Certificate ||
  mongoose.model("Certificate", certificateSchema);

// ========== File Upload Setup ==========
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

const upload = multer({
  dest: uploadsDir,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf")
      return cb(new Error("Only PDF files allowed"), false);
    cb(null, true);
  },
});

// ========== Pinata Upload ==========
const PINATA_URL = "https://api.pinata.cloud/pinning/pinFileToIPFS";
async function uploadToPinata(filePath, fileName) {
  const form = new FormData();
  form.append("file", fs.createReadStream(filePath));
  form.append("pinataMetadata", JSON.stringify({ name: fileName || "certificate" }));

  try {
    const res = await axios.post(PINATA_URL, form, {
      headers: { ...form.getHeaders(), Authorization: `Bearer ${process.env.PINATA_JWT}` },
      timeout: 30000,
    });
    console.log("✅ Uploaded to Pinata:", res.data.IpfsHash);
    return res.data.IpfsHash;
  } catch (err) {
    console.error("❌ Pinata upload error:", err.response?.data || err.message);
    return null;
  } finally {
    try {
      fs.unlinkSync(filePath);
    } catch { }
  }
}

// ========== Blockchain Setup ==========
const RPC_URL = process.env.RPC_URL?.trim();
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS?.trim();

let provider = null;
let contract = null;

if (RPC_URL && CONTRACT_ADDRESS && abi) {
  try {
    provider = new ethers.JsonRpcProvider(RPC_URL);
    contract = new ethers.Contract(CONTRACT_ADDRESS, abi);
    console.log("✅ Connected to Polygon Amoy contract:", CONTRACT_ADDRESS);
  } catch (err) {
    console.error("❌ Blockchain connection failed:", err.message);
  }
} else {
  console.warn("⚠️ Blockchain config incomplete (.env or ABI missing)");
}

// ========== ROUTES ==========

// 1️⃣ Upload Certificate (Pinata + DB)
app.post("/api/certificates", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "PDF required" });

  try {
    const certId = "CERT-" + Date.now();
    const ipfsHash = await uploadToPinata(req.file.path, req.file.originalname);
    if (!ipfsHash) return res.status(500).json({ error: "Pinata upload failed" });

    const certDoc = new Certificate({
      certId,
      studentName: req.body.studentName,
      course: req.body.course,
      grade: req.body.grade || "N/A",
      description: req.body.description || "",
      issueDate: new Date().toISOString(),
      ipfsHash,
      status: "pending",
    });

    await certDoc.save();
    console.log(`📄 Certificate saved with CID: ${ipfsHash}`);
    res.json({ success: true, cert: certDoc });
  } catch (err) {
    console.error("❌ Error during upload:", err.message);
    res.status(500).json({ error: "Failed to process certificate" });
  }
});

// 2️⃣ Issue certificate after blockchain tx
app.put("/api/certificates/:certId/issue", async (req, res) => {
  const { certId } = req.params;
  const { txHash } = req.body;

  try {
    const cert = await Certificate.findOne({ certId });
    if (!cert) return res.status(404).json({ error: "Certificate not found" });
    if (!provider) return res.status(500).json({ error: "Blockchain not configured" });

    const receipt = await provider.getTransactionReceipt(txHash);
    if (!receipt || !receipt.logs)
      return res.status(400).json({ error: "Invalid transaction hash" });

    const iface = new ethers.Interface(abi);
    const parsedLog = receipt.logs
      .map((log) => {
        try {
          return iface.parseLog(log);
        } catch {
          return null;
        }
      })
      .find((e) => e && e.name === "CertificateIssued");

    const blockchainCertId = parsedLog?.args?.certificateId || null;

    cert.status = "issued";
    cert.txHash = txHash;
    cert.issuedAt = new Date();
    cert.blockchainCertId = blockchainCertId ? blockchainCertId.toString() : null;

    await cert.save();
    console.log(`✅ Certificate ${certId} marked as issued`);
    res.json({ success: true, cert, blockchainCertId });
  } catch (err) {
    console.error("❌ Error updating certificate:", err.message);
    res.status(500).json({ error: "Update failed" });
  }
});

// 3️⃣ Return ABI + contract address
app.get("/api/abi", (req, res) => {
  if (!abi) return res.status(500).json({ error: "ABI not available on server" });
  if (!CONTRACT_ADDRESS)
    return res
      .status(500)
      .json({ error: "Contract address missing from backend. Check server .env file." });
  res.json({ abi, contractAddress: CONTRACT_ADDRESS });
});

// 4️⃣ Verify by Certificate ID
app.get("/api/verify/id/:certId", async (req, res) => {
  try {
    const { certId } = req.params;
    if (!contract)
      return res.status(500).json({ error: "Blockchain not connected" });

    const cert = await Certificate.findOne({ certId });
    if (!cert || !cert.blockchainCertId)
      return res
        .status(404)
        .json({ valid: false, message: "Certificate not found in database" });

    const result = await contract.verifyById(cert.blockchainCertId);
    if (!result.valid)
      return res.json({
        valid: false,
        message: "Certificate invalid or not found on blockchain",
      });

    res.json({
      valid: true,
      issuerName: result.issuerName,
      studentName: result.studentName,
      courseName: result.courseName,
      ipfsHash: result.ipfsHash,
      issueDate: new Date(Number(result.issueDate) * 1000).toLocaleString(),
      issuer: result.issuer,
      creationBlock: result.creationBlock?.toString?.() || undefined,
    });
  } catch (err) {
    console.error("❌ Error verifying certificate by ID:", err.message);
    res.status(500).json({ error: "Verification failed" });
  }
});
// 🔎 Fetch certificate by blockchainCertId (used by verifier)
app.get("/api/certificates/blockchain/:blockchainCertId", async (req, res) => {
  try {
    const { blockchainCertId } = req.params;

    const cert = await Certificate.findOne({
      blockchainCertId: blockchainCertId.toLowerCase()
    });

    if (!cert) {
      return res.status(404).json({ error: "Certificate not found in DB" });
    }

    res.json({ cert });
  } catch (err) {
    console.error("❌ DB lookup failed:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 5️⃣ Health check
app.get("/api/health", (req, res) =>
  res.json({
    ok: true,
    mongoConnected: mongoose.connection.readyState === 1,
    contractConnected: !!contract,
  })
);

// ========== Start Server ==========
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
