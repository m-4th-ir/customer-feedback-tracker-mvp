export type FeedbackCategory = 'bug' | 'feature_request' | 'praise';
export type FeedbackPriority = 'low' | 'medium' | 'high';

export interface Feedback {
  id: string;
  title: string;
  description?: string | null;
  category: FeedbackCategory;
  priority: FeedbackPriority;
  reviewed: boolean;
  customer_ref?: string | null;
  source?: string | null;
  created_at: string;
}

export interface FeedbackCreate {
  title: string;
  description?: string;
  category: FeedbackCategory;
  priority: FeedbackPriority;
  customer_ref?: string;
  source?: string;
}

export interface FeedbackUpdate {
  title?: string;
  description?: string;
  category?: FeedbackCategory;
  priority?: FeedbackPriority;
  reviewed?: boolean;
  customer_ref?: string;
  source?: string;
}

export interface DashboardSummaryItem {
  category: FeedbackCategory;
  priority: FeedbackPriority;
  count: number;
}

export interface DashboardSummaryResponse {
  items: DashboardSummaryItem[];
}
