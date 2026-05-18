import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast, ToastProvider } from '../components/Toast.jsx';

function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email, password });
      showToast({ type: 'success', title: 'Logged in', message: 'Welcome back!' });
      navigate('/app/dashboard');
    } catch (err) {
      showToast({ type: 'error', title: 'Login failed', message: err?.response?.data?.message || err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md pt-28">
      <div className="rounded-3xl border bg-white p-7 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900">Login</h2>
        <p className="mt-1 text-sm text-gray-600">Use your HR/Admin credentials.</p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
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
              placeholder="••••••••"
              type="password"
              required
            />
          </div>

          <button
            disabled={loading}
            className="w-full rounded-xl bg-gray-900 py-2.5 text-white font-semibold text-sm hover:bg-gray-800 disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link className="font-semibold text-gray-900 hover:underline" to="/signup">
              Signup
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <ToastProvider>
      <LoginForm />
    </ToastProvider>
  );
}

