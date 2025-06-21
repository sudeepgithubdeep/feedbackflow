export interface User {
  id: string;
  name: string;
  email: string;
  role: "manager" | "employee";
  managerId?: string; // For employees, references their manager
  teamMemberIds?: string[]; // For managers, list of their team members
  avatar?: string;
}

export interface Feedback {
  id: string;
  fromUserId: string; // Manager who gave the feedback
  toUserId: string; // Employee who received the feedback
  strengths: string;
  areasToImprove: string;
  sentiment: "positive" | "neutral" | "negative";
  createdAt: string;
  updatedAt: string;
  isAcknowledged: boolean;
  acknowledgedAt?: string;
  tags?: string[];
}

export interface DashboardStats {
  totalFeedbacks: number;
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  acknowledgedCount: number;
  pendingCount: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}
