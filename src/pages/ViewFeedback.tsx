import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCurrentUser, getUserById } from "@/lib/auth";
import { getFeedbackById, acknowledgeFeedback } from "@/lib/feedback";
import { User, Feedback } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  MessageSquareHeart,
  Edit,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  User as UserIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ViewFeedback() {
  const navigate = useNavigate();
  const { feedbackId } = useParams<{ feedbackId: string }>();
  const { toast } = useToast();

  const [user, setUser] = useState<User | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [fromUser, setFromUser] = useState<User | null>(null);
  const [toUser, setToUser] = useState<User | null>(null);
  const [isAcknowledging, setIsAcknowledging] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }

    setUser(currentUser);

    if (!feedbackId) {
      navigate(currentUser.role === "manager" ? "/manager" : "/employee");
      return;
    }

    const feedbackData = getFeedbackById(feedbackId);
    if (!feedbackData) {
      toast({
        title: "Feedback Not Found",
        description: "The requested feedback could not be found.",
        variant: "destructive",
      });
      navigate(currentUser.role === "manager" ? "/manager" : "/employee");
      return;
    }

    // Check permissions - users can only view feedback they're involved in
    const canView =
      feedbackData.fromUserId === currentUser.id ||
      feedbackData.toUserId === currentUser.id;

    if (!canView) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to view this feedback.",
        variant: "destructive",
      });
      navigate(currentUser.role === "manager" ? "/manager" : "/employee");
      return;
    }

    setFeedback(feedbackData);
    setFromUser(getUserById(feedbackData.fromUserId) || null);
    setToUser(getUserById(feedbackData.toUserId) || null);
  }, [navigate, feedbackId, toast]);

  const handleAcknowledge = async () => {
    if (!feedback || !user) return;

    setIsAcknowledging(true);
    try {
      const updatedFeedback = acknowledgeFeedback(feedback.id);
      if (updatedFeedback) {
        setFeedback(updatedFeedback);
        toast({
          title: "Feedback Acknowledged",
          description: "Thank you for acknowledging this feedback.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to acknowledge feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAcknowledging(false);
    }
  };

  const handleEdit = () => {
    if (feedback) {
      navigate(`/submit-feedback?edit=${feedback.id}`);
    }
  };

  const handleBack = () => {
    navigate(user?.role === "manager" ? "/manager" : "/employee");
  };

  const getSentimentIcon = (sentiment: Feedback["sentiment"]) => {
    switch (sentiment) {
      case "positive":
        return <TrendingUp className="h-5 w-5 text-positive" />;
      case "negative":
        return <TrendingDown className="h-5 w-5 text-negative" />;
      default:
        return <Minus className="h-5 w-5 text-neutral" />;
    }
  };

  const getSentimentColor = (sentiment: Feedback["sentiment"]) => {
    switch (sentiment) {
      case "positive":
        return "feedback-positive";
      case "negative":
        return "feedback-negative";
      default:
        return "feedback-neutral";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!user || !feedback || !fromUser || !toUser) {
    return <div>Loading...</div>;
  }

  const isFromCurrentUser = feedback.fromUserId === user.id;
  const isToCurrentUser = feedback.toUserId === user.id;
  const canEdit = isFromCurrentUser && user.role === "manager";
  const canAcknowledge =
    isToCurrentUser && user.role === "employee" && !feedback.isAcknowledged;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <MessageSquareHeart className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Feedback Details</h1>
                <p className="text-sm text-muted-foreground">
                  Review feedback information
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Feedback Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-4">
                  {/* Participants */}
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{fromUser.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{fromUser.name}</p>
                        <p className="text-sm text-muted-foreground">Manager</p>
                      </div>
                    </div>
                    <ArrowLeft className="h-4 w-4 text-muted-foreground rotate-180" />
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{toUser.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{toUser.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Employee
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex flex-wrap items-center gap-4">
                    <Badge
                      className={`${getSentimentColor(feedback.sentiment)} text-sm`}
                    >
                      {getSentimentIcon(feedback.sentiment)}
                      <span className="ml-2 capitalize">
                        {feedback.sentiment}
                      </span>
                    </Badge>

                    <Badge
                      variant={feedback.isAcknowledged ? "default" : "outline"}
                      className="text-sm"
                    >
                      {feedback.isAcknowledged ? (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      ) : (
                        <Clock className="h-4 w-4 mr-2" />
                      )}
                      {feedback.isAcknowledged ? "Acknowledged" : "Pending"}
                    </Badge>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {formatDate(feedback.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  {canEdit && (
                    <Button onClick={handleEdit} variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  )}
                  {canAcknowledge && (
                    <Button
                      onClick={handleAcknowledge}
                      disabled={isAcknowledging}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {isAcknowledging ? "Acknowledging..." : "Acknowledge"}
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Feedback Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Strengths */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-green-700 dark:text-green-300 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {feedback.strengths}
                </p>
              </CardContent>
            </Card>

            {/* Areas to Improve */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-amber-700 dark:text-amber-300 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 rotate-45" />
                  Areas to Improve
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {feedback.areasToImprove}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Feedback Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Feedback Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-full text-primary-foreground text-sm font-medium">
                    1
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Feedback Created</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(feedback.createdAt)} by {fromUser.name}
                    </p>
                  </div>
                </div>

                {feedback.updatedAt !== feedback.createdAt && (
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-accent rounded-full text-accent-foreground text-sm font-medium">
                      2
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Feedback Updated</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(feedback.updatedAt)} by {fromUser.name}
                      </p>
                    </div>
                  </div>
                )}

                {feedback.isAcknowledged && feedback.acknowledgedAt && (
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-success rounded-full text-success-foreground text-sm font-medium">
                      <CheckCircle className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Feedback Acknowledged</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(feedback.acknowledgedAt)} by {toUser.name}
                      </p>
                    </div>
                  </div>
                )}

                {!feedback.isAcknowledged && isToCurrentUser && (
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-warning rounded-full text-warning-foreground text-sm font-medium">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Awaiting Acknowledgment</p>
                      <p className="text-sm text-muted-foreground">
                        Please review and acknowledge this feedback
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tags (if available) */}
          {feedback.tags && feedback.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {feedback.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
