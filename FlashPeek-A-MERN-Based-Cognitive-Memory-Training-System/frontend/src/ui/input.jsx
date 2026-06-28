import React from 'react';

export function Input({ className = '', ...props }) {
  const base =
    'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent';
  return <input className={`${base} ${className}`} {...props} />;
}
