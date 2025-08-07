import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { blockchainService } from '../lib/blockchain';
import { ipfsService } from '../lib/ipfs';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, Upload, CheckCircle, XCircle } from 'lucide-react';

interface CertificateFormData {
  issuerName: string;
  studentName: string;
  courseName: string;
  description: string;
}

export function CertificateIssuer() {
  const [isConnected, setIsConnected] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isIssuing, setIsIssuing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [ipfsHash, setIpfsHash] = useState<string>('');
  const [certificateId, setCertificateId] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CertificateFormData>();

  const connectWallet = async () => {
    try {
      const connected = await blockchainService.connect();
      if (connected) {
        setIsConnected(true);
        const address = await blockchainService.getConnectedAddress();
        if (address) {
          const authorized = await blockchainService.isAuthorizedIssuer(address);
          setIsAuthorized(authorized);
        }
      }
    } catch (error) {
      setError('Failed to connect wallet');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('File size must be less than 10MB');
      return;
    }

    if (!file.type.includes('pdf')) {
      setError('Please upload a PDF file');
      return;
    }

    setUploadedFile(file);
    setError('');
  };

  const uploadToIPFS = async () => {
    if (!uploadedFile) return;

    setIsUploading(true);
    setError('');

    try {
      const result = await ipfsService.uploadFile(uploadedFile);
      setIpfsHash(result.hash);
      setSuccess(`File uploaded to IPFS: ${result.hash}`);
    } catch (error) {
      setError('Failed to upload file to IPFS');
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: CertificateFormData) => {
    if (!ipfsHash) {
      setError('Please upload a certificate file first');
      return;
    }

    setIsIssuing(true);
    setError('');

    try {
      const certificateId = await blockchainService.issueCertificate(
        data.issuerName,
        data.studentName,
        data.courseName,
        ipfsHash
      );

      setCertificateId(certificateId);
      setSuccess(`Certificate issued successfully! ID: ${certificateId}`);
      reset();
      setUploadedFile(null);
      setIpfsHash('');
    } catch (error: any) {
      setError(error.message || 'Failed to issue certificate');
    } finally {
      setIsIssuing(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Issue Certificate</CardTitle>
        <CardDescription>
          Upload a certificate PDF and issue it on the blockchain for verification
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Wallet Connection */}
        {!isConnected ? (
          <div className="space-y-4">
            <Alert>
              <AlertDescription>
                Connect your MetaMask wallet to issue certificates
              </AlertDescription>
            </Alert>
            <Button onClick={connectWallet} className="w-full">
              Connect Wallet
            </Button>
          </div>
        ) : (
          <>
            {/* Authorization Check */}
            {!isAuthorized && (
              <Alert>
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  Your wallet is not authorized to issue certificates. Contact the contract owner.
                </AlertDescription>
              </Alert>
            )}

            {/* File Upload */}
            <div className="space-y-4">
              <Label htmlFor="certificate-file">Certificate PDF</Label>
              <Input
                id="certificate-file"
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
              {uploadedFile && (
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">
                    {uploadedFile.name} selected
                  </span>
                </div>
              )}
              {uploadedFile && !ipfsHash && (
                <Button
                  onClick={uploadToIPFS}
                  disabled={isUploading}
                  className="w-full"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading to IPFS...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload to IPFS
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Certificate Form */}
            {ipfsHash && (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="issuerName">Issuer Name</Label>
                    <Input
                      id="issuerName"
                      {...register('issuerName', { required: 'Issuer name is required' })}
                      placeholder="University Name"
                    />
                    {errors.issuerName && (
                      <p className="text-sm text-red-500">{errors.issuerName.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="studentName">Student Name</Label>
                    <Input
                      id="studentName"
                      {...register('studentName', { required: 'Student name is required' })}
                      placeholder="John Doe"
                    />
                    {errors.studentName && (
                      <p className="text-sm text-red-500">{errors.studentName.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="courseName">Course Name</Label>
                  <Input
                    id="courseName"
                    {...register('courseName', { required: 'Course name is required' })}
                    placeholder="Computer Science"
                  />
                  {errors.courseName && (
                    <p className="text-sm text-red-500">{errors.courseName.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    {...register('description')}
                    placeholder="Additional details about the certificate"
                    rows={3}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isIssuing || !isAuthorized}
                  className="w-full"
                >
                  {isIssuing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Issuing Certificate...
                    </>
                  ) : (
                    'Issue Certificate'
                  )}
                </Button>
              </form>
            )}

            {/* Success/Error Messages */}
            {success && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert>
                <XCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Certificate ID Display */}
            {certificateId && (
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800">Certificate Issued!</h4>
                <p className="text-sm text-green-600 mt-1">
                  Certificate ID: <code className="bg-green-100 px-2 py-1 rounded">{certificateId}</code>
                </p>
                <p className="text-xs text-green-500 mt-2">
                  This ID can be used to verify the certificate
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}