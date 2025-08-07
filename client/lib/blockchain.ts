import { ethers } from 'ethers';

// ABI for the CertificateVerifier contract
const CONTRACT_ABI = [
  "function issueCertificate(string _issuerName, string _studentName, string _courseName, string _ipfsHash) public returns (bytes32)",
  "function verifyCertificate(bytes32 _certificateId) public view returns (bool, string, string, string, string, uint256)",
  "function getCertificateDetails(bytes32 _certificateId) public view returns (string, string, string, string, uint256, bool, address)",
  "function revokeCertificate(bytes32 _certificateId) public",
  "function authorizeIssuer(address _issuer) public",
  "function revokeIssuer(address _issuer) public",
  "function authorizedIssuers(address) public view returns (bool)",
  "function owner() public view returns (address)",
  "event CertificateIssued(bytes32 indexed certificateId, string studentName, string courseName, string ipfsHash)",
  "event CertificateRevoked(bytes32 indexed certificateId)",
  "event IssuerAuthorized(address indexed issuer)",
  "event IssuerRevoked(address indexed issuer)"
];

// Contract address (will be updated after deployment)
const CONTRACT_ADDRESS = process.env.VITE_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

// Polygon Mumbai testnet configuration
const MUMBAI_RPC_URL = 'https://polygon-mumbai.infura.io/v3/your-project-id';
const CHAIN_ID = 80001;

export interface CertificateData {
  issuerName: string;
  studentName: string;
  courseName: string;
  ipfsHash: string;
  issueDate: number;
  isValid: boolean;
  issuer: string;
}

export interface VerificationResult {
  isValid: boolean;
  issuerName: string;
  studentName: string;
  courseName: string;
  ipfsHash: string;
  issueDate: number;
}

export class BlockchainService {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.JsonRpcSigner | null = null;
  private contract: ethers.Contract | null = null;

  async connect(): Promise<boolean> {
    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }

      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      // Create provider and signer
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();

      // Check if we're on the correct network
      const network = await this.provider.getNetwork();
      if (network.chainId !== BigInt(CHAIN_ID)) {
        // Request network switch
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${CHAIN_ID.toString(16)}` }],
          });
        } catch (switchError: any) {
          // If the network doesn't exist, add it
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: `0x${CHAIN_ID.toString(16)}`,
                chainName: 'Polygon Mumbai Testnet',
                nativeCurrency: {
                  name: 'MATIC',
                  symbol: 'MATIC',
                  decimals: 18,
                },
                rpcUrls: [MUMBAI_RPC_URL],
                blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
              }],
            });
          }
        }
      }

      // Create contract instance
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.signer);

      return true;
    } catch (error) {
      console.error('Failed to connect to blockchain:', error);
      return false;
    }
  }

  async getConnectedAddress(): Promise<string | null> {
    if (!this.signer) return null;
    return await this.signer.getAddress();
  }

  async isAuthorizedIssuer(address: string): Promise<boolean> {
    if (!this.contract) throw new Error('Contract not connected');
    return await this.contract.authorizedIssuers(address);
  }

  async issueCertificate(
    issuerName: string,
    studentName: string,
    courseName: string,
    ipfsHash: string
  ): Promise<string> {
    if (!this.contract) throw new Error('Contract not connected');

    const tx = await this.contract.issueCertificate(issuerName, studentName, courseName, ipfsHash);
    const receipt = await tx.wait();

    // Find the CertificateIssued event
    const event = receipt.logs.find((log: any) => {
      try {
        const parsed = this.contract!.interface.parseLog(log);
        return parsed.name === 'CertificateIssued';
      } catch {
        return false;
      }
    });

    if (event) {
      const parsed = this.contract!.interface.parseLog(event);
      return parsed.args[0]; // certificateId
    }

    throw new Error('Certificate issued but event not found');
  }

  async verifyCertificate(certificateId: string): Promise<VerificationResult> {
    if (!this.contract) throw new Error('Contract not connected');

    const result = await this.contract.verifyCertificate(certificateId);
    
    return {
      isValid: result[0],
      issuerName: result[1],
      studentName: result[2],
      courseName: result[3],
      ipfsHash: result[4],
      issueDate: Number(result[5]),
    };
  }

  async getCertificateDetails(certificateId: string): Promise<CertificateData> {
    if (!this.contract) throw new Error('Contract not connected');

    const result = await this.contract.getCertificateDetails(certificateId);
    
    return {
      issuerName: result[0],
      studentName: result[1],
      courseName: result[2],
      ipfsHash: result[3],
      issueDate: Number(result[4]),
      isValid: result[5],
      issuer: result[6],
    };
  }

  async revokeCertificate(certificateId: string): Promise<void> {
    if (!this.contract) throw new Error('Contract not connected');
    await this.contract.revokeCertificate(certificateId);
  }

  async authorizeIssuer(issuerAddress: string): Promise<void> {
    if (!this.contract) throw new Error('Contract not connected');
    await this.contract.authorizeIssuer(issuerAddress);
  }

  async revokeIssuer(issuerAddress: string): Promise<void> {
    if (!this.contract) throw new Error('Contract not connected');
    await this.contract.revokeIssuer(issuerAddress);
  }

  // Helper function to generate certificate ID from data
  generateCertificateId(studentName: string, courseName: string, ipfsHash: string): string {
    const encoded = ethers.AbiCoder.defaultAbiCoder().encode(
      ['string', 'string', 'string', 'uint256'],
      [studentName, courseName, ipfsHash, Math.floor(Date.now() / 1000)]
    );
    return ethers.keccak256(encoded);
  }
}

// Global instance
export const blockchainService = new BlockchainService();

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any;
  }
}