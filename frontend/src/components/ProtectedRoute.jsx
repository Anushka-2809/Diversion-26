import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, loading, userRole } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-sky-50/50 to-slate-50 pt-20">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-sky-500 mx-auto" />
          <p className="mt-4 text-sm text-muted-foreground">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
