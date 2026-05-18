import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="mx-auto max-w-5xl pt-28">
      <div className="grid gap-10 lg:grid-cols-2 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            AI-Based Employee Performance Analytics & Recommendation System
          </h1>
          <p className="mt-5 text-gray-700 text-lg">
            Manage employees, track performance, and generate promotion, ranking, training, and feedback recommendations using
            an OpenRouter/OpenAI-compatible AI model.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/login" className="rounded-xl bg-gray-900 px-5 py-3 text-white font-semibold text-sm hover:bg-gray-800">
              Login
            </Link>
            <Link to="/signup" className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-gray-900 font-semibold text-sm hover:bg-gray-50">
              Create account
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3">
            {[
              { k: 'CRUD', v: 'Employees' },
              { k: 'Search', v: 'By department' },
              { k: 'AI', v: 'Recommendations' },
              { k: 'Analytics', v: 'Charts & ranking' }
            ].map((x) => (
              <div key={x.k} className="rounded-2xl border bg-white p-4 shadow-sm">
                <div className="text-sm font-semibold text-gray-900">{x.k}</div>
                <div className="text-xs text-gray-600 mt-1">{x.v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border bg-white p-6 shadow-sm">
          <div className="h-72 w-full rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600" />
          <div className="mt-5">
            <div className="text-sm font-semibold text-gray-900">What HR/Admin can do</div>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              {[
                'Add, update, delete employees',
                'Track performance score and experience',
                'Generate AI feedback and training suggestions',
                'View rankings and department analytics'
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-2 w-2 rounded-full bg-blue-600" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

