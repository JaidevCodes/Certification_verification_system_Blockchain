import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Upload, FileText, Hash, Search, CheckCircle, XCircle, Clock, Shield, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerificationResult {
  status: "valid" | "invalid" | "pending";
  certificateId: string;
  issuer: string;
  recipient: string;
  issueDate: string;
  expiryDate?: string;
  blockchainHash: string;
  blockNumber: number;
  timestamp: string;
}

export default function Verify() {
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [certificateHash, setCertificateHash] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setUploadedFile(files[0]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const simulateVerification = async () => {
    setIsVerifying(true);
    setVerificationResult(null);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock verification result
    const mockResult: VerificationResult = {
      status: "valid",
      certificateId: "CERT-2024-001234",
      issuer: "University of Technology",
      recipient: "John Smith",
      issueDate: "2024-03-15",
      expiryDate: "2029-03-15",
      blockchainHash: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z",
      blockNumber: 18756432,
      timestamp: "2024-03-15T10:30:00Z"
    };
    
    setVerificationResult(mockResult);
    setIsVerifying(false);
  };

  const handleVerifyFile = () => {
    if (uploadedFile) {
      simulateVerification();
    }
  };

  const handleVerifyHash = () => {
    if (certificateHash.trim()) {
      simulateVerification();
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "valid":
        return <CheckCircle className="h-5 w-5 text-success" />;
      case "invalid":
        return <XCircle className="h-5 w-5 text-destructive" />;
      case "pending":
        return <Clock className="h-5 w-5 text-warning" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "valid":
        return <Badge className="bg-success/10 text-success border-success/20">Valid</Badge>;
      case "invalid":
        return <Badge variant="destructive">Invalid</Badge>;
      case "pending":
        return <Badge className="bg-warning/10 text-warning border-warning/20">Pending</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-background to-accent/5 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Certificate Verification</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Verify the authenticity of certificates using our blockchain-powered system. 
            Upload a certificate file or enter the certificate hash to get started.
          </p>
        </div>

        {/* Verification Interface */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blockchain-primary" />
              Verify Certificate
            </CardTitle>
            <CardDescription>
              Choose your preferred verification method below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload File
                </TabsTrigger>
                <TabsTrigger value="hash" className="flex items-center gap-2">
                  <Hash className="h-4 w-4" />
                  Enter Hash
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-4">
                <div
                  className={cn(
                    "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
                    isDragActive
                      ? "border-blockchain-primary bg-blockchain-primary/5"
                      : "border-border hover:border-blockchain-primary/50"
                  )}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileSelect}
                  />
                  <div className="space-y-4">
                    <div className="mx-auto w-12 h-12 bg-blockchain-primary/10 rounded-full flex items-center justify-center">
                      <Upload className="h-6 w-6 text-blockchain-primary" />
                    </div>
                    <div>
                      <p className="text-lg font-medium">
                        {uploadedFile ? uploadedFile.name : "Drop your certificate here"}
                      </p>
                      <p className="text-muted-foreground">
                        {uploadedFile 
                          ? "File selected. Click verify to proceed."
                          : "or click to browse files"
                        }
                      </p>
                    </div>
                    {uploadedFile && (
                      <div className="flex items-center justify-center gap-2 text-sm text-success">
                        <FileText className="h-4 w-4" />
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    )}
                  </div>
                </div>
                <Button 
                  onClick={handleVerifyFile}
                  disabled={!uploadedFile || isVerifying}
                  className="w-full bg-blockchain-primary hover:bg-blockchain-primary/90"
                >
                  {isVerifying ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Verify Certificate
                    </>
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="hash" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="certificate-hash">Certificate Hash</Label>
                  <Input
                    id="certificate-hash"
                    placeholder="Enter certificate hash (e.g., 0x1a2b3c4d...)"
                    value={certificateHash}
                    onChange={(e) => setCertificateHash(e.target.value)}
                    className="font-mono"
                  />
                  <p className="text-sm text-muted-foreground">
                    Enter the blockchain hash associated with your certificate
                  </p>
                </div>
                <Button 
                  onClick={handleVerifyHash}
                  disabled={!certificateHash.trim() || isVerifying}
                  className="w-full bg-blockchain-primary hover:bg-blockchain-primary/90"
                >
                  {isVerifying ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Verify Hash
                    </>
                  )}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Verification Result */}
        {verificationResult && (
          <Card className="border-2 border-success/20 bg-success/5">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(verificationResult.status)}
                  Verification Result
                </div>
                {getStatusBadge(verificationResult.status)}
              </CardTitle>
              <CardDescription>
                Certificate verification completed successfully
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Certificate Details */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Certificate ID</Label>
                  <p className="font-mono text-sm">{verificationResult.certificateId}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(verificationResult.status)}
                    <span className="capitalize font-medium">{verificationResult.status}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Issuer</Label>
                  <p>{verificationResult.issuer}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Recipient</Label>
                  <p>{verificationResult.recipient}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Issue Date</Label>
                  <p>{new Date(verificationResult.issueDate).toLocaleDateString()}</p>
                </div>
                {verificationResult.expiryDate && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Expiry Date</Label>
                    <p>{new Date(verificationResult.expiryDate).toLocaleDateString()}</p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Blockchain Details */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blockchain-primary" />
                  Blockchain Details
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Transaction Hash</Label>
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-sm break-all">
                        {verificationResult.blockchainHash.slice(0, 20)}...
                      </p>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Block Number</Label>
                    <p className="font-mono text-sm">{verificationResult.blockNumber.toLocaleString()}</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Timestamp</Label>
                    <p className="text-sm">{new Date(verificationResult.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button variant="outline" className="flex-1">
                  Download Report
                </Button>
                <Button variant="outline" className="flex-1">
                  Share Result
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        <Card className="mt-8 bg-accent/30">
          <CardHeader>
            <CardTitle className="text-lg">Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium mb-2">Supported File Types</h4>
                <p className="text-muted-foreground">
                  PDF, JPG, PNG, DOC, DOCX files up to 10MB
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Hash Format</h4>
                <p className="text-muted-foreground">
                  64-character hexadecimal string starting with 0x
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Verification Time</h4>
                <p className="text-muted-foreground">
                  Most certificates are verified within seconds
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Support</h4>
                <p className="text-muted-foreground">
                  Contact us if you need assistance with verification
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
