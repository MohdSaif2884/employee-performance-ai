import React, { useEffect, useMemo, useState } from 'react';
import api from '../services/api.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { useToast, ToastProvider } from '../components/Toast.jsx';

function AIRecommendationPageContent() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);

  const [mode, setMode] = useState('promotion');
  const [department, setDepartment] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);

  const [aiLoading, setAiLoading] = useState(false);
  const [result, setResult] = useState(null);

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

  const departments = useMemo(() => {
    const set = new Set(employees.map((e) => e.department));
    return Array.from(set);
  }, [employees]);

  async function runAI() {
    if (!department && selectedIds.length === 0) {
      showToast({ type: 'warning', title: 'Missing criteria', message: 'Select employees or provide a department.' });
      return;
    }

    setAiLoading(true);
    setResult(null);
    try {
      const payload = {
        mode,
        department: department || undefined,
        employeeIds: selectedIds.length > 0 ? selectedIds : undefined
      };

      const res = await api.post('/api/ai/recommend', payload);
      setResult(res.data);
      showToast({ type: 'success', title: 'AI result ready', message: 'Recommendations generated.' });
    } catch (err) {
      showToast({ type: 'error', title: 'AI failed', message: err?.response?.data?.message || err.message });
      setResult({ error: err?.response?.data || err.message });
    } finally {
      setAiLoading(false);
    }
  }

  function toggleId(id) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  return (
    <div className="pt-12 md:pt-0 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Recommendations</h1>
        <p className="mt-1 text-sm text-gray-600">Generate promotion, ranking, training suggestions, and feedback.</p>
      </div>

      <div className="rounded-3xl border bg-white p-6 shadow-sm space-y-5">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="text-xs font-semibold text-gray-700">AI Mode</label>
            <select
              className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              value={mode}
              onChange={(e) => setMode(e.target.value)}
            >
              <option value="promotion">Promotion Recommendation</option>
              <option value="ranking">Employee Ranking</option>
              <option value="training">Training Suggestions</option>
              <option value="feedback">AI Feedback Generation</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-700">Department (optional)</label>
            <select
              className="mt-1 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="">All / none</option>
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div className="md:pt-6">
            <button
              onClick={runAI}
              disabled={aiLoading}
              className="w-full rounded-xl bg-blue-600 py-2.5 text-white font-semibold text-sm hover:bg-blue-700 disabled:opacity-60"
            >
              {aiLoading ? 'Generating...' : 'Generate AI Recommendations'}
            </button>
          </div>
        </div>

        <div className="pt-3">
          <div className="text-sm font-semibold text-gray-900">Select employees (optional)</div>
          {loading ? (
            <div className="mt-3"><LoadingSpinner label="Loading employees..." /></div>
          ) : (
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {employees.map((e) => (
                <button
                  key={e._id}
                  type="button"
                  onClick={() => toggleId(e._id)}
                  className={
                    'text-left rounded-2xl border px-4 py-3 hover:bg-gray-50 transition ' +
                    (selectedIds.includes(e._id) ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-white')
                  }
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{e.name}</div>
                      <div className="text-xs text-gray-600">{e.department}</div>
                    </div>
                    <div className="text-xs font-bold text-gray-900">{e.performanceScore}</div>
                  </div>
                  <div className="mt-2 text-xs text-gray-600">{e.experience} yrs • {(e.skills || []).slice(0, 2).join(', ')}</div>
                </button>
              ))}
              {employees.length === 0 && <div className="text-sm text-gray-500">No employees found.</div>}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-gray-900">AI Output</div>
            <div className="text-xs text-gray-600">Strict JSON response</div>
          </div>
        </div>

        <div className="mt-4">
          {aiLoading ? (
            <LoadingSpinner label="Waiting for AI model..." />
          ) : result ? (
            <pre className="max-h-[420px] overflow-auto rounded-2xl bg-gray-900 p-4 text-xs text-white whitespace-pre-wrap">
              {JSON.stringify(result, null, 2)}
            </pre>
          ) : (
            <div className="text-sm text-gray-500">Run the generator to see results.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AIRecommendationPage() {
  return (
    <ToastProvider>
      <AIRecommendationPageContent />
    </ToastProvider>
  );
}

