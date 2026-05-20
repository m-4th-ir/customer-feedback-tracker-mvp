import React, { useState } from 'react';
import type { Feedback, FeedbackCategory, FeedbackCreate, FeedbackPriority } from '../types';

interface FeedbackFormProps {
  initial?: Partial<Feedback>;
  onSubmit: (data: FeedbackCreate) => Promise<void> | void;
  onCancel?: () => void;
}

const categories: { value: FeedbackCategory; label: string }[] = [
  { value: 'bug', label: 'Bug' },
  { value: 'feature_request', label: 'Feature request' },
  { value: 'praise', label: 'Praise' },
];

const priorities: { value: FeedbackPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const FeedbackForm: React.FC<FeedbackFormProps> = ({ initial, onSubmit, onCancel }) => {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [category, setCategory] = useState<FeedbackCategory>(
    (initial?.category as FeedbackCategory) ?? 'bug',
  );
  const [priority, setPriority] = useState<FeedbackPriority>(
    (initial?.priority as FeedbackPriority) ?? 'medium',
  );
  const [description, setDescription] = useState(initial?.description ?? '');
  const [customerRef, setCustomerRef] = useState(initial?.customer_ref ?? '');
  const [source, setSource] = useState(initial?.source ?? '');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!category) {
      setError('Category is required');
      return;
    }

    if (!priority) {
      setError('Priority is required');
      return;
    }

    const payload: FeedbackCreate = {
      title: title.trim(),
      category,
      priority,
      description: description.trim() || undefined,
      customer_ref: customerRef.trim() || undefined,
      source: source.trim() || undefined,
    };

    try {
      setSubmitting(true);
      await onSubmit(payload);
      setTitle('');
      setDescription('');
      setCustomerRef('');
      setSource('');
      setCategory('bug');
      setPriority('medium');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit feedback';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
      aria-label="New feedback form"
    >
      <div>
        <label className="block text-sm font-medium text-slate-700" htmlFor="title">
          Title<span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-slate-700" htmlFor="category">
            Category<span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            value={category}
            onChange={(e) => setCategory(e.target.value as FeedbackCategory)}
            required
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700" htmlFor="priority">
            Priority<span className="text-red-500">*</span>
          </label>
          <select
            id="priority"
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            value={priority}
            onChange={(e) => setPriority(e.target.value as FeedbackPriority)}
            required
          >
            {priorities.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700" htmlFor="customerRef">
            Customer ref
          </label>
          <input
            id="customerRef"
            type="text"
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            value={customerRef}
            onChange={(e) => setCustomerRef(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700" htmlFor="source">
            Source
          </label>
          <input
            id="source"
            type="text"
            className="mt-1 block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />
        </div>
      </div>

      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}

      <div className="flex items-center justify-between gap-3 pt-2">
        <div className="text-xs text-slate-500">
          <span className="text-red-500">*</span> Required fields
        </div>
        <div className="flex gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-1"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Saving…' : 'Save feedback'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default FeedbackForm;
