import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer
} from 'recharts'
import { Droplets } from 'lucide-react'

function GlucoseHwTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  const val = d.glucose_mgdl

  const statusColor = val >= 126 ? '#ea580c' : val >= 100 ? '#f59e0b' : val < 70 ? '#ef4444' : '#10b981'
  const statusLabel = val >= 126 ? 'High' : val >= 100 ? 'Elevated' : val < 70 ? 'Hypoglycemia' : 'Normal'

  return (
    <div className="bg-white dark:bg-slate-900 border border-purple-200/50 dark:border-purple-800/30 rounded-xl p-3 shadow-2xl text-xs backdrop-blur-sm">
      <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">{d.label}</p>
      <div className="flex items-baseline gap-1">
        <span className="font-black text-2xl" style={{ color: statusColor, fontVariantNumeric: 'tabular-nums' }}>{val}</span>
        <span className="text-slate-400 text-[10px] font-bold">mg/dL</span>
      </div>
      <span
        className="mt-1 inline-block text-[9px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full"
        style={{ background: `${statusColor}22`, color: statusColor }}
      >
        {d.glucose_status || statusLabel}
      </span>
    </div>
  )
}

export default function GlucoseHwChart({ logs, isLive }) {
  const SESSION_TIMEOUT = 60 * 1000 // 60 seconds

  const data = isLive ? [...logs]
    .filter(l => l && l._creationTime && typeof l.glucose_mgdl === 'number')
    .filter(l => Date.now() - l._creationTime <= SESSION_TIMEOUT)
    .sort((a, b) => a._creationTime - b._creationTime)
    .map(l => ({
      ...l,
      label: new Intl.DateTimeFormat('en-IN', {
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
      }).format(new Date(l._creationTime)),
    })) : []

  const latestVal = isLive && data.length > 0 ? data[data.length - 1].glucose_mgdl : null
  const latestColor = !latestVal ? '#a855f7'
    : latestVal >= 126 ? '#ea580c'
    : latestVal >= 100 ? '#f59e0b'
    : latestVal < 70 ? '#ef4444'
    : '#10b981'

  return (
    <div
      className="flex flex-col rounded-[1.5rem] overflow-hidden border border-purple-500/10 dark:border-purple-500/15
                 bg-white dark:bg-[#150f1f] shadow-[0_0_40px_rgba(168,85,247,0.06)]"
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-purple-100/60 dark:border-purple-900/20">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #a855f722, #a855f711)' }}
            aria-hidden="true"
          >
            <Droplets size={16} className="text-purple-500" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-black tracking-tight text-slate-800 dark:text-white">Glucose (ESP32)</h3>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">mg/dL — Live NIR Sensor</p>
          </div>
        </div>
        {latestVal !== null ? (
          <div className="text-right">
            <div className="text-3xl font-black leading-none" style={{ color: latestColor, fontVariantNumeric: 'tabular-nums' }}>
              {latestVal}
            </div>
            <div className="text-[10px] font-bold text-slate-400 mt-0.5">Latest mg/dL</div>
          </div>
        ) : (
          <div className="text-right opacity-50">
            <div className="text-3xl font-black leading-none text-slate-300 dark:text-slate-700">—</div>
            <div className="text-[10px] font-bold text-slate-400 mt-0.5">Idle</div>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="p-6 pt-4">
        <div className="h-[220px]">
          {data.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 opacity-40">
              <Droplets size={40} className="text-purple-400" aria-hidden="true" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {isLive ? "Awaiting Sensor Data..." : "IDLE - NO SIGNAL"}
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-100 dark:text-slate-800/50" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                  minTickGap={40}
                />
                <YAxis
                  domain={[40, 'auto']}
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<GlucoseHwTooltip />} cursor={{ stroke: '#a855f7', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <ReferenceLine y={70}  stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={0.5} />
                <ReferenceLine y={100} stroke="#f59e0b" strokeDasharray="3 3" strokeOpacity={0.4} />
                <ReferenceLine y={126} stroke="#ea580c" strokeDasharray="3 3" strokeOpacity={0.4} />
                <Line
                  type="monotone"
                  dataKey="glucose_mgdl"
                  stroke="#a855f7"
                  strokeWidth={2.5}
                  dot={{ r: 3.5, fill: '#a855f7', stroke: '#fff', strokeWidth: 1.5 }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#a855f7' }}
                  animationDuration={1200}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Range Guide */}
        <div className="mt-3 pt-3 border-t border-slate-100/70 dark:border-slate-800/50 flex flex-wrap gap-4 justify-center">
          {[
            { color: '#ef4444', label: 'Hypo < 70' },
            { color: '#10b981', label: 'Normal 70–99' },
            { color: '#f59e0b', label: 'Elevated 100–125' },
            { color: '#ea580c', label: 'High ≥ 126' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: color }} aria-hidden="true" />
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
