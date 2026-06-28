import React from 'react';

export function Label({ className = '', ...props }) {
  const base = 'block text-sm font-medium text-slate-700';
  return <label className={`${base} ${className}`} {...props} />;
}
