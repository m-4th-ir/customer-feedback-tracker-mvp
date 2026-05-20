import React from 'react';
import type { FeedbackCategory, FeedbackPriority } from '../types';

interface FeedbackFiltersProps {
  category?: FeedbackCategory | '';
  priority?: FeedbackPriority | '';
  reviewed?: 'all' | 'reviewed' | 'open';
  onChange: (filters: {
    category?: FeedbackCategory | '';
    priority?: FeedbackPriority | '';
    reviewed?: 'all' | 'reviewed' | 'open';
  }) => void;
}

const FeedbackFilters: React.FC<FeedbackFiltersProps> = ({
  category = '',
  priority = '',
  reviewed = 'all',
  onChange,
}) => {
  return (
    <div className="flex flex-wrap items-end gap-3 rounded-lg border border-slate-200 bg-white p-3 text-sm shadow-sm">
      <div>
        <label className="block text-xs font-medium text-slate-600" htmlFor="filter-category">
          Category
        </label>
        <select
          id="filter-category"
          className="mt-1 block w-40 rounded-md border border-slate-300 px-2 py-1.5 text-sm shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
          value={category}
          onChange={(e) => onChange({ category: e.target.value as FeedbackCategory | '' })}
        >
          <option value="">All</option>
          <option value="bug">Bug</option>
          <option value="feature_request">Feature request</option>
          <option value="praise">Praise</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600" htmlFor="filter-priority">
          Priority
        </label>
        <select
          id="filter-priority"
          className="mt-1 block w-32 rounded-md border border-slate-300 px-2 py-1.5 text-sm shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
          value={priority}
          onChange={(e) => onChange({ priority: e.target.value as FeedbackPriority | '' })}
        >
          <option value="">All</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600" htmlFor="filter-reviewed">
          Status
        </label>
        <select
          id="filter-reviewed"
          className="mt-1 block w-32 rounded-md border border-slate-300 px-2 py-1.5 text-sm shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
          value={reviewed}
          onChange={(e) => onChange({ reviewed: e.target.value as 'all' | 'reviewed' | 'open' })}
        >
          <option value="all">All</option>
          <option value="open">Open</option>
          <option value="reviewed">Reviewed</option>
        </select>
      </div>
    </div>
  );
};

export default FeedbackFilters;
