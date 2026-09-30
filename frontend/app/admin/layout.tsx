import type { Metadata } from "next";
import { AuthProvider } from "@/lib/admin/auth-context";

export const metadata: Metadata = {
  title: {
    default: "Admin - InfinityMind Tech",
    template: "%s | Admin",
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-root bg-slate-50 min-h-screen">
      <AuthProvider>{children}</AuthProvider>
    </div>
  );
}
