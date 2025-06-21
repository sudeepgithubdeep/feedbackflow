import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquareHeart, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();
  const user = getCurrentUser();

  const handleGoHome = () => {
    if (user) {
      navigate(user.role === "manager" ? "/manager" : "/employee");
    } else {
      navigate("/login");
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardContent className="pt-6 pb-8">
            <div className="text-center space-y-6">
              {/* Logo */}
              <div className="flex items-center justify-center">
                <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-2xl">
                  <MessageSquareHeart className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>

              {/* Error Message */}
              <div className="space-y-2">
                <h1 className="text-6xl font-bold text-primary">404</h1>
                <h2 className="text-xl font-semibold">Page Not Found</h2>
                <p className="text-muted-foreground">
                  The page you're looking for doesn't exist or has been moved.
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-4">
                <Button onClick={handleGoHome} className="w-full" size="lg">
                  <Home className="h-4 w-4 mr-2" />
                  {user ? "Go to Dashboard" : "Go to Login"}
                </Button>
                <Button
                  onClick={handleGoBack}
                  variant="outline"
                  className="w-full"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Button>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-primary">FeedbackFlow</span>{" "}
                  - Structured feedback for better team performance
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
