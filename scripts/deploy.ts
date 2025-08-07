import { ethers } from "hardhat";

async function main() {
  console.log("Deploying CertificateVerifier contract...");

  const CertificateVerifier = await ethers.getContractFactory("CertificateVerifier");
  const certificateVerifier = await CertificateVerifier.deploy();

  await certificateVerifier.waitForDeployment();

  const address = await certificateVerifier.getAddress();
  console.log("CertificateVerifier deployed to:", address);
  console.log("Contract address for frontend:", address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });