import React, { useState } from 'react';

export function ImageWithFallback({ src, alt, className = '' }) {
  const [error, setError] = useState(false);

  const fallback =
    'https://via.placeholder.com/600x400.png?text=Image+not+available';

  return (
    <img
      src={error ? fallback : src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
}
