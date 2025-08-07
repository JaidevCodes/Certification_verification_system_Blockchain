import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  console.log("🚀 Starting CertificateVerifier deployment to Mumbai testnet...");

  // Check environment variables
  const privateKey = process.env.PRIVATE_KEY;
  const mumbaiRpcUrl = process.env.MUMBAI_RPC_URL;

  if (!privateKey) {
    throw new Error("PRIVATE_KEY environment variable is required");
  }

  if (!mumbaiRpcUrl) {
    throw new Error("MUMBAI_RPC_URL environment variable is required");
  }

  console.log("📋 Environment variables loaded successfully");

  // Create provider and signer
  const provider = new ethers.JsonRpcProvider(mumbaiRpcUrl);
  const signer = new ethers.Wallet(privateKey, provider);

  console.log("🔗 Connected to Mumbai testnet");
  console.log("👤 Deploying from address:", await signer.getAddress());

  // Check balance
  const balance = await provider.getBalance(await signer.getAddress());
  console.log("💰 Balance:", ethers.formatEther(balance), "MATIC");

  if (balance < ethers.parseEther("0.01")) {
    console.log("⚠️  Low balance detected. Please get some MATIC from the faucet:");
    console.log("   https://faucet.polygon.technology/");
    return;
  }

  // Deploy contract
  console.log("📦 Deploying CertificateVerifier contract...");
  
  const CertificateVerifier = await ethers.getContractFactory("CertificateVerifier", signer);
  const certificateVerifier = await CertificateVerifier.deploy();

  console.log("⏳ Waiting for deployment transaction...");
  await certificateVerifier.waitForDeployment();

  const address = await certificateVerifier.getAddress();
  console.log("✅ CertificateVerifier deployed successfully!");
  console.log("📍 Contract address:", address);
  console.log("🔍 View on PolygonScan: https://mumbai.polygonscan.com/address/" + address);

  // Verify deployment
  console.log("🔍 Verifying deployment...");
  const code = await provider.getCode(address);
  if (code === "0x") {
    console.log("❌ Contract deployment failed - no code at address");
    return;
  }

  console.log("✅ Contract verification successful");
  
  // Save deployment info
  const deploymentInfo = {
    contractAddress: address,
    network: "mumbai",
    deployer: await signer.getAddress(),
    timestamp: new Date().toISOString(),
  };

  console.log("\n📝 Deployment Summary:");
  console.log("   Contract: CertificateVerifier");
  console.log("   Address:", address);
  console.log("   Network: Mumbai Testnet");
  console.log("   Deployer:", deploymentInfo.deployer);
  console.log("   Timestamp:", deploymentInfo.timestamp);

  console.log("\n🔧 Next Steps:");
  console.log("   1. Update VITE_CONTRACT_ADDRESS in your .env file with:", address);
  console.log("   2. Restart your development server");
  console.log("   3. Test the application");

  // Optional: Verify on PolygonScan
  const polygonScanApiKey = process.env.POLYGONSCAN_API_KEY;
  if (polygonScanApiKey) {
    console.log("\n🔍 To verify on PolygonScan, run:");
    console.log(`   npx hardhat verify --network mumbai ${address}`);
  }
}

main()
  .then(() => {
    console.log("\n🎉 Deployment completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Deployment failed:", error);
    process.exit(1);
  });