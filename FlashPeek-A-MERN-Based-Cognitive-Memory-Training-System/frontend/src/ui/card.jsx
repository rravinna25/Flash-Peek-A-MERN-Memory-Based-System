import React from 'react';

export function Card({ className = '', ...props }) {
  const base =
    'rounded-2xl bg-white border border-slate-200 shadow-sm';
  return <div className={`${base} ${className}`} {...props} />;
}
