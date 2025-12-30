import { useState } from "react";
import { RoleSelector } from "@/components/RoleSelector";
import { AdminPanel } from "@/components/AdminPanel";
import { IssuerPanel } from "@/components/IssuerPanel";
import { VerifierPanel } from "@/components/VerifierPanel";
import { StudentPanel } from "@/components/StudentPanel";

type UserRole = 'admin' | 'issuer' | 'verifier' | 'student' | null;

const Index = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>(null);

  const handleRoleSelect = (role: UserRole) => {
    setCurrentRole(role);
  };

  const handleBackToRoles = () => {
    setCurrentRole(null);
  };

  const renderCurrentPanel = () => {
    switch (currentRole) {
      case 'admin':
        return <AdminPanel onBack={handleBackToRoles} />;
      case 'issuer':
        return <IssuerPanel onBack={handleBackToRoles} />;
      case 'verifier':
        return <VerifierPanel onBack={handleBackToRoles} />;
      case 'student':
        return <StudentPanel onBack={handleBackToRoles} />;
      default:
        return <RoleSelector onRoleSelect={handleRoleSelect} />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderCurrentPanel()}
    </div>
  );
};

export default Index;