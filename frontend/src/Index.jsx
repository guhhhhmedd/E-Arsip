//  Komponen UI Reusable — E-Arsip
//  Semua styling Tailwind dipusatkan di sini

// Button 
export const Button = ({
  children, onClick, type = "button",
  variant = "primary", size = "md",
  disabled = false, className = "", icon = null,
}) => {
  const base = "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:  "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary:"bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-400",
    danger:   "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    ghost:    "text-gray-600 hover:bg-gray-100 focus:ring-gray-300",
    success:  "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500",
    outline:  "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-300",
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-5 py-2.5",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {icon && <span className="text-[1em]">{icon}</span>}
      {children}
    </button>
  );
};

// Input
export const Input = ({
  label, name, type = "text", value, onChange,
  placeholder = "", error = "", required = false,
  className = "", disabled = false, icon = null,
}) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    {label && (
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
          {icon}
        </span>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`
          w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800
          placeholder:text-gray-400 transition
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          disabled:bg-gray-50 disabled:text-gray-400
          ${icon ? "pl-9" : ""}
          ${error ? "border-red-400 focus:ring-red-400" : ""}
        `}
      />
    </div>
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

// Select
export const Select = ({
  label, name, value, onChange,
  options = [], error = "", required = false,
  placeholder = "Pilih...", className = "",
}) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    {label && (
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className={`
        w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        ${error ? "border-red-400" : ""}
      `}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

// Textarea
export const Textarea = ({
  label, name, value, onChange, placeholder = "",
  error = "", required = false, rows = 4, className = "",
}) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    {label && (
      <label htmlFor={name} className="text-sm font-medium text-gray-700">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      rows={rows}
      className={`
        w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800
        placeholder:text-gray-400 resize-none
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        ${error ? "border-red-400" : ""}
      `}
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

// Card 
export const Card = ({ children, className = "", padding = true }) => (
  <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${padding ? "p-5" : ""} ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ title, subtitle, action }) => (
  <div className="flex items-start justify-between mb-4">
    <div>
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

// Badge 
const BADGE_COLORS = {
  draft:        "bg-yellow-100 text-yellow-700",
  aktif:        "bg-emerald-100 text-emerald-700",
  inaktif:      "bg-gray-100 text-gray-600",
  admin:        "bg-purple-100 text-purple-700",
  kepala_dinas: "bg-blue-100 text-blue-700",
  sekretaris:   "bg-sky-100 text-sky-700",
  staff_tu:     "bg-orange-100 text-orange-700",
  verifikator:  "bg-teal-100 text-teal-700",
  arsiparis:    "bg-indigo-100 text-indigo-700",
  viewer:       "bg-gray-100 text-gray-600",
};

export const Badge = ({ label, type }) => {
  const color = BADGE_COLORS[type] || "bg-gray-100 text-gray-600";
  return (
    <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full capitalize ${color}`}>
      {label || type}
    </span>
  );
};

// Spinner
export const Spinner = ({ size = "md", className = "" }) => {
  const sizes = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-10 h-10" };
  return (
    <div className={`animate-spin rounded-full border-2 border-gray-200 border-t-blue-600 ${sizes[size]} ${className}`} />
  );
};

export const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Spinner size="lg" />
  </div>
);

// Alert
export const Alert = ({ type = "info", message, onClose }) => {
  if (!message) return null;

  const styles = {
    info:    "bg-blue-50 text-blue-800 border-blue-200",
    success: "bg-emerald-50 text-emerald-800 border-emerald-200",
    error:   "bg-red-50 text-red-800 border-red-200",
    warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
  };

  const icons = { info: "ℹ️", success: "✅", error: "❌", warning: "⚠️" };

  return (
    <div className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ${styles[type]}`}>
      <span>{icons[type]}</span>
      <p className="flex-1">{message}</p>
      {onClose && (
        <button onClick={onClose} className="ml-auto font-bold opacity-60 hover:opacity-100">✕</button>
      )}
    </div>
  );
};

// Modal 
export const Modal = ({ open, onClose, title, children, footer }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >✕</button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer && (
          <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// Table
export const Table = ({ columns = [], data = [], emptyText = "Tidak ada data." }) => (
  <div className="overflow-x-auto rounded-lg border border-gray-200">
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-gray-50 border-b border-gray-200">
          {columns.map((col) => (
            <th
              key={col.key}
              className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
              style={col.width ? { width: col.width } : {}}
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {data.length === 0 ? (
          <tr>
            <td colSpan={columns.length} className="px-4 py-10 text-center text-gray-400">
              {emptyText}
            </td>
          </tr>
        ) : (
          data.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-gray-700 align-middle">
                  {col.render ? col.render(row[col.key], row) : row[col.key] ?? "—"}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

// StatCard 
export const StatCard = ({ label, value, icon, color = "blue" }) => {
  const colors = {
    blue:    "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber:   "bg-amber-50 text-amber-600",
    red:     "bg-red-50 text-red-600",
  };
  return (
    <Card className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${colors[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value ?? "—"}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </Card>
  );
};

// Pagination 
export const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-1 mt-4">
      <Button
        variant="outline" size="sm"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >← Prev</Button>

      <span className="px-3 py-1.5 text-sm text-gray-600">
        {page} / {totalPages}
      </span>

      <Button
        variant="outline" size="sm"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >Next →</Button>
    </div>
  );
};

// EmptyState 
export const EmptyState = ({ icon = "📂", title = "Tidak ada data", subtitle = "", action }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="text-5xl mb-3">{icon}</div>
    <p className="text-base font-medium text-gray-700">{title}</p>
    {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);
