import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, GraduationCap, Download, Share, Eye, Calendar, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StudentPanelProps {
  onBack: () => void;
}

export const StudentPanel = ({ onBack }: StudentPanelProps) => {
  const { toast } = useToast();
  const [studentCertificates, setStudentCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const studentProfile = {
    name: "John Doe",
    studentId: "STU-2024-001",
    walletAddress: "0xd3fa857f52553C4111224Ff5708293e6d0179ce1",
  };

  // 🔹 Fetch certificates from backend
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/certificates");
        const data = await res.json();
        setStudentCertificates(data);
        setLoading(false);
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to fetch certificates",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  // 🔹 Download certificate as JSON file
  const handleDownload = (certificate: any) => {
    const blob = new Blob([JSON.stringify(certificate, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${certificate.studentName || "certificate"}-${certificate._id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    toast({
      title: "Download Started",
      description: `Downloading certificate ${certificate._id}...`,
    });
  };

  // 🔹 Copy verification link
  const handleShare = (certificateId: string) => {
    const shareUrl = `http://localhost:5173/verify/${certificateId}`;
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Share Link Copied",
      description: "Verification link copied to clipboard",
    });
  };

  const getStatusBadge = (status: string) => {
    return (
      <Badge variant="default">
        <Award className="w-3 h-3 mr-1" />
        {status === "issued" ? "Issued" : "Verified"}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/5">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <GraduationCap className="w-8 h-8 text-accent mr-3" />
                Student Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage and share your blockchain certificates
              </p>
            </div>
          </div>
        </div>

        {/* Student Profile Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Student Profile</span>
              <Badge variant="default">Active</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <Label>Full Name</Label>
                <p className="font-medium text-lg">{studentProfile.name}</p>
              </div>
              <div>
                <Label>Student ID</Label>
                <p className="font-medium">{studentProfile.studentId}</p>
              </div>
              <div>
                <Label>Wallet Address</Label>
                <p className="font-mono text-sm text-muted-foreground break-all">
                  {studentProfile.walletAddress}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Certificates Grid */}
        {loading ? (
          <p className="text-center text-muted-foreground">Loading certificates...</p>
        ) : studentCertificates.length === 0 ? (
          <p className="text-center text-muted-foreground">No certificates found.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {studentCertificates.map((certificate) => (
              <Card
                key={certificate._id}
                className="hover:shadow-lg transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg leading-tight mb-2">
                        {certificate.course}
                      </CardTitle>
                      <CardDescription className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {certificate.issueDate}
                      </CardDescription>
                    </div>
                    {getStatusBadge(certificate.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Student:</span>
                      <span className="font-medium text-sm">{certificate.studentName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Grade:</span>
                      <span className="font-medium text-sm">{certificate.grade}</span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs">Blockchain Hash</Label>
                    <p className="font-mono text-xs text-muted-foreground break-all">
                      {certificate.hash}
                    </p>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(certificate)}
                      className="flex-1"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare(certificate._id)}
                      className="flex-1"
                    >
                      <Share className="w-3 h-3 mr-1" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm" className="px-3">
                      <Eye className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Label = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <label
    className={`text-xs font-medium text-muted-foreground uppercase tracking-wide ${className}`}
  >
    {children}
  </label>
);
