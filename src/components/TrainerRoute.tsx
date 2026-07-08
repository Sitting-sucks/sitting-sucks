import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useRole } from "@/hooks/useRole";
import { Loader2 } from "lucide-react";

interface TrainerRouteProps {
  children: React.ReactNode;
}

const TrainerRoute = ({ children }: TrainerRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const { isTrainer, loading: roleLoading } = useRole();

  // Show loading while checking auth and role
  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Redirect to home if not a trainer
  if (!isTrainer) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default TrainerRoute;
