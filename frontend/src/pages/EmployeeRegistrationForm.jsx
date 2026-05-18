import React, { useState } from 'react';
import api from '../services/api.js';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { useToast, ToastProvider } from '../components/Toast.jsx';
import { useNavigate } from 'react-router-dom';

function EmployeeRegistrationFormContent() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('Development');
  const [skillsText, setSkillsText] = useState('');
  const [performanceScore, setPerformanceScore] = useState(80);
  const [experience, setExperience] = useState(2);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const skills = skillsText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await api.post('/api/employees', {
        name,
        email,
        department,
        skills,
        performanceScore: Number(performanceScore),
        experience: Number(experience)
      });

      showToast({ type: 'success', title: 'Employee created', message: 'Employee added successfully.' });
      navigate('/app/employees');
    } catch (err) {
      showToast({ type: 'error', title: 'Failed', message: err?.response?.data?.message || err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pt-12 md:pt-0">
      <h1 className="text-2xl font-bold text-gray-900">Add Employee</h1>
      <p className="mt-1 text-sm text-gray-600">Create a new employee profile.</p>

      <form className="mt-6 rounded-3xl border bg-white p-6 shadow-sm" onSubmit={onSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-gray-800">Name</label>
            <input className="mt-2 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-800">Email</label>
            <input className="mt-2 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-800">Department</label>
            <input className="mt-2 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" value={department} onChange={(e) => setDepartment(e.target.value)} required />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-800">Skills (comma-separated)</label>
            <input className="mt-2 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" value={skillsText} onChange={(e) => setSkillsText(e.target.value)} placeholder="React, Node.js" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-800">Performance Score (0-100)</label>
            <input className="mt-2 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" value={performanceScore} onChange={(e) => setPerformanceScore(e.target.value)} type="number" min={0} max={100} required />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-800">Experience (years)</label>
            <input className="mt-2 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" value={experience} onChange={(e) => setExperience(e.target.value)} type="number" min={0} required />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button disabled={loading} className="flex-1 rounded-xl bg-gray-900 py-2.5 text-white font-semibold text-sm hover:bg-gray-800 disabled:opacity-60" type="submit">
            {loading ? <LoadingSpinner label="Saving..." /> : 'Create Employee'}
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

export default function EmployeeRegistrationForm() {
  return (
    <ToastProvider>
      <EmployeeRegistrationFormContent />
    </ToastProvider>
  );
}

