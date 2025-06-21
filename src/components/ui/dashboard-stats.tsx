import { DashboardStats } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle,
  Clock,
  MessageSquare,
} from "lucide-react";

interface DashboardStatsProps {
  stats: DashboardStats;
  userRole: "manager" | "employee";
}

export function DashboardStatsComponent({
  stats,
  userRole,
}: DashboardStatsProps) {
  const title = userRole === "manager" ? "Team Feedback" : "Your Feedback";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalFeedbacks}</div>
          <p className="text-xs text-muted-foreground">
            {userRole === "manager" ? "Given to team" : "Received"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Positive</CardTitle>
          <TrendingUp className="h-4 w-4 text-positive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-positive">
            {stats.positiveCount}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.totalFeedbacks > 0
              ? `${Math.round((stats.positiveCount / stats.totalFeedbacks) * 100)}% of total`
              : "No feedback yet"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Neutral</CardTitle>
          <Minus className="h-4 w-4 text-neutral" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-neutral">
            {stats.neutralCount}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.totalFeedbacks > 0
              ? `${Math.round((stats.neutralCount / stats.totalFeedbacks) * 100)}% of total`
              : "No feedback yet"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Negative</CardTitle>
          <TrendingDown className="h-4 w-4 text-negative" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-negative">
            {stats.negativeCount}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.totalFeedbacks > 0
              ? `${Math.round((stats.negativeCount / stats.totalFeedbacks) * 100)}% of total`
              : "No feedback yet"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Acknowledged</CardTitle>
          <CheckCircle className="h-4 w-4 text-success" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success">
            {stats.acknowledgedCount}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.totalFeedbacks > 0
              ? `${Math.round((stats.acknowledgedCount / stats.totalFeedbacks) * 100)}% acknowledged`
              : "No feedback yet"}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
          <Clock className="h-4 w-4 text-warning" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-warning">
            {stats.pendingCount}
          </div>
          <p className="text-xs text-muted-foreground">
            {userRole === "manager"
              ? "Awaiting acknowledgment"
              : "Requires your attention"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
