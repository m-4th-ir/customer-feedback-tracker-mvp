import type {
  Feedback,
  FeedbackCategory,
  FeedbackCreate,
  FeedbackPriority,
  FeedbackUpdate,
  DashboardSummaryResponse,
} from './types';

const DEFAULT_API_BASE_URL = 'https://customer-feedback-tracker-mvp-backend.up.railway.app/api/v1';

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) || DEFAULT_API_BASE_URL;

function buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>) {
  const url = new URL(path, API_BASE_URL);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const data = await res.json();
      if (data && typeof data.detail === 'string') {
        message = data.detail;
      }
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(message);
  }
  return (await res.json()) as T;
}

export async function listFeedback(options?: {
  category?: FeedbackCategory;
  priority?: FeedbackPriority;
  reviewed?: boolean;
}): Promise<Feedback[]> {
  const url = buildUrl('/feedback/', options);
  const res = await fetch(url);
  return handleResponse<Feedback[]>(res);
}

export async function createFeedback(payload: FeedbackCreate): Promise<Feedback> {
  const url = buildUrl('/feedback/');
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<Feedback>(res);
}

export async function updateFeedback(
  id: string,
  payload: FeedbackUpdate,
): Promise<Feedback> {
  const url = buildUrl(`/feedback/${id}`);
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<Feedback>(res);
}

export async function deleteFeedback(id: string): Promise<void> {
  const url = buildUrl(`/feedback/${id}`);
  const res = await fetch(url, { method: 'DELETE' });
  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const data = await res.json();
      if (data && typeof data.detail === 'string') {
        message = data.detail;
      }
    } catch {
      // ignore
    }
    throw new Error(message);
  }
}

export async function getDashboardSummary(): Promise<DashboardSummaryResponse> {
  const url = buildUrl('/feedback/dashboard/summary');
  const res = await fetch(url);
  return handleResponse<DashboardSummaryResponse>(res);
}
