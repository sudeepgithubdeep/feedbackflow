import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { getCurrentUser } from "@/lib/auth";
import { User } from "@/types";

// Pages
import Login from "./pages/Login";
import ManagerDashboard from "./pages/ManagerDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import SubmitFeedback from "./pages/SubmitFeedback";
import ViewFeedback from "./pages/ViewFeedback";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "manager" | "employee";
}

function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Redirect to appropriate dashboard based on user role
    return (
      <Navigate
        to={user.role === "manager" ? "/manager" : "/employee"}
        replace
      />
    );
  }

  return <>{children}</>;
}

// Root redirect based on auth status
function RootRedirect() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to appropriate dashboard based on role
  return (
    <Navigate to={user.role === "manager" ? "/manager" : "/employee"} replace />
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Root route - redirect based on auth status */}
          <Route path="/" element={<RootRedirect />} />

          {/* Authentication */}
          <Route path="/login" element={<Login />} />

          {/* Manager Routes */}
          <Route
            path="/manager"
            element={
              <ProtectedRoute requiredRole="manager">
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/submit-feedback"
            element={
              <ProtectedRoute requiredRole="manager">
                <SubmitFeedback />
              </ProtectedRoute>
            }
          />

          {/* Employee Routes */}
          <Route
            path="/employee"
            element={
              <ProtectedRoute requiredRole="employee">
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />

          {/* Shared Routes (both roles can access) */}
          <Route
            path="/feedback/:feedbackId"
            element={
              <ProtectedRoute>
                <ViewFeedback />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
