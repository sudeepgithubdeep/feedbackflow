import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getCurrentUser, getTeamMembers } from "@/lib/auth";
import {
  createFeedback,
  updateFeedback,
  getFeedbackById,
} from "@/lib/feedback";
import { User, Feedback } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  MessageSquareHeart,
  Save,
  TrendingUp,
  TrendingDown,
  Minus,
  User as UserIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SubmitFeedback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  const [user, setUser] = useState<User | null>(null);
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [strengths, setStrengths] = useState("");
  const [areasToImprove, setAreasToImprove] = useState("");
  const [sentiment, setSentiment] = useState<
    "positive" | "neutral" | "negative"
  >("positive");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState<Feedback | null>(null);

  const editId = searchParams.get("edit");

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== "manager") {
      navigate("/login");
      return;
    }

    setUser(currentUser);
    setTeamMembers(getTeamMembers(currentUser.id));

    // If editing, load the feedback data
    if (editId) {
      const feedback = getFeedbackById(editId);
      if (feedback && feedback.fromUserId === currentUser.id) {
        setIsEditing(true);
        setEditingFeedback(feedback);
        setSelectedEmployee(feedback.toUserId);
        setStrengths(feedback.strengths);
        setAreasToImprove(feedback.areasToImprove);
        setSentiment(feedback.sentiment);
      } else {
        // Invalid feedback ID or user doesn't have permission
        navigate("/manager");
      }
    }
  }, [navigate, editId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !user ||
      !selectedEmployee ||
      !strengths.trim() ||
      !areasToImprove.trim()
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing && editingFeedback) {
        // Update existing feedback
        const updatedFeedback = updateFeedback(editingFeedback.id, {
          strengths: strengths.trim(),
          areasToImprove: areasToImprove.trim(),
          sentiment,
        });

        if (updatedFeedback) {
          toast({
            title: "Feedback Updated",
            description: "The feedback has been successfully updated.",
          });
          navigate("/manager");
        }
      } else {
        // Create new feedback
        const newFeedback = createFeedback({
          fromUserId: user.id,
          toUserId: selectedEmployee,
          strengths: strengths.trim(),
          areasToImprove: areasToImprove.trim(),
          sentiment,
          isAcknowledged: false,
        });

        if (newFeedback) {
          toast({
            title: "Feedback Submitted",
            description: "Your feedback has been successfully submitted.",
          });
          navigate("/manager");
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          "There was an error submitting the feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSentimentIcon = (sentimentValue: string) => {
    switch (sentimentValue) {
      case "positive":
        return <TrendingUp className="h-4 w-4 text-positive" />;
      case "negative":
        return <TrendingDown className="h-4 w-4 text-negative" />;
      default:
        return <Minus className="h-4 w-4 text-neutral" />;
    }
  };

  const selectedEmployeeData = teamMembers.find(
    (member) => member.id === selectedEmployee,
  );

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/manager")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <MessageSquareHeart className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">
                  {isEditing ? "Edit Feedback" : "Submit Feedback"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {isEditing
                    ? "Update existing feedback"
                    : "Provide structured feedback for your team member"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Employee Selection */}
            {!isEditing && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserIcon className="h-5 w-5" />
                    Select Team Member
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Label htmlFor="employee">Choose an employee</Label>
                    <Select
                      value={selectedEmployee}
                      onValueChange={setSelectedEmployee}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a team member..." />
                      </SelectTrigger>
                      <SelectContent>
                        {teamMembers.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {member.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">
                                  {member.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {member.email}
                                </p>
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Employee Info (when editing) */}
            {isEditing && selectedEmployeeData && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {selectedEmployeeData.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedEmployeeData.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedEmployeeData.email}
                      </p>
                    </div>
                    <Badge variant="outline" className="ml-auto">
                      Editing Feedback
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Feedback Form */}
            <Card>
              <CardHeader>
                <CardTitle>Feedback Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Strengths */}
                <div className="space-y-2">
                  <Label htmlFor="strengths" className="text-base font-medium">
                    Strengths <span className="text-destructive">*</span>
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Highlight what this team member does well and their positive
                    contributions.
                  </p>
                  <Textarea
                    id="strengths"
                    placeholder="e.g., Consistently delivers high-quality work, excellent problem-solving skills, great team collaboration..."
                    value={strengths}
                    onChange={(e) => setStrengths(e.target.value)}
                    className="min-h-32 resize-none"
                    required
                  />
                  <div className="text-xs text-muted-foreground text-right">
                    {strengths.length} characters
                  </div>
                </div>

                {/* Areas to Improve */}
                <div className="space-y-2">
                  <Label htmlFor="areas" className="text-base font-medium">
                    Areas to Improve <span className="text-destructive">*</span>
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Provide constructive suggestions for growth and development
                    opportunities.
                  </p>
                  <Textarea
                    id="areas"
                    placeholder="e.g., Could benefit from more proactive communication, consider taking on leadership opportunities..."
                    value={areasToImprove}
                    onChange={(e) => setAreasToImprove(e.target.value)}
                    className="min-h-32 resize-none"
                    required
                  />
                  <div className="text-xs text-muted-foreground text-right">
                    {areasToImprove.length} characters
                  </div>
                </div>

                {/* Sentiment */}
                <div className="space-y-2">
                  <Label className="text-base font-medium">
                    Overall Sentiment{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Choose the overall tone that best represents this feedback.
                  </p>
                  <Select
                    value={sentiment}
                    onValueChange={(
                      value: "positive" | "neutral" | "negative",
                    ) => setSentiment(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="positive">
                        <div className="flex items-center gap-2">
                          {getSentimentIcon("positive")}
                          <span>Positive - Strong performance and growth</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="neutral">
                        <div className="flex items-center gap-2">
                          {getSentimentIcon("neutral")}
                          <span>Neutral - Meeting expectations</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="negative">
                        <div className="flex items-center gap-2">
                          {getSentimentIcon("negative")}
                          <span>Needs Improvement - Requires attention</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/manager")}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  isSubmitting ||
                  !selectedEmployee ||
                  !strengths.trim() ||
                  !areasToImprove.trim()
                }
                className="flex-1"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting
                  ? isEditing
                    ? "Updating..."
                    : "Submitting..."
                  : isEditing
                    ? "Update Feedback"
                    : "Submit Feedback"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
