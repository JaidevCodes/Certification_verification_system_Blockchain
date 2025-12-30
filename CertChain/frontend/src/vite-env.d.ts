/// <reference types="vite/client" />

// Environment Variables Type Definitions
interface ImportMetaEnv {
    readonly VITE_APP_TITLE: string
    readonly VITE_BACKEND_URL: string
    readonly VITE_CONTRACT_ADDRESS: string
    readonly VITE_POLYGON_SCAN_URL: string
    readonly VITE_IPFS_GATEWAY: string
    readonly VITE_DEFAULT_CHAIN_ID: string
    readonly VITE_PINATA_API_KEY?: string
    readonly VITE_PINATA_SECRET_API_KEY?: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

// Ethereum Provider Type Extensions
interface Window {
    ethereum?: {
        request: (args: { method: string; params?: any[] }) => Promise<any>
        on: (event: string, callback: (...args: any[]) => void) => void
        removeListener: (event: string, callback: (...args: any[]) => void) => void
        isMetaMask?: boolean
        chainId?: string
        selectedAddress?: string
    }
}

// Certificate Data Types
interface CertificateMetadata {
    studentName: string
    course: string
    grade?: string
    description?: string
    issueDate: string
    issuer: string
    ipfsHash: string
    txHash?: string
    status: 'pending' | 'issued' | 'revoked'
}

interface VerificationResult {
    valid: boolean
    certificateId?: string
    issuerName?: string
    studentName?: string
    courseName?: string
    issuer?: string
    issueDate?: string
    ipfsHash?: string
    message?: string
}

// Contract ABI Type
declare module "*.json" {
    const value: any
    export default value
}

// Image and Asset Modules
declare module "*.png" {
    const value: string
    export default value
}

declare module "*.jpg" {
    const value: string
    export default value
}

declare module "*.jpeg" {
    const value: string
    export default value
}

declare module "*.svg" {
    const value: string
    export default value
}

declare module "*.gif" {
    const value: string
    export default value
}

// Custom CSS Modules
declare module "*.module.css" {
    const classes: { [key: string]: string }
    export default classes
}

declare module "*.module.scss" {
    const classes: { [key: string]: string }
    export default classes
}