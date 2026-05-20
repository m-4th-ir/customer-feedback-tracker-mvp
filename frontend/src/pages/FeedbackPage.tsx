import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import FeedbackForm from '../components/FeedbackForm';
import FeedbackFilters from '../components/FeedbackFilters';
import FeedbackList from '../components/FeedbackList';
import type { Feedback, FeedbackCategory, FeedbackPriority } from '../types';
import { createFeedback, deleteFeedback, listFeedback, updateFeedback } from '../api';

const FeedbackPage: React.FC = () => {
  const [items, setItems] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{
    category?: FeedbackCategory | '';
    priority?: FeedbackPriority | '';
    reviewed?: 'all' | 'reviewed' | 'open';
  }>({ reviewed: 'all' });
  const [editing, setEditing] = useState<Feedback | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listFeedback({
        category: filters.category || undefined,
        priority: filters.priority || undefined,
        reviewed:
          filters.reviewed === 'all'
            ? undefined
            : filters.reviewed === 'reviewed'
            ? true
            : false,
      });
      setItems(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load feedback';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.category, filters.priority, filters.reviewed]);

  const handleCreate = async (payload: Parameters<typeof createFeedback>[0]) => {
    await createFeedback(payload);
    await load();
  };

  const handleUpdate = async (payload: Parameters<typeof createFeedback>[0]) => {
    if (!editing) return;
    await updateFeedback(editing.id, payload);
    setEditing(null);
    await load();
  };

  const handleDelete = async (item: Feedback) => {
    if (!window.confirm(`Delete feedback \"${item.title}\"?`)) return;
    await deleteFeedback(item.id);
    await load();
  };

  const handleToggleReviewed = async (item: Feedback) => {
    await updateFeedback(item.id, { reviewed: !item.reviewed });
    await load();
  };

  return (
    <Layout>
      <div className="space-y-6">
        <section aria-labelledby="feedback-form-heading">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 id="feedback-form-heading" className="text-base font-semibold text-slate-900">
                {editing ? 'Edit feedback' : 'New feedback'}
              </h2>
              <p className="mt-1 text-xs text-slate-600">
                Capture customer feedback with category, priority, and optional context.
              </p>
            </div>
            {editing && (
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="text-xs font-medium text-slate-600 hover:text-slate-900"
              >
                Cancel editing
              </button>
            )}
          </div>
          <FeedbackForm
            initial={editing ?? undefined}
            onSubmit={editing ? handleUpdate : handleCreate}
            onCancel={editing ? () => setEditing(null) : undefined}
          />
        </section>

        <section aria-labelledby="feedback-list-heading" className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 id="feedback-list-heading" className="text-base font-semibold text-slate-900">
                Feedback
              </h2>
              <p className="mt-1 text-xs text-slate-600">
                View, filter, edit, delete, and mark feedback as reviewed.
              </p>
            </div>
          </div>
          <FeedbackFilters
            category={filters.category}
            priority={filters.priority}
            reviewed={filters.reviewed}
            onChange={(partial) => setFilters((prev) => ({ ...prev, ...partial }))}
          />
          <FeedbackList
            items={items}
            loading={loading}
            error={error}
            onEdit={setEditing}
            onDelete={handleDelete}
            onToggleReviewed={handleToggleReviewed}
          />
        </section>
      </div>
    </Layout>
  );
};

export default FeedbackPage;
