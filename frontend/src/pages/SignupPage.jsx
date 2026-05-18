import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ToastProvider, useToast } from '../components/Toast.jsx';

function SignupForm() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await signup({ name, email, password });
      showToast({ type: 'success', title: 'Account created', message: 'You can now login.' });
      navigate('/app/dashboard');
    } catch (err) {
      showToast({ type: 'error', title: 'Signup failed', message: err?.response?.data?.message || err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md pt-28">
      <div className="rounded-3xl border bg-white p-7 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900">Signup</h2>
        <p className="mt-1 text-sm text-gray-600">Create your HR/Admin account.</p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="text-sm font-medium text-gray-800">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="HR Admin"
              type="text"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-800">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@example.com"
              type="email"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-800">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="At least 6 characters"
              type="password"
              required
              minLength={6}
            />
          </div>

          <button
            disabled={loading}
            className="w-full rounded-xl bg-gray-900 py-2.5 text-white font-semibold text-sm hover:bg-gray-800 disabled:opacity-60"
          >
            {loading ? 'Creating...' : 'Create account'}
          </button>

          <div className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link className="font-semibold text-gray-900 hover:underline" to="/login">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <ToastProvider>
      <SignupForm />
    </ToastProvider>
  );
}

