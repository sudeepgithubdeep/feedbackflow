import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authenticateUser, setCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, MessageSquareHeart, User, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const user = await authenticateUser(email, password);
      if (user) {
        setCurrentUser(user);
        navigate(user.role === "manager" ? "/manager" : "/employee");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const demoCredentials = [
    {
      role: "Manager",
      email: "sarah.johnson@company.com",
      password: "manager123",
      name: "Sarah Johnson",
    },
    {
      role: "Employee",
      email: "mike.chen@company.com",
      password: "employee123",
      name: "Mike Chen",
    },
  ];

  const fillDemo = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-2xl">
              <MessageSquareHeart className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">FeedbackFlow</h1>
            <p className="text-muted-foreground mt-2">
              Structured feedback for better team performance
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <Card className="border-dashed">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-center">Demo Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {demoCredentials.map((cred) => (
              <div
                key={cred.email}
                className="flex items-center justify-between p-3 rounded-lg border bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                onClick={() => fillDemo(cred.email, cred.password)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-background rounded-full">
                    {cred.role === "Manager" ? (
                      <Users className="h-4 w-4" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{cred.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {cred.email}
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {cred.role}
                </Badge>
              </div>
            ))}
            <p className="text-xs text-muted-foreground text-center">
              Click to auto-fill credentials
            </p>
          </CardContent>
        </Card>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                size="lg"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>
            Built with{" "}
            <span className="text-primary font-medium">FeedbackFlow</span> for
            better team communication
          </p>
        </div>
      </div>
    </div>
  );
}
