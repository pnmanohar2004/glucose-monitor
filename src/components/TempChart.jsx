import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer
} from 'recharts'
import { Thermometer } from 'lucide-react'

function TempTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  const isFever = d.temperature >= 37.5
  const isHigh  = d.temperature >= 38.5

  return (
    <div className="bg-white dark:bg-slate-900 border border-orange-200/50 dark:border-orange-800/30 rounded-xl p-3 shadow-2xl text-xs backdrop-blur-sm">
      <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-1">{d.label}</p>
      <div className="flex items-baseline gap-1">
        <span
          className="font-black text-2xl"
          style={{
            color: isHigh ? '#ef4444' : isFever ? '#f59e0b' : '#f97316',
            fontVariantNumeric: 'tabular-nums'
          }}
        >
          {typeof d.temperature === 'number' ? d.temperature.toFixed(2) : d.temperature}
        </span>
        <span className="text-slate-400 text-[10px] font-bold">°C</span>
      </div>
      <span className={`mt-1 inline-block text-[9px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full
        ${isHigh  ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
          : isFever ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
          : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'}`}>
        {isHigh ? 'High Fever' : isFever ? 'Fever' : 'Normal'}
      </span>
    </div>
  )
}

export default function TempChart({ logs, isLive }) {
  const SESSION_TIMEOUT = 60 * 1000 // 60 seconds

  const data = isLive ? [...logs]
    .filter(l => l && l._creationTime && typeof l.temperature === 'number')
    .filter(l => Date.now() - l._creationTime <= SESSION_TIMEOUT)
    .sort((a, b) => a._creationTime - b._creationTime)
    .map(l => ({
      ...l,
      label: new Intl.DateTimeFormat('en-IN', {
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
      }).format(new Date(l._creationTime)),
    })) : []

  const latestVal = isLive && data.length > 0 ? data[data.length - 1].temperature : null
  const isFever  = latestVal !== null && latestVal >= 37.5
  const isHigh   = latestVal !== null && latestVal >= 38.5
  const latestColor = isHigh ? '#ef4444' : isFever ? '#f59e0b' : '#f97316'

  return (
    <div
      className="flex flex-col rounded-[1.5rem] overflow-hidden border border-orange-500/10 dark:border-orange-500/15
                 bg-white dark:bg-[#1a1200] shadow-[0_0_40px_rgba(249,115,22,0.05)]"
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-orange-100/60 dark:border-orange-900/20">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #f9731622, #f9731611)' }}
            aria-hidden="true"
          >
            <Thermometer size={16} className="text-orange-500" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-black tracking-tight text-slate-800 dark:text-white">Body Temperature</h3>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Temp — Live Controller</p>
          </div>
        </div>
        {latestVal !== null ? (
          <div className="text-right">
            <div
              className="text-3xl font-black leading-none"
              style={{ color: latestColor, fontVariantNumeric: 'tabular-nums' }}
            >
              {latestVal.toFixed(2)}°
            </div>
            <div className="text-[10px] font-bold text-slate-400 mt-0.5">Latest Temp</div>
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
              <Thermometer size={40} className="text-orange-400" aria-hidden="true" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {isLive ? "Awaiting Sensor Data..." : "IDLE - NO SIGNAL"}
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#f97316" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
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
                  domain={[35, 40]}
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<TempTooltip />} cursor={{ stroke: '#f97316', strokeWidth: 1, strokeDasharray: '4 4' }} />
                {/* Clinical thresholds */}
                <ReferenceLine y={38.5} stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={0.5} />
                <ReferenceLine y={37.5} stroke="#f59e0b" strokeDasharray="3 3" strokeOpacity={0.5} />
                <Area
                  type="monotone"
                  dataKey="temperature"
                  stroke="#f97316"
                  strokeWidth={2.5}
                  fill="url(#tempGradient)"
                  dot={{ r: 3.5, fill: '#f97316', stroke: '#fff', strokeWidth: 1.5 }}
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#f97316' }}
                  animationDuration={1200}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Range Guide */}
        <div className="mt-3 pt-3 border-t border-slate-100/70 dark:border-slate-800/50 flex flex-wrap gap-4 justify-center">
          {[
            { color: '#10b981', label: 'Normal 36–37.4°C' },
            { color: '#f59e0b', label: 'Fever 37.5–38.4°C' },
            { color: '#ef4444', label: 'High Fever ≥38.5°C' },
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
