import React from 'react';

export function Button({ className = '', variant = 'default', size = 'md', ...props }) {
  const base =
    'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    default: 'bg-teal-500 text-white hover:bg-teal-600',
    outline: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
    ghost: 'text-slate-700 hover:bg-slate-100',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-3 text-base',
    icon: 'p-2',
  };

  const cls = `${base} ${variants[variant] || variants.default} ${
    sizes[size] || sizes.md
  } ${className}`;

  return <button className={cls} {...props} />;
}
