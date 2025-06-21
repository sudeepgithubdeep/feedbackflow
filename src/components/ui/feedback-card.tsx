import { Feedback } from "@/types";
import { getUserById } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  CheckCircle,
  Clock,
  Edit,
  Eye,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FeedbackCardProps {
  feedback: Feedback;
  currentUserRole: "manager" | "employee";
  currentUserId: string;
  onAcknowledge?: (id: string) => void;
  onEdit?: (id: string) => void;
  onView?: (id: string) => void;
  compact?: boolean;
}

export function FeedbackCard({
  feedback,
  currentUserRole,
  currentUserId,
  onAcknowledge,
  onEdit,
  onView,
  compact = false,
}: FeedbackCardProps) {
  const fromUser = getUserById(feedback.fromUserId);
  const toUser = getUserById(feedback.toUserId);
  const isFromCurrentUser = feedback.fromUserId === currentUserId;
  const isToCurrentUser = feedback.toUserId === currentUserId;

  const getSentimentIcon = (sentiment: Feedback["sentiment"]) => {
    switch (sentiment) {
      case "positive":
        return <TrendingUp className="h-4 w-4 text-positive" />;
      case "negative":
        return <TrendingDown className="h-4 w-4 text-negative" />;
      default:
        return <Minus className="h-4 w-4 text-neutral" />;
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
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="w-full transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">
                {fromUser?.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{fromUser?.name}</span>
                <span className="text-xs text-muted-foreground">to</span>
                <span className="text-sm font-medium">{toUser?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs",
                    getSentimentColor(feedback.sentiment),
                  )}
                >
                  {getSentimentIcon(feedback.sentiment)}
                  <span className="ml-1 capitalize">{feedback.sentiment}</span>
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {formatDate(feedback.createdAt)}
                </span>
                {feedback.isAcknowledged ? (
                  <Badge variant="secondary" className="text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Acknowledged
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView?.(feedback.id)}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              {isFromCurrentUser && currentUserRole === "manager" && (
                <DropdownMenuItem onClick={() => onEdit?.(feedback.id)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Feedback
                </DropdownMenuItem>
              )}
              {isToCurrentUser &&
                currentUserRole === "employee" &&
                !feedback.isAcknowledged && (
                  <DropdownMenuItem
                    onClick={() => onAcknowledge?.(feedback.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Acknowledge
                  </DropdownMenuItem>
                )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      {!compact && (
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">
                Strengths
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feedback.strengths}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-amber-700 dark:text-amber-300 mb-1">
                Areas to Improve
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feedback.areasToImprove}
              </p>
            </div>

            {feedback.tags && feedback.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-2">
                {feedback.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs px-2 py-0.5"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
