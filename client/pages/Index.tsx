import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, FileCheck, Lock, Zap, CheckCircle, Users, Globe, TrendingUp } from "lucide-react";

export default function Index() {
  const features = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Blockchain Security",
      description: "Certificates are secured by immutable blockchain technology, ensuring authenticity and preventing fraud."
    },
    {
      icon: <FileCheck className="h-6 w-6" />,
      title: "Instant Verification",
      description: "Verify certificates in seconds with our advanced cryptographic verification system."
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Tamper-Proof",
      description: "Once issued, certificates cannot be altered or forged, maintaining complete integrity."
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Lightning Fast",
      description: "Our optimized verification process delivers results instantly, saving time and resources."
    }
  ];

  const stats = [
    { value: "50K+", label: "Certificates Verified" },
    { value: "99.9%", label: "Uptime Guarantee" },
    { value: "200+", label: "Partner Institutions" },
    { value: "24/7", label: "Support Available" }
  ];

  const benefits = [
    {
      icon: <CheckCircle className="h-5 w-5 text-success" />,
      text: "Eliminate certificate fraud"
    },
    {
      icon: <CheckCircle className="h-5 w-5 text-success" />,
      text: "Reduce verification time by 95%"
    },
    {
      icon: <CheckCircle className="h-5 w-5 text-success" />,
      text: "Lower operational costs"
    },
    {
      icon: <CheckCircle className="h-5 w-5 text-success" />,
      text: "Increase trust and transparency"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blockchain-primary/5 via-transparent to-blockchain-secondary/5" />
        <div className="relative max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm">
            ✨ Powered by Blockchain Technology
          </Badge>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-blockchain-primary via-blockchain-accent to-blockchain-secondary bg-clip-text text-transparent">
              Secure Certificate
            </span>
            <br />
            <span className="text-foreground">Verification System</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed">
            Verify academic credentials, professional certifications, and achievements instantly using 
            our blockchain-powered platform. Trust, transparency, and security guaranteed.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link to="/verify">
              <Button size="lg" className="bg-blockchain-primary hover:bg-blockchain-primary/90 text-lg px-8 py-3">
                Verify Certificate
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              Learn More
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-blockchain-primary mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose CertifyChain?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built on cutting-edge blockchain technology to provide unparalleled security and trust.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-blockchain-primary/10 rounded-full w-fit">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-accent/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Transform Your <span className="text-blockchain-primary">Verification Process</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Say goodbye to manual verification processes and embrace the future of secure, 
                automated certificate validation powered by blockchain technology.
              </p>
              
              <div className="space-y-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    {benefit.icon}
                    <span className="text-base">{benefit.text}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-4">
                <Link to="/verify">
                  <Button className="bg-blockchain-primary hover:bg-blockchain-primary/90">
                    Start Verifying
                  </Button>
                </Link>
                <Button variant="outline">
                  Contact Sales
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <Card className="p-8 border-2 border-blockchain-primary/20">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blockchain-primary/10 rounded-lg">
                      <FileCheck className="h-5 w-5 text-blockchain-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">Certificate Uploaded</div>
                      <div className="text-sm text-muted-foreground">Processing verification...</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-success/10 rounded-lg">
                      <Shield className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <div className="font-semibold text-success">Verification Complete</div>
                      <div className="text-sm text-muted-foreground">Certificate is valid and authentic</div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-success/10 rounded-lg border border-success/20">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="font-medium text-success">Verified</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Issued by: University of Technology<br />
                      Date: March 15, 2024<br />
                      Hash: 0x1a2b3c4d...
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Secure Your Certificates?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of organizations already using CertifyChain for secure certificate verification.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/verify">
              <Button size="lg" className="bg-blockchain-primary hover:bg-blockchain-primary/90 text-lg px-8 py-3">
                Verify Now
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-3">
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
