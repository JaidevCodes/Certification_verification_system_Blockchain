# Blockchain Certificate Verification System - Setup Guide

This guide will walk you through setting up the complete blockchain certificate verification system.

## 🎯 Overview

The system consists of:
- **Smart Contract**: Solidity contract deployed on Polygon Mumbai testnet
- **Frontend**: React application with MetaMask integration
- **Storage**: IPFS via Pinata for certificate files
- **Verification**: QR codes and blockchain queries

## 📋 Prerequisites

### 1. Development Environment
- Node.js (v16 or higher)
- npm or yarn
- Git

### 2. Blockchain Requirements
- MetaMask browser extension
- Polygon Mumbai testnet MATIC tokens
- Infura account (optional)

### 3. IPFS Storage
- Pinata account for IPFS storage

## 🚀 Step-by-Step Setup

### Step 1: Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd blockchain-certificate-verification

# Install dependencies
npm install
```

### Step 2: Environment Configuration

1. **Copy environment file**:
   ```bash
   cp .env.example .env
   ```

2. **Configure environment variables**:
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

### Step 3: Get Polygon Mumbai MATIC

1. **Visit Polygon Faucet**: https://faucet.polygon.technology/
2. **Connect MetaMask**: Make sure you're on Mumbai testnet
3. **Request MATIC**: Get test tokens for gas fees

### Step 4: Configure MetaMask

1. **Install MetaMask**: https://metamask.io/
2. **Add Mumbai Testnet**:
   - Network Name: `Polygon Mumbai`
   - RPC URL: `https://polygon-mumbai.infura.io/v3/your-project-id`
   - Chain ID: `80001`
   - Currency Symbol: `MATIC`
   - Block Explorer: `https://mumbai.polygonscan.com/`

### Step 5: Set up Pinata (IPFS)

1. **Create Pinata Account**: https://app.pinata.cloud/
2. **Get API Keys**:
   - Go to API Keys in dashboard
   - Create new API key
   - Copy API Key and Secret API Key
3. **Update .env file** with your Pinata credentials

### Step 6: Deploy Smart Contract

1. **Compile Contract**:
   ```bash
   npm run compile:contract
   ```

2. **Deploy to Mumbai**:
   ```bash
   npm run deploy:mumbai
   ```

3. **Update Contract Address**:
   - Copy the deployed contract address
   - Update `VITE_CONTRACT_ADDRESS` in your `.env` file

### Step 7: Run the Application

```bash
npm run dev
```

Visit `http://localhost:5173` to access the application.

## 🔧 Configuration Details

### Smart Contract Deployment

The deployment script will:
- Check your MATIC balance
- Deploy the CertificateVerifier contract
- Verify the deployment
- Provide the contract address

### Environment Variables Explained

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_CONTRACT_ADDRESS` | Deployed smart contract address | Yes |
| `MUMBAI_RPC_URL` | Polygon Mumbai RPC endpoint | Yes |
| `PRIVATE_KEY` | Your wallet private key for deployment | Yes |
| `VITE_PINATA_API_KEY` | Pinata API key for IPFS uploads | Yes |
| `VITE_PINATA_SECRET_API_KEY` | Pinata secret API key | Yes |
| `POLYGONSCAN_API_KEY` | For contract verification | No |

### MetaMask Setup Details

**Network Configuration**:
- **Network Name**: Polygon Mumbai
- **RPC URL**: `https://polygon-mumbai.infura.io/v3/your-project-id`
- **Chain ID**: `80001`
- **Currency Symbol**: `MATIC`
- **Block Explorer**: `https://mumbai.polygonscan.com/`

## 🧪 Testing the Setup

### 1. Test Smart Contract

```bash
# Run tests
npx hardhat test
```

### 2. Test Frontend

1. **Connect Wallet**: Click "Connect Wallet" in the app
2. **Test Issuance**: Try issuing a test certificate
3. **Test Verification**: Verify the issued certificate

### 3. Test IPFS Upload

1. **Upload File**: Try uploading a PDF certificate
2. **Check IPFS**: Verify the file is accessible via IPFS gateway

## 🔍 Troubleshooting

### Common Issues

#### 1. "MetaMask not installed"
- Install MetaMask browser extension
- Make sure it's enabled

#### 2. "Insufficient MATIC balance"
- Get MATIC from Polygon faucet
- Check you're on Mumbai testnet

#### 3. "Contract deployment failed"
- Check your private key is correct
- Ensure you have enough MATIC
- Verify RPC URL is accessible

#### 4. "IPFS upload failed"
- Check Pinata API keys
- Verify file size (max 10MB)
- Ensure file is PDF format

#### 5. "Not authorized to issue certificates"
- Only authorized addresses can issue certificates
- Contact contract owner to get authorized

### Debug Commands

```bash
# Check contract compilation
npm run compile:contract

# Check deployment status
npx hardhat run scripts/deploy-mumbai.ts --network mumbai

# Run tests
npx hardhat test

# Check network connection
npx hardhat console --network mumbai
```

## 📚 Usage Examples

### Issuing a Certificate

1. **Connect Wallet**: Use MetaMask to connect
2. **Upload PDF**: Select certificate file
3. **Upload to IPFS**: Store file on IPFS
4. **Fill Details**: Enter issuer, student, and course info
5. **Issue**: Create blockchain record

### Verifying a Certificate

1. **Connect Wallet**: Use MetaMask to connect
2. **Enter ID**: Paste certificate ID or scan QR code
3. **Verify**: Check authenticity on blockchain
4. **View Details**: See certificate information

### Generating QR Code

1. **Enter Certificate ID**: Input the certificate ID
2. **Generate**: QR code appears automatically
3. **Download**: Save QR code image

## 🔒 Security Considerations

### Private Key Security
- Never commit private keys to version control
- Use environment variables
- Consider using hardware wallets for production

### Contract Security
- Smart contract is immutable once deployed
- Only authorized issuers can create certificates
- Owner can revoke certificates if needed

### IPFS Security
- Files are publicly accessible via IPFS
- Consider encryption for sensitive documents
- Use IPFS pinning for persistence

## 🚀 Production Deployment

### Frontend Deployment
- Build the application: `npm run build`
- Deploy to your preferred hosting service
- Update environment variables for production

### Smart Contract Deployment
- Deploy to Polygon mainnet (not Mumbai)
- Verify contract on PolygonScan
- Update contract address in production environment

### IPFS Configuration
- Use production IPFS gateway
- Consider dedicated IPFS node
- Implement backup strategies

## 📞 Support

If you encounter issues:

1. **Check the logs**: Look for error messages
2. **Verify configuration**: Ensure all environment variables are set
3. **Test components**: Try each part individually
4. **Check documentation**: Review this guide and README
5. **Open an issue**: Report bugs with detailed information

## 🔮 Next Steps

After successful setup:

1. **Test thoroughly**: Try all features
2. **Customize**: Modify UI and functionality as needed
3. **Scale**: Consider production deployment
4. **Enhance**: Add new features like batch operations
5. **Monitor**: Set up monitoring and analytics

---

**Happy coding! 🎉**