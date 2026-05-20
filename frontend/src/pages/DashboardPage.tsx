import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../components/Layout';
import { getDashboardSummary } from '../api';
import type { DashboardSummaryItem } from '../types';

const DashboardPage: React.FC = () => {
  const [items, setItems] = useState<DashboardSummaryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getDashboardSummary();
        setItems(data.items);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load dashboard';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const byCategory = useMemo(() => {
    const map: Record<string, number> = {};
    for (const item of items) {
      map[item.category] = (map[item.category] ?? 0) + item.count;
    }
    return map;
  }, [items]);

  const byPriority = useMemo(() => {
    const map: Record<string, number> = {};
    for (const item of items) {
      map[item.priority] = (map[item.priority] ?? 0) + item.count;
    }
    return map;
  }, [items]);

  const total = items.reduce((sum, item) => sum + item.count, 0);

  return (
    <Layout>
      <div className="space-y-6">
        <section>
          <h2 className="text-base font-semibold text-slate-900">Dashboard</h2>
          <p className="mt-1 text-xs text-slate-600">
            Open (unreviewed) feedback by category and priority.
          </p>
        </section>

        {loading && <p className="text-sm text-slate-600">Loading dashboard…</p>}
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        {!loading && !error && (
          <>
            <section className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Open feedback
                </h3>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{total}</p>
                <p className="mt-1 text-xs text-slate-600">Total unreviewed items</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  By category
                </h3>
                <dl className="mt-2 space-y-1 text-sm text-slate-700">
                  <div className="flex justify-between">
                    <dt>Bug</dt>
                    <dd>{byCategory['bug'] ?? 0}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Feature request</dt>
                    <dd>{byCategory['feature_request'] ?? 0}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Praise</dt>
                    <dd>{byCategory['praise'] ?? 0}</dd>
                  </div>
                </dl>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  By priority
                </h3>
                <dl className="mt-2 space-y-1 text-sm text-slate-700">
                  <div className="flex justify-between">
                    <dt>High</dt>
                    <dd>{byPriority['high'] ?? 0}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Medium</dt>
                    <dd>{byPriority['medium'] ?? 0}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt>Low</dt>
                    <dd>{byPriority['low'] ?? 0}</dd>
                  </div>
                </dl>
              </div>
            </section>

            <section aria-label="Raw dashboard data" className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Breakdown
              </h3>
              {items.length === 0 ? (
                <p className="mt-2 text-sm text-slate-500">No open feedback at the moment.</p>
              ) : (
                <div className="mt-2 overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200 text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Category
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Priority
                        </th>
                        <th className="px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Count
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {items.map((item) => (
                        <tr key={`${item.category}-${item.priority}`}>
                          <td className="px-3 py-2 text-xs text-slate-700">{item.category}</td>
                          <td className="px-3 py-2 text-xs text-slate-700">{item.priority}</td>
                          <td className="px-3 py-2 text-right text-xs text-slate-900">{item.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </Layout>
  );
};

export default DashboardPage;
