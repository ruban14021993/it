"use client";

import { AuthProvider } from "@/lib/admin/auth-context";
import AdminShell from "@/components/admin/AdminShell";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AdminShell>{children}</AdminShell>
    </AuthProvider>
  );
}
