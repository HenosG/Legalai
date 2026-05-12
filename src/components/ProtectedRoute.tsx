import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react"; // Switched to Clerk's hook

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isLoaded, userId } = useAuth(); // Clerk uses 'isLoaded' and 'userId'
  const location = useLocation();

  // 1. If Clerk is still "thinking" (checking cookies), show the spinner
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // 2. If there is NO userId, they aren't logged in—send them to Login
  if (!userId) {
    // We keep your "from: location" logic so they return here after signing in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. If we have a userId, let them in!
  return <>{children}</>;
};

export default ProtectedRoute;
