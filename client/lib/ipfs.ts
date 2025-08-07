import axios from 'axios';

export interface IPFSUploadResult {
  hash: string;
  url: string;
  size: number;
}

export class IPFSService {
  private pinataApiKey: string;
  private pinataSecretApiKey: string;

  constructor() {
    this.pinataApiKey = process.env.VITE_PINATA_API_KEY || '';
    this.pinataSecretApiKey = process.env.VITE_PINATA_SECRET_API_KEY || '';
  }

  async uploadFile(file: File): Promise<IPFSUploadResult> {
    if (!this.pinataApiKey || !this.pinataSecretApiKey) {
      throw new Error('Pinata API keys not configured');
    }

    const formData = new FormData();
    formData.append('file', file);

    // Add metadata
    const metadata = JSON.stringify({
      name: file.name,
      description: 'Certificate uploaded via blockchain verification system',
      attributes: {
        type: 'certificate',
        timestamp: new Date().toISOString(),
      },
    });
    formData.append('pinataMetadata', metadata);

    try {
      const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'pinata_api_key': this.pinataApiKey,
            'pinata_secret_api_key': this.pinataSecretApiKey,
          },
        }
      );

      const { IpfsHash, PinSize } = response.data;
      
      return {
        hash: IpfsHash,
        url: `https://gateway.pinata.cloud/ipfs/${IpfsHash}`,
        size: PinSize,
      };
    } catch (error) {
      console.error('Error uploading to IPFS:', error);
      throw new Error('Failed to upload file to IPFS');
    }
  }

  async uploadJSON(data: any): Promise<IPFSUploadResult> {
    if (!this.pinataApiKey || !this.pinataSecretApiKey) {
      throw new Error('Pinata API keys not configured');
    }

    const jsonData = JSON.stringify(data);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const file = new File([blob], 'certificate-data.json', { type: 'application/json' });

    return this.uploadFile(file);
  }

  getIPFSGatewayURL(hash: string): string {
    return `https://gateway.pinata.cloud/ipfs/${hash}`;
  }

  async validateIPFSHash(hash: string): Promise<boolean> {
    try {
      const response = await axios.head(this.getIPFSGatewayURL(hash));
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }
}

export const ipfsService = new IPFSService();