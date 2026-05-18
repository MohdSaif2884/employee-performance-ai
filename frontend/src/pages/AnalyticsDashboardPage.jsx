import React, { useEffect, useMemo, useState } from 'react';
import api from '../services/api.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { ToastProvider, useToast } from '../components/Toast.jsx';
import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis, Pie, PieChart } from 'recharts';

function AnalyticsDashboardContent() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await api.get('/api/employees');
        setEmployees(res.data);
      } catch (err) {
        showToast({ type: 'error', title: 'Load failed', message: err?.response?.data?.message || err.message });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [showToast]);

  const top = useMemo(() => [...employees].sort((a, b) => b.performanceScore - a.performanceScore).slice(0, 8), [employees]);

  const deptCounts = useMemo(() => {
    const map = new Map();
    for (const e of employees) map.set(e.department, (map.get(e.department) || 0) + 1);
    return Array.from(map.entries()).map(([department, count]) => ({ department, count }));
  }, [employees]);

  const avgByDept = useMemo(() => {
    const map = new Map();
    for (const e of employees) {
      map.set(e.department, (map.get(e.department) || { sum: 0, count: 0 }));
      const obj = map.get(e.department);
      obj.sum += e.performanceScore;
      obj.count += 1;
    }
    return Array.from(map.entries()).map(([department, v]) => ({ department, avgScore: Math.round((v.sum / v.count) * 10) / 10 }));
  }, [employees]);

  const rankings = useMemo(() => {
    return [...employees]
      .sort((a, b) => (b.performanceScore - a.performanceScore) || (b.experience - a.experience))
      .map((e, idx) => ({ rank: idx + 1, name: e.name, department: e.department, performanceScore: e.performanceScore, experience: e.experience }));
  }, [employees]);

  if (loading) {
    return (
      <div className="pt-12 md:pt-0">
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <LoadingSpinner label="Loading analytics..." />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-12 md:pt-0 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">Top performers, department analytics, and employee rankings.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl border bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-gray-900">Top performing employees</div>
              <div className="text-xs text-gray-600">Performance score (top 8)</div>
            </div>
          </div>
          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={top.map((e) => ({ name: e.name, score: e.performanceScore, exp: e.experience }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" name="Score">
                  {top.map((_, idx) => (
                    <Cell key={idx} fill={idx === 0 ? '#2563eb' : '#4f46e5'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-gray-900">Department distribution</div>
          <div className="text-xs text-gray-600 mt-1">Employee counts by department</div>

          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip />
                <Pie data={deptCounts} dataKey="count" nameKey="department" cx="50%" cy="50%" outerRadius={80} label>
                  {deptCounts.map((_, idx) => (
                    <Cell key={idx} fill={idx % 2 === 0 ? '#4f46e5' : '#2563eb'} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-3xl border bg-white p-6 shadow-sm lg:col-span-2">
          <div className="text-sm font-semibold text-gray-900">Average performance score by department</div>
          <div className="text-xs text-gray-600 mt-1">Derived from performanceScore</div>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={avgByDept}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Bar dataKey="avgScore" name="Avg score" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-gray-900">Employee rankings</div>
          <div className="text-xs text-gray-600 mt-1">Ranked by performanceScore then experience</div>
          <div className="mt-4 overflow-hidden rounded-2xl border">
            <div className="max-h-72 overflow-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="py-2 px-3 text-left">#</th>
                    <th className="py-2 px-3 text-left">Name</th>
                    <th className="py-2 px-3 text-left">Dept</th>
                    <th className="py-2 px-3 text-left">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {rankings.slice(0, 10).map((r) => (
                    <tr key={r.name} className="border-t">
                      <td className="py-2 px-3 font-semibold">{r.rank}</td>
                      <td className="py-2 px-3">{r.name}</td>
                      <td className="py-2 px-3 text-gray-600">{r.department}</td>
                      <td className="py-2 px-3 font-semibold text-gray-900">{r.performanceScore}</td>
                    </tr>
                  ))}
                  {rankings.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-gray-500">No employees available.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsDashboardPage() {
  return (
    <ToastProvider>
      <AnalyticsDashboardContent />
    </ToastProvider>
  );
}

