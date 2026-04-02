import { Trash2, Clock, FileText, Activity, MoreHorizontal, Database, Shield } from 'lucide-react'
import { format } from 'date-fns'
import StatusBadge from './StatusBadge'
import { classifyGlucose } from '../utils'

export default function RecentLogs({ readings, onDelete }) {
  const sorted = [...readings].sort((a, b) => new Date(b.datetime) - new Date(a.datetime))

  return (
    <div className="flex flex-col gap-1 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
      {sorted.length === 0 ? (
        <div className="text-center py-20 text-slate-500 dark:text-slate-400 flex flex-col items-center gap-4 animate-fade-in transition-all">
          <Clock size={40} className="opacity-20" />
          <p className="text-[10px] uppercase font-black tracking-[0.3em]">No NIR Logs Detected</p>
        </div>
      ) : (
        <div className="flex flex-col">
          {sorted.map(r => {
            const status = classifyGlucose(r.glucose)
            const isAlert = r.glucose >= 126 || r.glucose < 70
            
            return (
              <div
                key={r._id}
                className="group flex flex-items-start gap-6 p-4 border-b border-slate-50 dark:border-slate-900 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-all duration-300 animate-fade-in"
              >
                {/* Timestamp */}
                <div className="text-[10px] font-black font-mono text-slate-500 dark:text-slate-400 w-16 flex-shrink-0 pt-0.5">
                  {format(new Date(r.datetime), 'HH:mm:ss')}
                </div>

                {/* Entry Details */}
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-slate-900 dark:text-white transition-colors">
                      {isAlert ? 'ALRT:' : 'POST:'} {r.type === 'fasting' ? 'Fasting magnitude established' : `Context ${r.type} recorded`}
                    </span>
                    <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded ${status.bg} ${status.text} shadow-sm`}>
                      {isAlert ? 'WARNING' : 'SUCCESS'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: status.color }} />
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600">{r.glucose} mg/dL</span>
                    </div>
                    {r.notes && (
                      <span className="text-[10px] font-bold text-blue-500 dark:text-blue-400 italic truncate opacity-60">
                        // {r.notes}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button
                    onClick={() => onDelete(r._id)}
                    className="p-2 rounded-lg text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/10 transition-all active:scale-90"
                    title="Delete Reading"
                  >
                    <Trash2 size={14} />
                  </button>
                  <MoreHorizontal size={14} className="text-slate-400 dark:text-slate-500" />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
