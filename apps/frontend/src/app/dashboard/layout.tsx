"use client";

import ProtectedRoute from "@/auth/ProtectedRoute";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import { AuthProvider, useAuth } from "@/context/AuthContext";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen">
        <DashboardNavbar user={user!} onLogout={logout} />
        <main className="flex-1 overflow-hidden">
          <section className="h-full">{children}</section>
        </main>
      </div>
    </ProtectedRoute>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <DashboardContent>{children}</DashboardContent>
    </AuthProvider>
  );
}
