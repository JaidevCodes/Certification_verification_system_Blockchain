import React, { useState } from 'react';
import { CertificateIssuer } from './CertificateIssuer';
import { CertificateVerifier } from './CertificateVerifier';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Shield, FileText, QrCode, Upload, Search } from 'lucide-react';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('verify');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-900">Blockchain Certificate Verification</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Secure, tamper-proof certificate verification using blockchain technology and IPFS storage
          </p>
          <div className="flex justify-center space-x-4 mt-4">
            <Badge variant="secondary" className="flex items-center space-x-1">
              <FileText className="h-3 w-3" />
              <span>Polygon Mumbai</span>
            </Badge>
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Upload className="h-3 w-3" />
              <span>IPFS Storage</span>
            </Badge>
            <Badge variant="secondary" className="flex items-center space-x-1">
              <QrCode className="h-3 w-3" />
              <span>QR Verification</span>
            </Badge>
          </div>
        </div>

        {/* Features Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                <Upload className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Issue Certificates</CardTitle>
              <CardDescription>
                Upload PDF certificates to IPFS and issue them on the blockchain
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <Search className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">Verify Authenticity</CardTitle>
              <CardDescription>
                Verify certificates using their unique blockchain ID
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                <QrCode className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg">QR Code Generation</CardTitle>
              <CardDescription>
                Generate QR codes for easy certificate verification
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Main Application */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="verify" className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <span>Verify Certificate</span>
            </TabsTrigger>
            <TabsTrigger value="issue" className="flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>Issue Certificate</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="verify" className="mt-6">
            <CertificateVerifier />
          </TabsContent>

          <TabsContent value="issue" className="mt-6">
            <CertificateIssuer />
          </TabsContent>
        </Tabs>

        {/* How It Works */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</span>
                  <span>Certificate Issuance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <p className="text-sm">Admin uploads certificate PDF to IPFS</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <p className="text-sm">Smart contract stores certificate metadata on blockchain</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <p className="text-sm">Unique certificate ID is generated and returned</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span className="bg-green-100 text-green-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</span>
                  <span>Certificate Verification</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <p className="text-sm">User scans QR code or enters certificate ID</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <p className="text-sm">System queries blockchain for certificate data</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <p className="text-sm">Returns verification result and certificate details</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Technical Details */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Technical Stack</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-sm">Blockchain</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-xs text-gray-600">Polygon Mumbai Testnet</p>
                <p className="text-xs text-gray-600">Solidity Smart Contracts</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-sm">Storage</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-xs text-gray-600">IPFS (InterPlanetary File System)</p>
                <p className="text-xs text-gray-600">Pinata Gateway</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-sm">Frontend</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-xs text-gray-600">React + TypeScript</p>
                <p className="text-xs text-gray-600">Tailwind CSS</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-sm">Wallet</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-xs text-gray-600">MetaMask Integration</p>
                <p className="text-xs text-gray-600">Ethers.js</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}