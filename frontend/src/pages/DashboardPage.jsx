import React, { useEffect, useMemo, useState } from 'react';
import api from '../services/api.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { useToast, ToastProvider } from '../components/Toast.jsx';
import { Link } from 'react-router-dom';

function DashboardContent() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/api/employees');
        setEmployees(res.data);
      } catch (e) {
        const msg = e?.response?.data?.message || e.message;
        setError(msg);
        showToast({ type: 'error', title: 'Failed to load', message: msg });
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [showToast]);

  const top = useMemo(() => [...employees].sort((a, b) => b.performanceScore - a.performanceScore).slice(0, 5), [employees]);

  const departments = useMemo(() => {
    const map = new Map();
    for (const e of employees) {
      map.set(e.department, (map.get(e.department) || 0) + 1);
    }
    return Array.from(map.entries()).map(([department, count]) => ({ department, count }));
  }, [employees]);

  return (
    <div className="space-y-6 pt-12 md:pt-0">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">Monitor employee performance and generate AI insights.</p>
      </div>

      {loading ? (
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <LoadingSpinner label="Loading analytics..." />
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-red-100 bg-red-50 p-6 shadow-sm">
          <div className="text-red-800 font-semibold">{error}</div>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border bg-white p-5 shadow-sm">
              <div className="text-sm text-gray-600">Total employees</div>
              <div className="mt-2 text-3xl font-bold text-gray-900">{employees.length}</div>
            </div>
            <div className="rounded-3xl border bg-white p-5 shadow-sm">
              <div className="text-sm text-gray-600">Top performance</div>
              <div className="mt-2 text-3xl font-bold text-gray-900">{top[0]?.performanceScore ?? 0}</div>
              <div className="mt-1 text-xs text-gray-500">Score out of 100</div>
            </div>
            <div className="rounded-3xl border bg-white p-5 shadow-sm">
              <div className="text-sm text-gray-600">Departments</div>
              <div className="mt-2 text-3xl font-bold text-gray-900">{departments.length}</div>
              <div className="mt-1 text-xs text-gray-500">Active departments</div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="rounded-3xl border bg-white p-5 shadow-sm lg:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-gray-900">Top performing employees</div>
                  <div className="text-xs text-gray-600">Based on performanceScore</div>
                </div>
                <Link className="text-sm font-semibold text-blue-700 hover:underline" to="/app/employees">
                  View all
                </Link>
              </div>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase text-gray-500">
                      <th className="py-2">Name</th>
                      <th className="py-2">Department</th>
                      <th className="py-2">Score</th>
                      <th className="py-2">Experience</th>
                    </tr>
                  </thead>
                  <tbody>
                    {top.map((e) => (
                      <tr key={e._id} className="border-t">
                        <td className="py-2 font-medium text-gray-900">{e.name}</td>
                        <td className="py-2 text-gray-700">{e.department}</td>
                        <td className="py-2 font-semibold text-gray-900">{e.performanceScore}</td>
                        <td className="py-2 text-gray-600">{e.experience} yrs</td>
                      </tr>
                    ))}
                    {top.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-gray-500">
                          No employees found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-3xl border bg-white p-5 shadow-sm">
              <div className="text-sm font-semibold text-gray-900">Department analytics</div>
              <div className="text-xs text-gray-600 mt-1">Employee count by department</div>

              <div className="mt-4 space-y-3">
                {departments.map((d) => (
                  <div key={d.department} className="flex items-center justify-between rounded-2xl border bg-gray-50 px-4 py-3">
                    <div className="text-sm font-semibold text-gray-900">{d.department}</div>
                    <div className="text-sm font-bold text-gray-800">{d.count}</div>
                  </div>
                ))}
                {departments.length === 0 && <div className="text-sm text-gray-500">No data available.</div>}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">Generate AI recommendations</div>
                <div className="text-lg font-bold">Promotion • Ranking • Training • Feedback</div>
              </div>
              <Link to="/app/ai" className="self-start md:self-auto rounded-xl bg-white/90 px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-white">
                Go to AI
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ToastProvider>
      <DashboardContent />
    </ToastProvider>
  );
}

