import { useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer
} from 'recharts'
import { format } from 'date-fns'
import { classifyGlucose } from '../utils'
import { Droplets, Heart, Activity, Thermometer, Layers } from 'lucide-react'

const METRICS = [
  { id: 'glucose',     label: 'Glucose',     icon: Droplets,    color: '#a855f7', unit: 'mg/dL' },
  { id: 'bpm',         label: 'Heart Rate',  icon: Heart,       color: '#f43f5e', unit: 'BPM'   },
  { id: 'spo2',        label: 'SpO2',        icon: Activity,    color: '#3b82f6', unit: '%'     },
  { id: 'temperature', label: 'Temperature', icon: Thermometer, color: '#f97316', unit: '°C'    },
]

const TABS = [
  { id: 'all', label: 'All', icon: Layers, color: '#94a3b8' },
  ...METRICS,
]

// ─── Mini sparkline card for "All" view ────────────────────────────────────
function MiniChart({ data, metric }) {
  const { id, label, icon: Icon, color, unit } = metric
  const filtered = data.filter(d => d[id] !== undefined && d[id] !== null)
  const latest = filtered.length ? filtered[filtered.length - 1][id] : null

  return (
    <div className="flex flex-col rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-3 gap-1">
      {/* Row: icon + label + latest value */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Icon size={12} style={{ color }} />
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</span>
        </div>
        {latest !== null ? (
          <span className="text-sm font-black" style={{ color }}>
            {typeof latest === 'number' && !Number.isInteger(latest) ? latest.toFixed(1) : latest}
            <span className="text-[9px] font-bold text-slate-400 ml-0.5">{unit}</span>
          </span>
        ) : (
          <span className="text-sm font-black text-slate-300 dark:text-slate-700">—</span>
        )}
      </div>

      {/* Sparkline */}
      <div className="h-[88px]">
        {filtered.length < 2 ? (
          <div className="flex items-center justify-center h-full opacity-20">
            <Icon size={28} style={{ color }} />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={filtered} margin={{ top: 4, right: 2, left: -36, bottom: 0 }}>
              <defs>
                <linearGradient id={`mg-${id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={color} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={color} stopOpacity={0}   />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-800/60" />
              <XAxis dataKey="label" hide />
              <YAxis domain={['auto', 'auto']} tick={{ fill: '#94a3b8', fontSize: 9 }} tickLine={false} axisLine={false} width={36} />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null
                  const d = payload[0].payload
                  const val = d[id]
                  return (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 shadow-xl text-xs">
                      <p className="text-slate-400 text-[9px] mb-0.5">{d.label}</p>
                      <p className="font-black" style={{ color }}>{val} <span className="text-slate-400 font-normal">{unit}</span></p>
                    </div>
                  )
                }}
              />
              {id === 'glucose' && <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" strokeOpacity={0.5} />}
              <Area
                type="monotone"
                dataKey={id}
                stroke={color}
                strokeWidth={2}
                fill={`url(#mg-${id})`}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0, fill: color }}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}

// ─── Tooltip for single-metric view ────────────────────────────────────────
function SingleTooltip({ active, payload, metricId }) {
  if (!active || !payload?.length) return null
  const d   = payload[0].payload
  const m   = METRICS.find(x => x.id === metricId)
  if (!m) return null
  const val = d[metricId]

  if (metricId === 'glucose') {
    const s = classifyGlucose(d.glucose)
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 shadow-xl text-xs">
        <p className="text-slate-400 text-[10px] mb-1">{d.label}</p>
        <p className="font-black text-lg leading-none mb-1" style={{ color: s.color }}>{val} <span className="text-slate-400 text-[10px] font-normal">mg/dL</span></p>
        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${s.bg} ${s.text}`}>{s.label}</span>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 shadow-xl text-xs">
      <p className="text-slate-400 text-[10px] mb-1">{d.label}</p>
      <p className="font-black text-lg leading-none" style={{ color: m.color }}>{val ?? '—'} <span className="text-slate-400 text-[10px] font-normal">{m.unit}</span></p>
    </div>
  )
}

// ─── Main component ─────────────────────────────────────────────────────────
export default function GlucoseChart({ readings }) {
  const [activeTab, setActiveTab] = useState('all')

  const data = [...readings]
    .filter(r => r && r.datetime && !isNaN(new Date(r.datetime).getTime()))
    .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
    .map(r => ({ ...r, label: format(new Date(r.datetime), 'MM/dd HH:mm') }))

  const singleData = activeTab !== 'all'
    ? data.filter(d => d[activeTab] !== undefined && d[activeTab] !== null)
    : []

  const activeConfig = TABS.find(t => t.id === activeTab)
  const ActiveIcon   = activeConfig.icon

  return (
    <div className="animate-fade-in flex flex-col bg-white dark:bg-[#1a1625] rounded-xl p-5">

      {/* ── Header + tab strip ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2">
          <ActiveIcon size={20} style={{ color: activeConfig.color }} />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            {activeTab === 'all' ? 'Full History' : `${activeConfig.label} History`}
          </h3>
        </div>

        <div className="flex flex-wrap bg-slate-100 dark:bg-slate-800/50 p-1 rounded-lg gap-0.5">
          {TABS.map(tab => {
            const Icon    = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                  isActive
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <Icon size={12} style={isActive ? { color: tab.color } : {}} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── All view – 2×2 mini-chart grid ─────────────────────── */}
      {activeTab === 'all' && (
        <div className="grid grid-cols-2 gap-3">
          {METRICS.map(m => <MiniChart key={m.id} data={data} metric={m} />)}
        </div>
      )}

      {/* ── Single metric view ──────────────────────────────────── */}
      {activeTab !== 'all' && (
        <div className="h-[260px] w-full min-w-0">
          {singleData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-600">
              <ActiveIcon size={40} className="mb-3 opacity-10" />
              <p className="text-[10px] font-bold uppercase tracking-widest">No readings yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart data={singleData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={activeConfig.color} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={activeConfig.color} stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-800/50" />
                <XAxis
                  dataKey="label"
                  tick={{ fill: '#64748B', fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                  minTickGap={40}
                />
                <YAxis
                  domain={['auto', 'auto']}
                  tick={{ fill: '#64748B', fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  content={<SingleTooltip metricId={activeTab} />}
                  cursor={{ stroke: activeConfig.color, strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                {activeTab === 'glucose' && (
                  <>
                    <ReferenceLine y={70}  stroke="#EF4444" strokeDasharray="3 3" strokeOpacity={0.5} />
                    <ReferenceLine y={126} stroke="#EA580C" strokeDasharray="3 3" strokeOpacity={0.4} />
                  </>
                )}
                <Area
                  type="monotone"
                  dataKey={activeTab}
                  stroke={activeConfig.color}
                  strokeWidth={2.5}
                  fill="url(#sg)"
                  dot={{ r: 3, fill: activeConfig.color, stroke: '#fff', strokeWidth: 1.5 }}
                  activeDot={{ r: 5, strokeWidth: 0, fill: activeConfig.color }}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      )}

      {/* ── Glucose legend ──────────────────────────────────────── */}
      {activeTab === 'glucose' && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/50 flex flex-wrap items-center justify-center gap-4">
          {[
            { color: '#EF4444', label: 'Hypo <70' },
            { color: '#10B981', label: 'Normal 70–99' },
            { color: '#F59E0B', label: 'Elevated 100–125' },
            { color: '#EA580C', label: 'High ≥126' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background: color }} />
              <span className="text-[10px] text-slate-500 dark:text-slate-400">{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
