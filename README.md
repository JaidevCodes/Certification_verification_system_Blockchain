Blockchain-Based Certificate Verification System

A decentralized, tamper-proof platform for issuing and verifying academic and professional certificates using Blockchain, IPFS, and Smart Contracts.

📌 Project Overview

In the digital era, certificate authenticity is critical for education, employment, and professional validation. Traditional certificate management systems rely on centralized databases, making them vulnerable to forgery, tampering, and manual verification delays.

This project proposes a Blockchain-Based Certificate Verification System that leverages Polygon blockchain, IPFS, and smart contracts to ensure:

Immutable certificate records

Transparent and trustless verification

Decentralized file storage

Instant public verification without intermediaries

The system enables authorized issuers to issue certificates on-chain and allows anyone to verify their authenticity using a Certificate ID or IPFS CID 

Project Report on Blockchain Ce…

.

🎯 Objectives

The primary objectives of this project are:

To design a decentralized certificate issuance and verification platform

To store certificate files securely using IPFS (via Pinata)

To record certificate metadata immutably on the Polygon Amoy Testnet

To enable real-time verification via smart contracts

To provide a user-friendly web interface for issuers and verifiers

To eliminate certificate forgery and reduce verification time and cost 

Project Report on Blockchain Ce…

✨ Key Features

Decentralized and tamper-proof certificate records

Blockchain-based verification (no central authority required)

IPFS integration for distributed certificate storage

MetaMask-based secure transaction signing

Verification using Certificate ID or IPFS CID

Web dashboard for certificate issuance and verification

Transparent and publicly verifiable records on PolygonScan

🏗️ System Architecture

The system follows a four-tier architecture:

Frontend (Presentation Layer)

React + TypeScript + Tailwind CSS

Issuer and Verifier dashboards

Backend (Application Layer)

Node.js + Express

REST APIs for uploads, issuance, and verification

Storage Layer

MongoDB Atlas (certificate metadata)

IPFS via Pinata (certificate PDF files)

Blockchain Layer

Solidity smart contracts

Deployed on Polygon Amoy Testnet

This layered architecture ensures modularity, scalability, and security 

Project Report on Blockchain Ce…

.

🔁 System Workflow

Issuer uploads a certificate (PDF)

File is pinned to IPFS using Pinata → returns CID

Metadata is stored in MongoDB

Issuer initiates blockchain transaction via MetaMask

Smart contract records certificate data immutably

Verifier checks authenticity using CID or Certificate ID

Verification results are fetched directly from blockchain 

Project Report on Blockchain Ce…

🧠 Smart Contract Functionality

The Solidity smart contract provides:

issueCertificate() – Issues and stores certificate metadata on-chain

verifyById() – Verifies certificate using blockchain ID

verifyByCID() – Verifies certificate using IPFS hash

revokeCertificate() – Invalidates a certificate (issuer-only)

Once issued, certificate data cannot be modified or deleted, ensuring immutability and trust.

🧪 Testing & Validation

The system was tested using:

Unit Testing – API and smart contract functions

Integration Testing – Frontend ↔ Backend ↔ Blockchain ↔ IPFS

Smart Contract Testing – Remix IDE + Polygon Amoy

UI Testing – Issuer and Verifier panels

Security Testing – JWT, CORS, private key protection

All test cases passed successfully, confirming reliability and correctness 

Project Report on Blockchain Ce…

.

🔐 Security Considerations

Blockchain immutability prevents data tampering

IPFS ensures decentralized file availability

MetaMask secures private keys and transaction signing

JWT authentication protects IPFS uploads

Backend access restricted via environment variables

🛠️ Tools & Technologies
Layer	Technology
Frontend	React, TypeScript, Tailwind CSS
Backend	Node.js, Express
Blockchain	Solidity, Polygon Amoy Testnet
Storage	IPFS (Pinata), MongoDB Atlas
Web3	ethers.js
Wallet	MetaMask
Dev Tools	VS Code, Remix IDE, Postman
Version Control	Git & GitHub
📂 Repository Structure
certchain/
├── contracts/        # Solidity smart contracts
├── backend/          # Node.js + Express APIs
├── frontend/         # React + TypeScript UI
├── .env.example      # Environment variable template
└── README.md         # Project documentation

🚀 Future Scope

NFT-based certificates

Multi-blockchain support (Ethereum, BSC, Avalanche)

Encrypted certificate storage on IPFS

QR-code based instant verification

Mobile application (React Native / Flutter)

Decentralized Identity (DID) integration

👨‍🎓 Team Members

Bachelor of Technology – Computer Science & Engineering (2022–2026)
I.K. Gujral Punjab Technical University, Mohali Campus – 1

Aryan Roy (Roll No. 2228925)

Jaidev (Roll No. 2228936)

Shubham Mandal (Roll No. 2228967)

Project Mentor:
Dr. Monika Sachdeva

📜 License

This project is developed for academic purposes.
Open-source usage is permitted with proper attribution.
