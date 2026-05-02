// src/components/ui/Badge.jsx
export const Badge = ({ children, className }) => (
  <span className={`px-2 py-1 text-xs font-bold rounded-full ${className}`}>
    {children}
  </span>
);