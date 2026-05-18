import React from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart3, Home, Users, Sparkles } from 'lucide-react';

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
    isActive
      ? 'bg-blue-600 text-white shadow'
      : 'text-gray-700 hover:bg-gray-100'
  }`;

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-16 z-30 hidden h-[calc(100vh-4rem)] w-64 flex-col border-r bg-white/90 backdrop-blur md:flex">
      <div className="p-4">
        <div className="text-xs font-semibold text-gray-500">Workspace</div>
        <div className="mt-3 flex flex-col gap-1">
          <NavLink to="/app/dashboard" className={linkClass}>
            <Home size={16} /> Dashboard
          </NavLink>
          <NavLink to="/app/employees" className={linkClass}>
            <Users size={16} /> Employees
          </NavLink>
          <NavLink to="/app/ai" className={linkClass}>
            <Sparkles size={16} /> AI Recommendations
          </NavLink>
          <NavLink to="/app/analytics" className={linkClass}>
            <BarChart3 size={16} /> Analytics
          </NavLink>
        </div>
      </div>
    </aside>
  );
}

