import React from 'react';

export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      <span className="text-sm text-gray-700">{label}</span>
    </div>
  );
}

