import React, { useEffect, useMemo, useState } from 'react';
import api from '../services/api.js';
import { useToast, ToastProvider } from '../components/Toast.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { Link } from 'react-router-dom';

function SearchAndFilter({ department, setDepartment, minScore, setMinScore, maxScore, setMaxScore, onApply }) {
  return (
    <div className="rounded-3xl border bg-white p-5 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div className="space-y-2">
          <div className="text-sm font-semibold text-gray-900">Search & Filter</div>
          <div className="text-xs text-gray-600">Filter by department and performance score range.</div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 w-full">
          <div>
            <label className="text-xs font-semibold text-gray-700">Department</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="Development"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700">Min score</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              value={minScore}
              onChange={(e) => setMinScore(e.target.value)}
              type="number"
              min={0}
              max={100}
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700">Max score</label>
            <input
              className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              value={maxScore}
              onChange={(e) => setMaxScore(e.target.value)}
              type="number"
              min={0}
              max={100}
            />
          </div>
          <button
            onClick={onApply}
            className="h-10 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

function EmployeeListContent() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);

  const [department, setDepartment] = useState('');
  const [minScore, setMinScore] = useState('');
  const [maxScore, setMaxScore] = useState('');

  const [applied, setApplied] = useState({ department: '', minScore: '', maxScore: '' });

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const params = {};
        if (applied.department) params.department = applied.department;
        if (applied.minScore !== '') params.minScore = applied.minScore;
        if (applied.maxScore !== '') params.maxScore = applied.maxScore;

        // Use main GET endpoint with query params
        const res = await api.get('/api/employees', { params });
        setEmployees(res.data);
      } catch (err) {
        showToast({ type: 'error', title: 'Load failed', message: err?.response?.data?.message || err.message });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [applied.department, applied.minScore, applied.maxScore, showToast]);

  const sorted = useMemo(() => [...employees].sort((a, b) => b.performanceScore - a.performanceScore), [employees]);

  async function removeEmployee(id) {
    try {
      await api.delete(`/api/employees/${id}`);
      showToast({ type: 'success', title: 'Deleted', message: 'Employee removed.' });
      setEmployees((prev) => prev.filter((e) => e._id !== id));
    } catch (err) {
      showToast({ type: 'error', title: 'Delete failed', message: err?.response?.data?.message || err.message });
    }
  }

  return (
    <div className="pt-12 md:pt-0 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
        <p className="mt-1 text-sm text-gray-600">Add, update, delete and filter employee performance.</p>
      </div>

      <SearchAndFilter
        department={department}
        setDepartment={setDepartment}
        minScore={minScore}
        setMinScore={setMinScore}
        maxScore={maxScore}
        setMaxScore={setMaxScore}
        onApply={() => setApplied({ department, minScore, maxScore })}
      />

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">Showing {sorted.length} employees</div>
        <Link to="/app/employees/new" className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800">
          + Add Employee
        </Link>
      </div>

      {loading ? (
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <LoadingSpinner label="Loading employees..." />
        </div>
      ) : (
        <div className="rounded-3xl border bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-xs uppercase text-gray-500">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Skills</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Experience</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((e) => (
                  <tr key={e._id} className="border-t">
                    <td className="py-3 px-4 font-medium text-gray-900">{e.name}</td>
                    <td className="py-3 px-4 text-gray-700">{e.email}</td>
                    <td className="py-3 px-4 text-gray-700">{e.department}</td>
                    <td className="py-3 px-4 text-gray-700">{(e.skills || []).slice(0, 3).join(', ')}{(e.skills||[]).length>3?'...':''}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900">{e.performanceScore}</td>
                    <td className="py-3 px-4 text-gray-600">{e.experience} yrs</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Link to={`/app/employees/${e._id}/edit`} className="rounded-lg border bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-800 hover:bg-gray-50">
                          Edit
                        </Link>
                        <button
                          onClick={() => removeEmployee(e._id)}
                          className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {sorted.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-gray-500">
                      No employees match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function EmployeeListPage() {
  return (
    <ToastProvider>
      <EmployeeListContent />
    </ToastProvider>
  );
}

