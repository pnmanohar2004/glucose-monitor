import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer
} from 'recharts'
import { format } from 'date-fns'
import { classifyGlucose } from '../utils'
import { BarChart2 } from 'lucide-react'

function CustomDot(props) {
  const { cx, cy, payload } = props
  const status = classifyGlucose(payload.glucose)
  return <circle cx={cx} cy={cy} r={4} fill={status.color} stroke="currentColor" className="text-white dark:text-[#1a1625]" strokeWidth={2} />
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  const status = classifyGlucose(d.glucose)
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 shadow-xl text-xs">
      <div className="flex justify-between items-start gap-4 mb-2">
        <p className="text-slate-500 dark:text-slate-400 font-medium">{format(new Date(d.datetime), 'MM/dd HH:mm')}</p>
      </div>
      <div className="flex items-baseline gap-1 mb-1">
        <p className="text-slate-900 dark:text-white font-bold text-xl">{d.glucose}</p>
        <span className="text-slate-500 text-xs">mg/dL</span>
      </div>
      <div className={`px-2 py-0.5 rounded text-[10px] font-bold w-fit ${status.bg} ${status.text}`}>
        {status.label}
      </div>
    </div>
  )
}

export default function GlucoseChart({ readings }) {
  const data = [...readings]
    .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
    .map(r => ({
      ...r,
      label: format(new Date(r.datetime), 'MM/dd HH:mm'),
    }))

  return (
    <div className="animate-fade-in flex flex-col h-full bg-white dark:bg-[#1a1625] rounded-xl p-6">
      <div className="flex items-center gap-3 mb-8">
        <BarChart2 size={24} className="text-purple-500" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Glucose Trend
        </h3>
      </div>

      <div className="flex-1 min-h-[350px]">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-600">
            <BarChart2 size={48} className="mb-4 opacity-10" />
            <p className="text-xs font-bold uppercase tracking-widest">No readings yet</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-slate-200 dark:text-slate-800/50" />
              <XAxis
                dataKey="label"
                tick={{ fill: '#64748B', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
                minTickGap={30}
              />
              <YAxis
                domain={[40, 'auto']}
                tick={{ fill: '#64748B', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#a855f7', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <ReferenceLine y={70} stroke="#EF4444" strokeDasharray="3 3" />
              <Line
                type="monotone"
                dataKey="glucose"
                stroke="#a855f7"
                strokeWidth={3}
                dot={<CustomDot />}
                activeDot={{ r: 6, strokeWidth: 0, fill: '#a855f7' }}
                animationDuration={1500}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Legend */}
      <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800/50 flex flex-wrap items-center justify-center gap-6">
        {[
          { color: '#EF4444', label: 'Hypoglycemia (<70)' },
          { color: '#10B981', label: 'Normal (70-99)' },
          { color: '#F59E0B', label: 'Elevated (100-125)' },
          { color: '#EA580C', label: 'High (≥126)' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
            <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
