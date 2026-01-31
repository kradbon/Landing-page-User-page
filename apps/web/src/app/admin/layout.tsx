import { Suspense } from "react";
import { AdminShell } from "@/widgets/admin-shell";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background text-text" />}>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}
