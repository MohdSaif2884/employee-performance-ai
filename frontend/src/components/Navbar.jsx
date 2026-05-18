import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <header className="fixed left-0 right-0 top-0 z-40 bg-white/80 backdrop-blur border-b">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600" />
          <div>
            <div className="text-sm font-semibold text-gray-900">AI Performance</div>
            <div className="text-xs text-gray-600">Analytics & Recommendations</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <nav className="hidden md:flex items-center gap-4 text-sm text-gray-700">
            <Link className="hover:text-gray-900" to="/app/dashboard">Dashboard</Link>
            <Link className="hover:text-gray-900" to="/app/employees">Employees</Link>
            <Link className="hover:text-gray-900" to="/app/ai">AI Recommendations</Link>
            <Link className="hover:text-gray-900" to="/app/analytics">Analytics</Link>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-sm">
              <div className="text-gray-900 font-medium">{user?.name || 'HR/Admin'}</div>
              <div className="text-gray-500 text-xs">Signed in</div>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white hover:bg-gray-800"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

