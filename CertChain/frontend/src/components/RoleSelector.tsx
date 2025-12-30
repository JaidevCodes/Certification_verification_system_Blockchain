import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, UserCheck, Search, GraduationCap, Settings } from "lucide-react";

interface RoleSelectorProps {
  onRoleSelect: (role: 'admin' | 'issuer' | 'verifier' | 'student') => void;
}

export const RoleSelector = ({ onRoleSelect }: RoleSelectorProps) => {
  const roles = [
    {
      id: 'admin' as const,
      title: 'Admin Panel',
      description: 'System administration and user management',
      icon: Settings,
      color: 'admin'
    },
    {
      id: 'issuer' as const,
      title: 'Issuer Panel',
      description: 'Issue and manage certificates for institutions',
      icon: UserCheck,
      color: 'blockchain'
    },
    {
      id: 'verifier' as const,
      title: 'Verifier Panel',
      description: 'Verify certificate authenticity and validity',
      icon: Search,
      color: 'certificate'
    },
    {
      id: 'student' as const,
      title: 'Student Panel',
      description: 'View and manage your certificates',
      icon: GraduationCap,
      color: 'success'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/5 flex items-center justify-center p-6">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Shield className="w-12 h-12 text-primary mr-4" />
            <h1 className="text-4xl font-bold text-foreground">CertiChain</h1>
          </div>
          <p className="text-xl text-muted-foreground mb-2">
            Blockchain-Based Certificate Verification System
          </p>
          <p className="text-sm text-muted-foreground">
            Secure • Transparent • Tamper-Proof
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role) => {
            const IconComponent = role.icon;
            return (
              <Card 
                key={role.id}
                className="hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => onRoleSelect(role.id)}
              >
                <CardHeader className="text-center pb-2">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{role.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="mb-6 h-12 flex items-center justify-center">
                    {role.description}
                  </CardDescription>
                  <Button 
                    variant={role.color as any}
                    size="sm"
                    className="w-full"
                  >
                    Access Panel
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* <div className="text-center mt-12 space-y-2">
          <p className="text-sm text-muted-foreground">
            Contract Address: 0x862d6798Cf35823b565342804e3F474686372720
          </p>
          <p className="text-xs text-muted-foreground">
            Connected Account: 0xd3fa857f52553C4111224Ff5708293e6d0179ce1
          </p>
        </div> */}
      </div>
    </div>
  );
};