import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer
} from 'recharts'
import { Activity } from 'lucide-react'

function Spo2Tooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  const isCritical = d.spo2 < 90
  const isLow = d.spo2 < 95

  return (
    <div className="bg-white dark:bg-slate-900 border border-cyan-200/50 dark:border-cyan-800/30 rounded-xl p-3 shadow-2xl text-xs backdrop-blur-sm">
      <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">{d.label}</p>
      <div className="flex items-baseline gap-1">
        <span
          className="font-black text-2xl"
          style={{
            color: isCritical ? '#ef4444' : isLow ? '#f59e0b' : '#06b6d4',
            fontVariantNumeric: 'tabular-nums'
          }}
        >
          {d.spo2}
        </span>
        <span className="text-slate-400 text-[10px] font-bold">%</span>
      </div>
      <span className={`mt-1 inline-block text-[9px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full
        ${isCritical ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
          : isLow ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
          : 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400'}`}>
        {isCritical ? 'Critical' : isLow ? 'Low' : 'Normal'}
      </span>
    </div>
  )
}

export default function Spo2Chart({ logs, isLive }) {
  const SESSION_TIMEOUT = 60 * 1000 // 60 seconds

  const data = isLive ? [...logs]
    .filter(l => l && l._creationTime && typeof l.spo2 === 'number')
    .filter(l => Date.now() - l._creationTime <= SESSION_TIMEOUT)
    .sort((a, b) => a._creationTime - b._creationTime)
    .map(l => ({
      ...l,
      label: new Intl.DateTimeFormat('en-IN', {
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
      }).format(new Date(l._creationTime)),
    })) : []

  const latestVal = isLive && data.length > 0 ? data[data.length - 1].spo2 : null

  return (
    <div
      className="flex flex-col rounded-[1.5rem] overflow-hidden border border-cyan-500/10 dark:border-cyan-500/15
                 bg-white dark:bg-[#0f1a1f] shadow-[0_0_40px_rgba(6,182,212,0.05)]"
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-cyan-100/60 dark:border-cyan-900/20">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #06b6d422, #06b6d411)' }}
            aria-hidden="true"
          >
            <Activity size={16} className="text-cyan-500" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-black tracking-tight text-slate-800 dark:text-white">Blood Oxygen</h3>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">SpO₂ — Live Sensor</p>
          </div>
        </div>
        {latestVal !== null ? (
          <div className="text-right">
            <div
              className="text-3xl font-black leading-none"
              style={{
                color: latestVal < 90 ? '#ef4444'
                  : latestVal < 95 ? '#f59e0b'
                  : '#06b6d4',
                fontVariantNumeric: 'tabular-nums'
              }}
            >
              {latestVal}%
            </div>
            <div className="text-[10px] font-bold text-slate-400 mt-0.5">Latest SpO₂</div>
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
              <Activity size={40} className="text-cyan-400" aria-hidden="true" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {isLive ? "Awaiting Sensor Data..." : "IDLE - NO SIGNAL"}
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="spo2Gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
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
                  domain={[85, 100]}
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<Spo2Tooltip />} cursor={{ stroke: '#06b6d4', strokeWidth: 1, strokeDasharray: '4 4' }} />
                {/* Clinical thresholds */}
                <ReferenceLine y={95} stroke="#f59e0b" strokeDasharray="3 3" strokeOpacity={0.5} />
                <ReferenceLine y={90} stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={0.5} />
                <Area
                  type="monotone"
                  dataKey="spo2"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  fill="url(#spo2Gradient)"
                  dot={{ r: 3.5, fill: '#06b6d4', stroke: '#fff', strokeWidth: 1.5 }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#06b6d4' }}
                  animationDuration={1200}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Range Guide */}
        <div className="mt-3 pt-3 border-t border-slate-100/70 dark:border-slate-800/50 flex flex-wrap gap-4 justify-center">
          {[
            { color: '#ef4444', label: 'Critical < 90%' },
            { color: '#f59e0b', label: 'Low 90–94%' },
            { color: '#06b6d4', label: 'Normal ≥ 95%' },
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
