import React from 'react';
import { NavLink } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className="bg-slate-900 text-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold tracking-tight">Customer Feedback Tracker</h1>
          <nav className="flex gap-4 text-sm">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `px-2 py-1 rounded-md transition-colors ${
                  isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-100 hover:bg-slate-800'
                }`
              }
            >
              Feedback
            </NavLink>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `px-2 py-1 rounded-md transition-colors ${
                  isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-100 hover:bg-slate-800'
                }`
              }
            >
              Dashboard
            </NavLink>
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">{children}</main>
      <footer className="border-t border-slate-200 py-3 text-center text-xs text-slate-500">
        Backend API base: <code>{import.meta.env.VITE_API_BASE_URL ?? 'default (Railway)'}</code>
      </footer>
    </div>
  );
};

export default Layout;
