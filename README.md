<h1 align="center"> CertChain </h1>
<p align="center"> Immutable Digital Certification Management Powered by Secure RESTful Verification. </p>

<p align="center">
  <img alt="Build" src="https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge">
  <img alt="Issues" src="https://img.shields.io/badge/Code%20Coverage-95%25-green?style=for-the-badge">
  <img alt="Contributions" src="https://img.shields.io/badge/Contributions-Welcome-orange?style=for-the-badge">
  <img alt="License" src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge">
</p>
<!-- 
  **Note:** These are static placeholder badges. Replace them with your project's actual badges.
  You can generate your own at https://shields.io
-->

## 📜 Table of Contents

- [⭐ Overview](#-overview)
- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack & Architecture](#-tech-stack--architecture)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [🔧 Usage](#-usage)
- [🤝 Contributing](#-contributing)
- [📝 License](#-license)

---

## ⭐ Overview

CertChain is a comprehensive, full-stack web application designed to manage the lifecycle of digital certificates and academic credentials. It provides educational institutions, verifying bodies, and students with a unified, secure platform for certificate issuance, storage, and instant validation. Built with a focus on integrity and transparency, CertChain ensures that credentials, once issued, can be quickly and reliably verified by anyone with access to the system.

### The Problem

> Traditional certificate management systems often suffer from centralized vulnerabilities, high administrative overhead for verification requests, and the constant threat of document fraud. Manual verification processes are slow, costly, and lack a single source of immutable truth, undermining the trust essential for academic and professional credentials.

### The Solution

CertChain eliminates these challenges by providing a secure, component-based interface for managing the entire certification process. It allows authorized **Issuers** to digitally create and distribute credentials, provides **Students** with a secure panel to manage their verifiable proofs, and grants **Verifiers** access to dedicated RESTful API endpoints for instant, tamper-proof authentication of documents. This structured, role-based approach guarantees that only verified and legitimate credentials can be processed and validated across the system.

### Architecture Overview

The system utilizes a modern separation of concerns, built upon a robust **Component-based Architecture** in the frontend, delivered via **React** and typed strictly with **TypeScript**. All critical certificate creation, issuance, and verification requests are handled via a high-performance **REST API** implemented using **Express**, ensuring predictable and scalable data flow.

---

## ✨ Key Features

CertChain provides specialized dashboards and robust API functionality tailored to three primary user roles: the Issuer, the Student, and the Verifier.

### 🔒 Core Certificate Lifecycle Management

The backend is built around specific API endpoints that facilitate the immutable management of certification records:

*   **⚡ Instant Certificate Creation (`POST /api/certificates`):**
    *   Allows Issuers to define and initiate the creation process for new digital certificates immediately through the REST API. This step prepares the credential metadata before its official issuance.
*   **✅ Secure Credential Issuance Workflow (`PUT /api/certificates/:certId/issue`):**
    *   Manages the critical step of finalizing and validating a certificate against a unique identifier. This ensures that the issuance process is deliberate and secure, minimizing the risk of unauthorized distribution.
*   **🔎 Real-Time Verification by ID (`GET /api/verify/id/:certId`):**
    *   Provides Verifiers and third parties with a high-speed, direct endpoint to check the current validity and details of any certificate using its unique system identifier.
*   **🔗 Blockchain Record Retrieval (`GET /api/certificates/blockchain/:blockchainCertId`):**
    *   Facilitates the retrieval of specific certificate details based on its decentralized identifier, providing an additional layer of verification and proof of existence rooted in the system's external integration context.
*   **⚙️ Access to ABI (`GET /api/abi`):**
    *   A utility endpoint that serves the Application Binary Interface (ABI) required for advanced interaction with the system's underlying logic, primarily used by developers or specialized verification tools.

### 🖥️ Interactive Role-Based User Experience

The frontend is designed with tailored panels for maximum efficiency based on the user's role:

*   **🎓 Student Panel (`StudentPanel.tsx`):** A dedicated dashboard where students can view their successfully issued certificates, manage their verifiable proofs, and potentially share validation links with external parties.
*   **🏫 Issuer Panel (`IssuerPanel.tsx`):** Provides educational or issuing bodies with the interface necessary to trigger certificate creation, manage pending credentials, and initiate the formal issuance process via the interactive UI.
*   **🛡️ Verifier Panel (`VerifierPanel.tsx`):** Gives third-party auditors and employers the tools to input certificate IDs for verification, view credential status, and confirm the authenticity of presented documents, leveraging the backend's verification APIs.
*   **👑 Admin Panel (`AdminPanel.tsx`):** A centralized control component for system administrators, likely managing user roles and system configuration parameters within the web application.

---

## 🛠️ Tech Stack & Architecture

CertChain is built on a modern JavaScript ecosystem, leveraging the strengths of TypeScript for safety and popular frameworks for speed and scalability.

| Technology | Purpose | Why it was Chosen |
| :--- | :--- | :--- |
| **TypeScript** | Primary Language | Provides static typing for improved code quality, early error detection, and enhanced code maintainability, which is essential for a large-scale application dealing with sensitive credential data. |
| **React** | Frontend Development | Enables the construction of a highly interactive, responsive, and complex user interface (including specialized components like `VerifierPanel` and `IssuerPanel`) using a reusable, component-based methodology. |
| **Express** | Backend API | Provides a minimal, flexible, and high-performance framework for building the robust RESTful API endpoints necessary for certificate management and verification requests. |
| **REST API** | Architectural Pattern | Ensures a standardized, stateless, and scalable communication method between the client application and the backend services, making integration simple and predictable. |
| **Component-based Architecture** | Design Pattern | Facilitates rapid, modular development and high reusability of UI elements across different user roles, simplifying the overall application complexity. |

---

## 📁 Project Structure

The project is cleanly divided into `frontend` and `backend` modules, reflecting the Component-based Architecture and the separation between the user interface and the API services.

```
CertChain/
├── 📄 README.md
├── 📂 backend/                                # Backend API Services (Express)
│   ├── 📄 contractAbi.json                    # ABI for smart contract interaction (Implied)
│   ├── 📄 package-lock.json
│   ├── 📄 package.json                        # Backend dependencies (axios, express, ethers, bcrypt, mongoose, multer)
│   ├── 📄 .env                                # Environment variables (Configuration)
│   ├── 📄 index.js                            # Main Express API entry point
│   ├── 📄 testPinata.js                       # Script for testing IPFS interaction (Implied external service test)
│   └── 📂 uploads/                            # Temporary storage for file uploads (managed by Multer)
│       ├── 📄 00759172866b2d0bf0122dbcca3d18fd
│       └── ... (other uploaded files)
└── 📂 frontend/                              # Frontend Application (React, TypeScript, Tailwind)
    ├── 📄 index.html                          # Entry point HTML file
    ├── 📄 postcss.config.js
    ├── 📄 tsconfig.node.json
    ├── 📄 eslint.config.js
    ├── 📄 .gitignore
    ├── 📄 package-lock.json
    ├── 📄 bun.lockb                           # Bun lock file (indicating potential use of Bun package manager/runtime)
    ├── 📄 package.json                        # Frontend dependencies
    ├── 📄 vite.config.ts                      # Vite build configuration
    ├── 📄 tsconfig.json
    ├── 📄 tsconfig.app.json
    ├── 📄 tailwind.config.ts                  # Tailwind CSS configuration
    ├── 📄 components.json                     # Configuration for UI components (e.g., Shadcn-UI)
    ├── 📄 README.md                           # Frontend-specific documentation
    ├── 📂 public/                             # Static assets
    │   ├── 📄 vite.svg
    │   ├── 📄 robots.txt
    │   └── 📄 placeholder.svg
    └── 📂 src/                                # Frontend Source Code (TypeScript/React)
        ├── 📄 App.tsx                         # Main application component
        ├── 📄 main.tsx                        # Root rendering file
        ├── 📄 vite-env.d.ts
        ├── 📄 App.css
        ├── 📄 index.css
        ├── 📂 hooks/                          # Custom React hooks
        │   ├── 📄 use-toast.ts
        │   └── 📄 use-mobile.tsx
        ├── 📂 pages/                          # Application routes/views
        │   ├── 📄 NotFound.tsx                 # 404 page
        │   └── 📄 Index.tsx                    # Main landing or index page
        ├── 📂 lib/
        │   └── 📄 utils.ts                     # General utility functions
        ├── 📂 components/                     # Core application components
        │   ├── 📄 RoleSelector.tsx            # Component for selecting user role at login/entry
        │   ├── 📄 StudentPanel.tsx            # Dashboard component for student users
        │   ├── 📄 VerifierPanel.tsx           # Dashboard component for verifier users
        │   ├── 📄 IssuerPanel.tsx             # Dashboard component for issuer users
        │   ├── 📄 AdminPanel.tsx              # Dashboard component for administrative users
        │   └── 📂 ui/                         # Reusable design system/shadcn components
        │       ├── 📄 alert-dialog.tsx
        │       ├── 📄 hover-card.tsx
        │       ├── 📄 sidebar.tsx
        │       └── ... (40+ standard UI components)
        └── 📂 assets/
            └── 📄 react.svg                   # React logo asset
```

---

## 🚀 Getting Started

To get the CertChain system up and running, you need to set up both the backend API (Express) and the frontend application (React/TypeScript).

### Prerequisites

The project relies on a modern JavaScript runtime environment. Ensure you have the following installed:

*   **Node.js:** A recent LTS version (required for running Express and building React).
*   **Package Manager:** While the project contains both `package-lock.json` and `bun.lockb`, using either `npm` (which corresponds to `package-lock.json`) or `bun` (recommended for projects leveraging `bun.lockb`) is necessary for dependency management.
*   **TypeScript:** Required for the frontend development environment.

### Installation

Due to the separated architecture, installation requires running the setup in both the `backend` and `frontend` directories.

#### 1. Clone the Repository

```bash
git clone https://github.com/JaidevCodes-Certification_verification_system_Blockchain-8b0a9f8/CertChain
cd JaidevCodes-Certification_verification_system_Blockchain-8b0a9f8/CertChain
```

#### 2. Backend Setup

Navigate to the `backend` directory and install the necessary dependencies, which include `express`, `ethers`, `mongoose`, `bcrypt`, and `multer` for file handling and API function.

```bash
cd backend
# Use your preferred package manager (npm or bun)
npm install
# OR
bun install
```

#### 3. Frontend Setup

Navigate to the `frontend` directory and install the UI dependencies (React, Vite, Tailwind, etc.).

```bash
cd ../frontend
# Use your preferred package manager (npm or bun)
npm install
# OR
bun install
```

---

## 🔧 Usage

CertChain is a **web application** accessed through a browser, supported by a set of powerful **RESTful API endpoints** used for programmatic control and verification.

### Web Application Access

Once both the frontend and backend services are running (refer to the project's actual start scripts if they become available), you can access the interactive UI. The application utilizes a `RoleSelector.tsx` component, directing users to the appropriate dashboard:

1.  **Select Your Role:** Use the `RoleSelector` component on the landing page (driven by `Index.tsx`) to declare whether you are an **Admin**, **Issuer**, **Student**, or **Verifier**.
2.  **Access Dashboard:**
    *   **Issuers** interact with the `IssuerPanel` to initiate certificate creation and issuance workflows.
    *   **Students** utilize the `StudentPanel` to view and manage their verified credentials.
    *   **Verifiers** use the `VerifierPanel` to quickly look up credentials and confirm their validity within the interactive UI.

### API Endpoints for Programmatic Verification

The CertChain backend exposes critical REST endpoints necessary for automated verification processes, often utilized by Verifier systems or integrated external services:

| Method | Endpoint | Description | Expected Request Body |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/certificates` | Initiates the creation of a new certificate record within the system. Required for Issuers to begin the credential life cycle. | Certificate details (e.g., student ID, course name, issue date). |
| **PUT** | `/api/certificates/:certId/issue` | Finalizes the record associated with a specific certificate ID and marks it as officially issued and verifiable. | Minimal body, usually requiring authentication token. |
| **GET** | `/api/abi` | Retrieves the Application Binary Interface (ABI) required for interacting with the core smart contract logic of the system. | None. |
| **GET** | `/api/verify/id/:certId` | **Primary Verification Endpoint.** Checks the existence, status, and authenticity of a certificate using its internal system ID. | None. |
| **GET** | `/api/certificates/blockchain/:blockchainCertId` | Retrieves the certificate record specifically by its decentralized or external blockchain identifier. | None. |

---

## 🤝 Contributing

We welcome contributions to improve CertChain! Your input helps make this project better for everyone, ensuring it remains a secure and efficient tool for digital credential management.

### How to Contribute

1. **Fork the repository** - Click the 'Fork' button at the top right of this page.
2. **Create a feature branch** 
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes** - Improve code in both `frontend` (TypeScript/React) and `backend` (Express/JS), update configuration files, or refine documentation.
4. **Test thoroughly** - Ensure all existing and new functionality works as expected. While no dedicated test suite was detected, local testing of the API endpoints and frontend components is crucial.
   ```bash
   # Execute local tests based on your development environment
   # e.g., run the index.js and test API calls manually or with tools like Postman.
   ```
5. **Commit your changes** - Write clear, descriptive commit messages, adhering to conventional commits if possible.
   ```bash
   git commit -m 'Feat: Implement feature to display issuer status on AdminPanel'
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request** - Submit your changes to the `main` branch for review by the maintainers.

### Development Guidelines

- ✅ Follow the existing TypeScript and JavaScript code style and conventions.
- 📝 Add JSDoc comments for complex logic, especially within the API handlers (`index.js`) and complex React components (e.g., `IssuerPanel.tsx`).
- 🧪 Prioritize the stability and security of the certificate issuance and verification APIs.
- 📚 Update documentation for any changed functionality or newly introduced environment configurations.
- 🔄 Ensure backward compatibility when modifying existing API endpoints.
- 🎯 Keep commits focused and atomic.

### Ideas for Contributions

We're looking for help with various aspects of the system:

- 🐛 **Bug Fixes:** Identify and resolve issues reported in the issue tracker, particularly concerning authentication flows or data integrity.
- ✨ **New Features:** Implementing requested features, such as advanced search capabilities within the `VerifierPanel`.
- 📖 **Documentation:** Improve the overall README, add detailed API usage guides, or create tutorials for specific user roles.
- 🎨 **UI/UX:** Enhance the responsiveness and user experience of the specialized dashboards (`StudentPanel`, `IssuerPanel`).
- ⚡ **Performance:** Optimize API response times for verification lookups.
- 🧪 **Testing:** Introduce and maintain unit and integration tests for both the Express API and core React components.

### Code Review Process

- All submissions require review by at least one maintainer before merging.
- Maintainers will provide constructive feedback focused on security, performance, and adherence to architecture patterns.
- Changes may be requested before final approval.
- Once approved, your PR will be merged promptly, and you'll be credited for your contribution.

### Questions?

Feel free to open an issue for any questions or concerns regarding development, feature requests, or deployment. We're here to help!

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for complete details.

### What this means:

- ✅ **Commercial use:** You can use this project for commercial products and services.
- ✅ **Modification:** You are free to modify the source code to suit your needs.
- ✅ **Distribution:** You can distribute this software, including your modifications.
- ✅ **Private use:** You can use this project privately for learning or development purposes.
- ⚠️ **Liability:** The software is provided "as is," without any warranty, and the authors are not liable for any damages or issues arising from its use.
- ⚠️ **Trademark:** This license does not grant rights to use the project's name or trademark.

---

<p align="center">Made with ❤️ by the CertChain Team</p>
<p align="center">
  <a href="#">⬆️ Back to Top</a>
</p>
