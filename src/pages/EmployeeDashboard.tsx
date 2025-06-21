import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, clearCurrentUser, getUserById } from "@/lib/auth";
import {
  getFeedbacksForUser,
  getDashboardStats,
  acknowledgeFeedback,
} from "@/lib/feedback";
import { User, Feedback } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { FeedbackCard } from "@/components/ui/feedback-card";
import { DashboardStatsComponent } from "@/components/ui/dashboard-stats";
import {
  LogOut,
  MessageSquareHeart,
  TrendingUp,
  Calendar,
  CheckCircle,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [manager, setManager] = useState<User | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState<Feedback[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== "employee") {
      navigate("/login");
      return;
    }

    setUser(currentUser);

    if (currentUser.managerId) {
      const managerUser = getUserById(currentUser.managerId);
      setManager(managerUser || null);
    }

    const userFeedbacks = getFeedbacksForUser(currentUser.id);
    // Sort by most recent first
    const sortedFeedbacks = userFeedbacks.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    setFeedbacks(sortedFeedbacks);
  }, [navigate]);

  useEffect(() => {
    let filtered = feedbacks;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (feedback) =>
          feedback.strengths.toLowerCase().includes(searchTerm.toLowerCase()) ||
          feedback.areasToImprove
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
      );
    }

    // Apply sentiment filter
    if (sentimentFilter !== "all") {
      filtered = filtered.filter(
        (feedback) => feedback.sentiment === sentimentFilter,
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      const isAcknowledged = statusFilter === "acknowledged";
      filtered = filtered.filter(
        (feedback) => feedback.isAcknowledged === isAcknowledged,
      );
    }

    setFilteredFeedbacks(filtered);
  }, [feedbacks, searchTerm, sentimentFilter, statusFilter]);

  const handleLogout = () => {
    clearCurrentUser();
    navigate("/login");
  };

  const handleAcknowledge = (feedbackId: string) => {
    const updatedFeedback = acknowledgeFeedback(feedbackId);
    if (updatedFeedback) {
      setFeedbacks(
        feedbacks.map((f) => (f.id === feedbackId ? updatedFeedback : f)),
      );
    }
  };

  const handleViewFeedback = (feedbackId: string) => {
    navigate(`/feedback/${feedbackId}`);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const stats = getDashboardStats(user.id, "employee");
  const pendingFeedbacks = feedbacks.filter((f) => !f.isAcknowledged);
  const recentFeedbacks = feedbacks.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                  <MessageSquareHeart className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold">FeedbackFlow</h1>
                  <p className="text-sm text-muted-foreground">
                    Employee Dashboard
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{user.avatar}</AvatarFallback>
                </Avatar>
                <div className="text-right">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {user.role}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Welcome back, {user.name}</h2>
            <p className="text-muted-foreground">
              Track your feedback and professional growth
            </p>
          </div>
          {manager && (
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {manager.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{manager.name}</p>
                  <p className="text-xs text-muted-foreground">Your Manager</p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Pending Actions Alert */}
        {pendingFeedbacks.length > 0 && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              You have {pendingFeedbacks.length} pending feedback
              {pendingFeedbacks.length > 1 ? "s" : ""} that{" "}
              {pendingFeedbacks.length > 1 ? "require" : "requires"}{" "}
              acknowledgment.
            </AlertDescription>
          </Alert>
        )}

        {/* Stats */}
        <DashboardStatsComponent stats={stats} userRole="employee" />

        {/* Quick Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Growth Trend
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.positiveCount > stats.negativeCount
                  ? "Positive"
                  : stats.positiveCount === stats.negativeCount
                    ? "Stable"
                    : "Improving"}
              </div>
              <p className="text-xs text-muted-foreground">
                Overall feedback sentiment
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Latest Feedback
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {feedbacks.length > 0
                  ? new Date(feedbacks[0].createdAt).toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric" },
                    )
                  : "None"}
              </div>
              <p className="text-xs text-muted-foreground">
                {feedbacks.length > 0
                  ? "Most recent feedback"
                  : "No feedback yet"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Action Required
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {pendingFeedbacks.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Pending acknowledgments
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Feedback Preview */}
        {recentFeedbacks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentFeedbacks.map((feedback) => (
                  <FeedbackCard
                    key={feedback.id}
                    feedback={feedback}
                    currentUserRole="employee"
                    currentUserId={user.id}
                    onAcknowledge={handleAcknowledge}
                    onView={handleViewFeedback}
                    compact
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Feedback */}
        <Card>
          <CardHeader>
            <CardTitle>Your Feedback Timeline</CardTitle>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search your feedback..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select
                  value={sentimentFilter}
                  onValueChange={setSentimentFilter}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Sentiment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sentiment</SelectItem>
                    <SelectItem value="positive">Positive</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                    <SelectItem value="negative">Negative</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="acknowledged">Acknowledged</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredFeedbacks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {feedbacks.length === 0
                    ? "No feedback received yet. Your manager will provide feedback soon."
                    : "No feedback matches your current filters."}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFeedbacks.map((feedback) => (
                  <FeedbackCard
                    key={feedback.id}
                    feedback={feedback}
                    currentUserRole="employee"
                    currentUserId={user.id}
                    onAcknowledge={handleAcknowledge}
                    onView={handleViewFeedback}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
