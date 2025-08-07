import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import QRCode from 'qrcode.react';
import { blockchainService, VerificationResult } from '../lib/blockchain';
import { ipfsService } from '../lib/ipfs';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Loader2, Search, CheckCircle, XCircle, Download, ExternalLink } from 'lucide-react';

interface VerificationFormData {
  certificateId: string;
}

export function CertificateVerifier() {
  const [isConnected, setIsConnected] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [certificateDetails, setCertificateDetails] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [qrCodeData, setQrCodeData] = useState<string>('');

  const { register, handleSubmit, formState: { errors } } = useForm<VerificationFormData>();

  const connectWallet = async () => {
    try {
      const connected = await blockchainService.connect();
      setIsConnected(connected);
    } catch (error) {
      setError('Failed to connect wallet');
    }
  };

  const onSubmit = async (data: VerificationFormData) => {
    setIsVerifying(true);
    setError('');
    setVerificationResult(null);
    setCertificateDetails(null);

    try {
      // Verify the certificate
      const result = await blockchainService.verifyCertificate(data.certificateId);
      setVerificationResult(result);

      if (result.isValid) {
        // Get full certificate details
        const details = await blockchainService.getCertificateDetails(data.certificateId);
        setCertificateDetails(details);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to verify certificate');
    } finally {
      setIsVerifying(false);
    }
  };

  const generateQRCode = (certificateId: string) => {
    const verificationUrl = `${window.location.origin}/verify/${certificateId}`;
    setQrCodeData(verificationUrl);
  };

  const downloadQRCode = () => {
    const canvas = document.getElementById('qr-code') as HTMLCanvasElement;
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'certificate-qr.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const openIPFSFile = (ipfsHash: string) => {
    const url = ipfsService.getIPFSGatewayURL(ipfsHash);
    window.open(url, '_blank');
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Verify Certificate</CardTitle>
        <CardDescription>
          Verify the authenticity of a certificate using its ID or QR code
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Wallet Connection */}
        {!isConnected ? (
          <div className="space-y-4">
            <Alert>
              <AlertDescription>
                Connect your MetaMask wallet to verify certificates
              </AlertDescription>
            </Alert>
            <Button onClick={connectWallet} className="w-full">
              Connect Wallet
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="verify" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="verify">Verify Certificate</TabsTrigger>
              <TabsTrigger value="qr">Generate QR Code</TabsTrigger>
            </TabsList>

            <TabsContent value="verify" className="space-y-6">
              {/* Verification Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="certificateId">Certificate ID</Label>
                  <Input
                    id="certificateId"
                    {...register('certificateId', { required: 'Certificate ID is required' })}
                    placeholder="Enter certificate ID"
                  />
                  {errors.certificateId && (
                    <p className="text-sm text-red-500">{errors.certificateId.message}</p>
                  )}
                </div>

                <Button type="submit" disabled={isVerifying} className="w-full">
                  {isVerifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Verify Certificate
                    </>
                  )}
                </Button>
              </form>

              {/* Verification Result */}
              {verificationResult && (
                <div className="space-y-4">
                  <Alert>
                    {verificationResult.isValid ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          Certificate is valid and authentic
                        </AlertDescription>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4" />
                        <AlertDescription>
                          Certificate is invalid or has been revoked
                        </AlertDescription>
                      </>
                    )}
                  </Alert>

                  {verificationResult.isValid && certificateDetails && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Certificate Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-500">Issuer</Label>
                            <p className="text-sm">{certificateDetails.issuerName}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-500">Student</Label>
                            <p className="text-sm">{certificateDetails.studentName}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-500">Course</Label>
                            <p className="text-sm">{certificateDetails.courseName}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium text-gray-500">Issue Date</Label>
                            <p className="text-sm">{formatDate(certificateDetails.issueDate)}</p>
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-500">IPFS Hash</Label>
                          <div className="flex items-center space-x-2">
                            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {certificateDetails.ipfsHash}
                            </code>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openIPFSFile(certificateDetails.ipfsHash)}
                            >
                              <ExternalLink className="h-3 w-3 mr-1" />
                              View File
                            </Button>
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-gray-500">Status</Label>
                          <Badge variant={certificateDetails.isValid ? "default" : "destructive"}>
                            {certificateDetails.isValid ? "Valid" : "Revoked"}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="qr" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="qr-certificate-id">Certificate ID for QR Code</Label>
                  <Input
                    id="qr-certificate-id"
                    placeholder="Enter certificate ID"
                    onChange={(e) => setQrCodeData(e.target.value)}
                  />
                </div>

                {qrCodeData && (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="p-4 bg-white rounded-lg border">
                      <QRCode
                        id="qr-code"
                        value={qrCodeData}
                        size={200}
                        level="H"
                        includeMargin={true}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button onClick={downloadQRCode} variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download QR Code
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500 text-center">
                      This QR code can be scanned to verify the certificate
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Error Messages */}
        {error && (
          <Alert>
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}