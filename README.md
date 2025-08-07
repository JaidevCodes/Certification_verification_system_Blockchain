# Blockchain Certificate Verification System

A secure, tamper-proof certificate verification system built on Polygon Mumbai testnet using blockchain technology and IPFS storage.

## 🚀 Features

- **Certificate Issuance**: Upload PDF certificates to IPFS and issue them on the blockchain
- **Certificate Verification**: Verify certificates using unique blockchain IDs
- **QR Code Generation**: Generate QR codes for easy certificate verification
- **MetaMask Integration**: Seamless wallet connection for blockchain interactions
- **IPFS Storage**: Decentralized storage for certificate files
- **Real-time Verification**: Instant verification results from the blockchain

## 🛠️ Technology Stack

- **Blockchain**: Polygon Mumbai Testnet
- **Smart Contracts**: Solidity
- **Storage**: IPFS (InterPlanetary File System) via Pinata
- **Frontend**: React + TypeScript + Tailwind CSS
- **Wallet**: MetaMask + Ethers.js
- **QR Codes**: qrcode.react

## 📋 Prerequisites

Before running this project, you'll need:

1. **Node.js** (v16 or higher)
2. **MetaMask** browser extension
3. **Polygon Mumbai MATIC** tokens for gas fees
4. **Pinata account** for IPFS storage
5. **Infura account** (optional, for RPC endpoint)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd blockchain-certificate-verification
npm install
```

### 2. Environment Setup

Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Blockchain Configuration
VITE_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000
MUMBAI_RPC_URL=https://polygon-mumbai.infura.io/v3/your-project-id
PRIVATE_KEY=your-private-key-here

# IPFS Configuration (Pinata)
VITE_PINATA_API_KEY=your-pinata-api-key
VITE_PINATA_SECRET_API_KEY=your-pinata-secret-api-key

# Optional: PolygonScan API Key for contract verification
POLYGONSCAN_API_KEY=your-polygonscan-api-key
```

### 3. Deploy Smart Contract

1. **Get Polygon Mumbai MATIC**:
   - Visit [Polygon Faucet](https://faucet.polygon.technology/)
   - Get test MATIC tokens

2. **Deploy Contract**:
   ```bash
   npm run compile:contract
   npm run deploy:contract
   ```

3. **Update Contract Address**:
   - Copy the deployed contract address
   - Update `VITE_CONTRACT_ADDRESS` in your `.env` file

### 4. Configure IPFS (Pinata)

1. Create a [Pinata account](https://app.pinata.cloud/)
2. Get your API keys from the dashboard
3. Update the Pinata API keys in your `.env` file

### 5. Run the Application

```bash
npm run dev
```

Visit `http://localhost:5173` to access the application.

## 🔧 Configuration Guide

### Getting Polygon Mumbai MATIC

1. Visit [Polygon Faucet](https://faucet.polygon.technology/)
2. Connect your MetaMask wallet
3. Select Mumbai testnet
4. Request test MATIC tokens

### Setting up Pinata

1. Sign up at [Pinata](https://app.pinata.cloud/)
2. Go to API Keys in your dashboard
3. Create a new API key
4. Copy the API Key and Secret API Key
5. Add them to your `.env` file

### MetaMask Configuration

1. Install [MetaMask](https://metamask.io/)
2. Add Polygon Mumbai testnet:
   - Network Name: Polygon Mumbai
   - RPC URL: `https://polygon-mumbai.infura.io/v3/your-project-id`
   - Chain ID: `80001`
   - Currency Symbol: `MATIC`
   - Block Explorer: `https://mumbai.polygonscan.com/`

## 📖 Usage Guide

### Issuing Certificates

1. **Connect Wallet**: Click "Connect Wallet" and approve MetaMask
2. **Upload Certificate**: Select a PDF certificate file
3. **Upload to IPFS**: Click "Upload to IPFS" to store the file
4. **Fill Details**: Enter issuer name, student name, and course name
5. **Issue Certificate**: Click "Issue Certificate" to create the blockchain record

### Verifying Certificates

1. **Connect Wallet**: Connect your MetaMask wallet
2. **Enter Certificate ID**: Paste the certificate ID or scan QR code
3. **Verify**: Click "Verify Certificate" to check authenticity
4. **View Details**: See certificate details and IPFS file link

### Generating QR Codes

1. **Enter Certificate ID**: Input the certificate ID
2. **Generate QR**: The QR code will be generated automatically
3. **Download**: Click "Download QR Code" to save the image

## 🔒 Security Features

- **Tamper-proof**: Certificates are stored on the blockchain
- **Decentralized**: No single point of failure
- **Transparent**: All certificate data is publicly verifiable
- **Immutable**: Once issued, certificates cannot be modified
- **Revocable**: Authorized issuers can revoke certificates

## 🏗️ Smart Contract Features

### CertificateVerifier Contract

- **Issue Certificates**: Create new certificates with metadata
- **Verify Certificates**: Check certificate validity
- **Revoke Certificates**: Invalidate certificates
- **Authorize Issuers**: Manage who can issue certificates
- **Event Logging**: Track all certificate operations

### Key Functions

```solidity
// Issue a new certificate
function issueCertificate(
    string _issuerName,
    string _studentName,
    string _courseName,
    string _ipfsHash
) public returns (bytes32)

// Verify a certificate
function verifyCertificate(bytes32 _certificateId) 
    public view returns (bool, string, string, string, string, uint256)

// Revoke a certificate
function revokeCertificate(bytes32 _certificateId) public
```

## 🧪 Testing

### Local Development

```bash
# Run tests
npm test

# Compile contracts
npm run compile:contract

# Deploy to local network
npx hardhat node
npm run deploy:contract
```

### Testnet Deployment

```bash
# Deploy to Mumbai testnet
npm run deploy:contract
```

## 📁 Project Structure

```
├── contracts/
│   └── CertificateVerifier.sol    # Smart contract
├── client/
│   ├── components/
│   │   ├── Dashboard.tsx          # Main dashboard
│   │   ├── CertificateIssuer.tsx  # Certificate issuance
│   │   └── CertificateVerifier.tsx # Certificate verification
│   ├── lib/
│   │   ├── blockchain.ts          # Blockchain service
│   │   └── ipfs.ts               # IPFS service
│   └── App.tsx                   # Main app component
├── scripts/
│   └── deploy.ts                 # Deployment script
├── hardhat.config.ts             # Hardhat configuration
└── package.json                  # Dependencies
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

1. Check the [documentation](link-to-docs)
2. Open an [issue](link-to-issues)
3. Contact the development team

## 🔮 Future Enhancements

- [ ] Batch certificate issuance
- [ ] Advanced certificate templates
- [ ] Mobile app integration
- [ ] API for third-party integrations
- [ ] Multi-chain support
- [ ] Advanced analytics dashboard
- [ ] Certificate expiration dates
- [ ] Digital signatures integration

---

**Built with ❤️ using blockchain technology**