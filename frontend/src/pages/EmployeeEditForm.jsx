import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api.js';
import { useToast, ToastProvider } from '../components/Toast.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';

function EmployeeEditFormContent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    email: '',
    department: '',
    skillsText: '',
    performanceScore: 80,
    experience: 2
  });

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await api.get(`/api/employees/${id}`);
        const e = res.data;
        setForm({
          name: e.name || '',
          email: e.email || '',
          department: e.department || '',
          skillsText: Array.isArray(e.skills) ? e.skills.join(', ') : '',
          performanceScore: e.performanceScore ?? 80,
          experience: e.experience ?? 2
        });
      } catch (err) {
        showToast({ type: 'error', title: 'Load failed', message: err?.response?.data?.message || err.message });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, showToast]);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const skills = form.skillsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await api.put(`/api/employees/${id}`, {
        name: form.name,
        email: form.email,
        department: form.department,
        skills,
        performanceScore: Number(form.performanceScore),
        experience: Number(form.experience)
      });

      showToast({ type: 'success', title: 'Updated', message: 'Employee updated successfully.' });
      navigate('/app/employees');
    } catch (err) {
      showToast({ type: 'error', title: 'Update failed', message: err?.response?.data?.message || err.message });
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="pt-12 md:pt-0">
        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <LoadingSpinner label="Loading employee..." />
        </div>
      </div>
    );
  }

  return (
    <div className="pt-12 md:pt-0">
      <h1 className="text-2xl font-bold text-gray-900">Edit Employee</h1>
      <p className="mt-1 text-sm text-gray-600">Update employee details.</p>

      <form className="mt-6 rounded-3xl border bg-white p-6 shadow-sm" onSubmit={onSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-gray-800">Name</label>
            <input className="mt-2 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-800">Email</label>
            <input className="mt-2 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} type="email" required />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-800">Department</label>
            <input className="mt-2 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" value={form.department} onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))} required />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-800">Skills (comma-separated)</label>
            <input className="mt-2 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" value={form.skillsText} onChange={(e) => setForm((p) => ({ ...p, skillsText: e.target.value }))} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-800">Performance Score (0-100)</label>
            <input className="mt-2 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" value={form.performanceScore} onChange={(e) => setForm((p) => ({ ...p, performanceScore: e.target.value }))} type="number" min={0} max={100} required />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-800">Experience (years)</label>
            <input className="mt-2 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" value={form.experience} onChange={(e) => setForm((p) => ({ ...p, experience: e.target.value }))} type="number" min={0} required />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button disabled={loading} className="flex-1 rounded-xl bg-gray-900 py-2.5 text-white font-semibold text-sm hover:bg-gray-800 disabled:opacity-60" type="submit">
            {loading ? <LoadingSpinner label="Saving..." /> : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/app/employees')}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default function EmployeeEditForm() {
  return (
    <ToastProvider>
      <EmployeeEditFormContent />
    </ToastProvider>
  );
}

