import React from 'react';
import type { Feedback } from '../types';

interface FeedbackListProps {
  items: Feedback[];
  loading: boolean;
  error?: string | null;
  onEdit: (item: Feedback) => void;
  onDelete: (item: Feedback) => void;
  onToggleReviewed: (item: Feedback) => void;
}

const categoryLabel: Record<string, string> = {
  bug: 'Bug',
  feature_request: 'Feature request',
  praise: 'Praise',
};

const priorityLabel: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

const priorityBadgeClass: Record<string, string> = {
  low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  high: 'bg-rose-50 text-rose-700 border-rose-200',
};

const FeedbackList: React.FC<FeedbackListProps> = ({
  items,
  loading,
  error,
  onEdit,
  onDelete,
  onToggleReviewed,
}) => {
  if (loading) {
    return <p className="text-sm text-slate-600">Loading feedback…</p>;
  }

  if (error) {
    return (
      <p className="text-sm text-red-600" role="alert">
        {error}
      </p>
    );
  }

  if (!items.length) {
    return <p className="text-sm text-slate-500">No feedback found. Try adjusting filters.</p>;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th scope="col" className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Title
            </th>
            <th scope="col" className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Category
            </th>
            <th scope="col" className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Priority
            </th>
            <th scope="col" className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Customer
            </th>
            <th scope="col" className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Source
            </th>
            <th scope="col" className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              Created
            </th>
            <th scope="col" className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {items.map((item) => {
            const created = new Date(item.created_at);
            return (
              <tr key={item.id} className={item.reviewed ? 'bg-slate-50' : ''}>
                <td className="max-w-xs px-3 py-2 align-top">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">{item.title}</span>
                      {item.reviewed && (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
                          Reviewed
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="line-clamp-2 text-xs text-slate-600">{item.description}</p>
                    )}
                  </div>
                </td>
                <td className="px-3 py-2 align-top">
                  <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                    {categoryLabel[item.category] ?? item.category}
                  </span>
                </td>
                <td className="px-3 py-2 align-top">
                  <span
                    className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${
                      priorityBadgeClass[item.priority]
                    }`}
                  >
                    {priorityLabel[item.priority] ?? item.priority}
                  </span>
                </td>
                <td className="px-3 py-2 align-top text-xs text-slate-700">
                  {item.customer_ref || <span className="text-slate-400">—</span>}
                </td>
                <td className="px-3 py-2 align-top text-xs text-slate-700">
                  {item.source || <span className="text-slate-400">—</span>}
                </td>
                <td className="px-3 py-2 align-top text-xs text-slate-600">
                  {created.toLocaleDateString()} {created.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </td>
                <td className="px-3 py-2 align-top text-right text-xs">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onToggleReviewed(item)}
                      className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-1"
                    >
                      {item.reviewed ? 'Mark open' : 'Mark reviewed'}
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit(item)}
                      className="rounded-md border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-1"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(item)}
                      className="rounded-md border border-rose-200 px-2 py-1 text-xs font-medium text-rose-700 hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:ring-offset-1"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default FeedbackList;
