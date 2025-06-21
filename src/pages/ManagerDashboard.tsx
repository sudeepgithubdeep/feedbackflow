import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, clearCurrentUser, getTeamMembers } from "@/lib/auth";
import {
  getFeedbacksByManager,
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
  Plus,
  Users,
  MessageSquareHeart,
  Filter,
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

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState<Feedback[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== "manager") {
      navigate("/login");
      return;
    }

    setUser(currentUser);
    setTeamMembers(getTeamMembers(currentUser.id));
    setFeedbacks(getFeedbacksByManager(currentUser.id));
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

  const handleCreateFeedback = () => {
    navigate("/submit-feedback");
  };

  const handleViewFeedback = (feedbackId: string) => {
    navigate(`/feedback/${feedbackId}`);
  };

  const handleEditFeedback = (feedbackId: string) => {
    navigate(`/submit-feedback?edit=${feedbackId}`);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const stats = getDashboardStats(user.id, "manager");

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
                    Manager Dashboard
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
              Manage feedback for your team of {teamMembers.length} members
            </p>
          </div>
          <Button onClick={handleCreateFeedback} size="lg">
            <Plus className="h-4 w-4 mr-2" />
            New Feedback
          </Button>
        </div>

        {/* Stats */}
        <DashboardStatsComponent stats={stats} userRole="manager" />

        {/* Team Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Your Team
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teamMembers.map((member) => {
                const memberFeedbacks = feedbacks.filter(
                  (f) => f.toUserId === member.id,
                );
                const latestFeedback = memberFeedbacks.sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime(),
                )[0];

                return (
                  <Card
                    key={member.id}
                    className="hover:shadow-sm transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar>
                          <AvatarFallback>{member.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="text-sm font-medium">{member.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {member.email}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Feedback given:</span>
                          <span className="font-medium">
                            {memberFeedbacks.length}
                          </span>
                        </div>
                        {latestFeedback && (
                          <Badge
                            variant="outline"
                            className="text-xs w-full justify-center"
                          >
                            Last: {latestFeedback.sentiment}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Feedback Management */}
        <Card>
          <CardHeader>
            <CardTitle>Feedback Management</CardTitle>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search feedback..."
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
                    ? "No feedback created yet. Start by giving feedback to your team members."
                    : "No feedback matches your current filters."}
                </p>
                {feedbacks.length === 0 && (
                  <Button onClick={handleCreateFeedback} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Feedback
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFeedbacks.map((feedback) => (
                  <FeedbackCard
                    key={feedback.id}
                    feedback={feedback}
                    currentUserRole="manager"
                    currentUserId={user.id}
                    onAcknowledge={handleAcknowledge}
                    onEdit={handleEditFeedback}
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
