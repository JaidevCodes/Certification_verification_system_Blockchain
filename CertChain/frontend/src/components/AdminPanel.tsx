import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, FileCheck, AlertTriangle, Activity, Settings, Shield } from "lucide-react";

interface AdminPanelProps {
  onBack: () => void;
}

export const AdminPanel = ({ onBack }: AdminPanelProps) => {
  const stats = [
    { label: "Total Users", value: "1,247", icon: Users, change: "+12%" },
    { label: "Certificates Issued", value: "3,456", icon: FileCheck, change: "+8%" },
    { label: "Verifications Today", value: "89", icon: Activity, change: "+24%" },
    { label: "Pending Issues", value: "3", icon: AlertTriangle, change: "-2%" },
  ];

  const recentActivities = [
    { action: "New issuer registered", entity: "MIT University", time: "2 hours ago", status: "success" },
    { action: "Certificate verified", entity: "John Doe - CS Degree", time: "5 hours ago", status: "info" },
    { action: "Bulk certificate issue", entity: "Stanford - 150 certificates", time: "1 day ago", status: "success" },
    { action: "Failed verification attempt", entity: "Invalid hash submitted", time: "2 days ago", status: "warning" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-destructive/5">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <Shield className="w-8 h-8 text-destructive mr-3" />
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">Monitor and manage the certificate system</p>
            </div>
          </div>
          <Button variant="admin">
            <Settings className="w-4 h-4 mr-2" />
            System Settings
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            const isPositive = stat.change.startsWith("+");
            return (
              <Card
                key={index}
                className="hover:shadow-lg transition-all duration-300 border border-border/50"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                  <IconComponent className="w-5 h-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs">
                    <span className={isPositive ? "text-green-600" : "text-red-600"}>
                      {stat.change}
                    </span>{" "}
                    from last month
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest system updates and events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.entity}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                    <Badge
                      variant={
                        activity.status === "success"
                          ? "default"
                          : activity.status === "warning"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Blockchain & infrastructure health</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <StatusRow label="Blockchain Connection" value="Connected" variant="default" />
                <StatusRow label="Smart Contract Status" value="Active" variant="default" />
                <StatusRow label="Database Status" value="Healthy" variant="default" />
                <StatusRow label="API Response Time" value="125ms" variant="secondary" />
                <StatusRow label="Last Backup" value="2 hours ago" variant="secondary" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const StatusRow = ({
  label,
  value,
  variant,
}: {
  label: string;
  value: string;
  variant: "default" | "secondary" | "destructive";
}) => (
  <div className="flex items-center justify-between p-2 rounded-md bg-muted/20">
    <span className="text-sm">{label}</span>
    <Badge variant={variant}>{value}</Badge>
  </div>
);
