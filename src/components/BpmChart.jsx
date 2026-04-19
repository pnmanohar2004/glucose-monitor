import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer
} from 'recharts'
import { Heart } from 'lucide-react'

function BpmTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-white dark:bg-slate-900 border border-rose-200/50 dark:border-rose-800/30 rounded-xl p-3 shadow-2xl text-xs backdrop-blur-sm">
      <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">{d.label}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-rose-500 dark:text-rose-400 font-black text-2xl" style={{ fontVariantNumeric: 'tabular-nums' }}>{d.bpm}</span>
        <span className="text-slate-400 text-[10px] font-bold">BPM</span>
      </div>
      {d.hr_status && (
        <span className="mt-1 inline-block text-[9px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400">
          {d.hr_status}
        </span>
      )}
    </div>
  )
}

export default function BpmChart({ logs, isLive }) {
  const SESSION_TIMEOUT = 60 * 1000 // 60 seconds

  const data = isLive ? [...logs]
    .filter(l => l && l._creationTime && typeof l.heart_rate === 'number')
    .filter(l => Date.now() - l._creationTime <= SESSION_TIMEOUT)
    .sort((a, b) => a._creationTime - b._creationTime)
    .map(l => ({
      ...l,
      bpm: l.heart_rate,
      label: new Intl.DateTimeFormat('en-IN', {
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
      }).format(new Date(l._creationTime)),
    })) : []

  const minBpm = data.length ? Math.max(0, Math.min(...data.map(d => d.bpm)) - 15) : 40
  const maxBpm = data.length ? Math.min(...data.map(d => d.bpm)) + 30 : 150
  const latestVal = isLive && data.length > 0 ? data[data.length - 1].bpm : null

  return (
    <div
      className="flex flex-col rounded-[1.5rem] overflow-hidden border border-rose-500/10 dark:border-rose-500/15
                 bg-white dark:bg-[#1a1119] shadow-[0_0_40px_rgba(244,63,94,0.05)]"
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-rose-100/60 dark:border-rose-900/20">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #f43f5e22, #f43f5e11)' }}
            aria-hidden="true"
          >
            <Heart size={16} className="text-rose-500" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-black tracking-tight text-slate-800 dark:text-white">Heart Rate</h3>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">BPM — Live Sensor</p>
          </div>
        </div>
        {latestVal !== null ? (
          <div className="text-right">
            <div
              className="text-3xl font-black leading-none"
              style={{ color: '#f43f5e', fontVariantNumeric: 'tabular-nums' }}
            >
              {latestVal}
            </div>
            <div className="text-[10px] font-bold text-slate-400 mt-0.5">Latest BPM</div>
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
              <Heart size={40} className="text-rose-400" aria-hidden="true" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {isLive ? "Awaiting Sensor Data..." : "IDLE - NO SIGNAL"}
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 8, right: 4, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="bpmGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
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
                  domain={[minBpm, 'auto']}
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<BpmTooltip />} cursor={{ stroke: '#f43f5e', strokeWidth: 1, strokeDasharray: '4 4' }} />
                {/* Normal resting HR zone */}
                <ReferenceLine y={100} stroke="#f43f5e" strokeDasharray="3 3" strokeOpacity={0.4} />
                <ReferenceLine y={60} stroke="#f59e0b" strokeDasharray="3 3" strokeOpacity={0.4} />
                <Area
                  type="monotone"
                  dataKey="bpm"
                  stroke="#f43f5e"
                  strokeWidth={2.5}
                  fill="url(#bpmGradient)"
                  dot={{ r: 3.5, fill: '#f43f5e', stroke: '#fff', strokeWidth: 1.5 }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#f43f5e' }}
                  animationDuration={1200}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Range Guide */}
        <div className="mt-3 pt-3 border-t border-slate-100/70 dark:border-slate-800/50 flex flex-wrap gap-4 justify-center">
          {[
            { color: '#f59e0b', label: 'Low < 60 BPM' },
            { color: '#10b981', label: 'Normal 60–100 BPM' },
            { color: '#f43f5e', label: 'High > 100 BPM' },
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
