import { classifyGlucose } from '../utils'

export default function StatusBadge({ value, className = '' }) {
  const status = classifyGlucose(value)
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full opacity-80" style={{ background: status.color }} />
      {status.label}
    </span>
  )
}
