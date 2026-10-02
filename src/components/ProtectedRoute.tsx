import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

export function ProtectedRoute({
  children,
}: {
  children: ReactNode;
}) {
  const { employee, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <Loader2 className="h-6 w-6 animate-spin text-brand" />
      </div>
    );
  }

  if (!employee) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
