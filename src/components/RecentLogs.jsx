import { Trash2, Clock, FileText } from 'lucide-react'
import { format } from 'date-fns'
import StatusBadge from './StatusBadge'
import { classifyGlucose } from '../utils'

export default function RecentLogs({ readings, onDelete }) {
  const sorted = [...readings].sort((a, b) => new Date(b.datetime) - new Date(a.datetime))

  return (
    <div className="glass-card p-6 animate-slide-up">
      <h2 className="text-base font-semibold text-white mb-4 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <FileText size={16} className="text-brand-secondary" />
          Recent Logs
        </span>
        <span className="text-xs text-gray-600 font-normal">
          {readings.length} reading{readings.length !== 1 ? 's' : ''}
        </span>
      </h2>

      {sorted.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          <Clock size={28} className="mx-auto mb-2 opacity-30" />
          <p className="text-sm">No readings logged yet</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2 max-h-96 overflow-y-auto pr-1">
          {sorted.map(r => {
            const status = classifyGlucose(r.glucose)
            return (
              <div
                key={r.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-dark-700/60 border border-dark-600/50 hover:border-brand-primary/30 transition-all duration-200 group animate-fade-in"
              >
                {/* Color indicator */}
                <div
                  className="w-1.5 h-10 rounded-full flex-shrink-0"
                  style={{ background: status.color }}
                />

                {/* Value */}
                <div className="flex-shrink-0 w-16">
                  <span className="text-lg font-bold" style={{ color: status.color }}>
                    {r.glucose}
                  </span>
                  <span className="text-xs text-gray-500"> mg/dL</span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <StatusBadge value={r.glucose} className="mb-1" />
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock size={10} />
                    {format(new Date(r.datetime), 'MMM d, yyyy · h:mm a')}
                  </p>
                  {r.notes && (
                    <p className="text-xs text-gray-600 italic truncate mt-0.5">{r.notes}</p>
                  )}
                </div>

                {/* Delete */}
                <button
                  onClick={() => onDelete(r.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-900/30 transition-all duration-200 flex-shrink-0"
                  title="Delete reading"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
