import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Dot
} from 'recharts'
import { format } from 'date-fns'
import { classifyGlucose } from '../utils'
import { BarChart2 } from 'lucide-react'

function CustomDot(props) {
  const { cx, cy, payload } = props
  const status = classifyGlucose(payload.glucose)
  return <circle cx={cx} cy={cy} r={5} fill={status.color} stroke="#0D0D1A" strokeWidth={2} />
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  const status = classifyGlucose(d.glucose)
  return (
    <div className="bg-dark-700 border border-dark-500 rounded-xl p-3 shadow-xl text-xs">
      <div className="flex justify-between items-start gap-4 mb-2">
        <p className="text-gray-400">{format(new Date(d.datetime), 'MMM d, HH:mm')}</p>
        {d.type && (
          <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-dark-500 text-gray-400 border border-dark-400">
            {d.type}
          </span>
        )}
      </div>
      <p className="text-white font-bold text-base">{d.glucose} <span className="text-gray-400 text-xs font-normal">mg/dL</span></p>
      <span className={`inline-block mt-1 px-2 py-0.5 rounded-full ${status.bg} ${status.text} font-semibold`}>{status.label}</span>
      {d.notes && <p className="text-gray-500 mt-1 italic leading-tight">{d.notes}</p>}
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
    <div className="glass-card p-6 animate-fade-in">
      <h2 className="text-base font-semibold text-white flex items-center gap-2 mb-5">
        <BarChart2 size={16} className="text-brand-secondary" />
        Glucose Trend
      </h2>

      {data.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-gray-600">
          <BarChart2 size={32} className="mb-3 opacity-30" />
          <p className="text-sm">Log readings to see your trend chart</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="label"
              tick={{ fill: '#6B7280', fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[40, 'auto']}
              tick={{ fill: '#6B7280', fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={v => `${v}`}
              label={{ value: 'mg/dL', angle: -90, position: 'insideLeft', fill: '#4B5563', fontSize: 10, dy: 30 }}
            />
            <Tooltip content={<CustomTooltip />} />
            {/* Reference lines for normal range */}
            <ReferenceLine y={70}  stroke="#EF4444" strokeDasharray="4 4" strokeOpacity={0.5}
              label={{ value: '70', fill: '#EF4444', fontSize: 10, position: 'right' }} />
            <ReferenceLine y={140} stroke="#F59E0B" strokeDasharray="4 4" strokeOpacity={0.5}
              label={{ value: '140', fill: '#F59E0B', fontSize: 10, position: 'right' }} />
            <Line
              type="monotone"
              dataKey="glucose"
              stroke="url(#glucoGradient)"
              strokeWidth={2.5}
              dot={<CustomDot />}
              activeDot={{ r: 7, strokeWidth: 2 }}
            />
            <defs>
              <linearGradient id="glucoGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#7C3AED" />
                <stop offset="100%" stopColor="#A78BFA" />
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      )}

      {/* Legend */}
      <div className="flex gap-4 mt-3 justify-center flex-wrap">
        {[
          { color: '#EF4444', label: 'Hypoglycemia (<70)' },
          { color: '#22C55E', label: 'Normal (70-99)' },
          { color: '#F59E0B', label: 'Elevated (100-125)' },
          { color: '#F97316', label: 'High (≥126)' },
        ].map(({ color, label }) => (
          <span key={label} className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="w-2 h-2 rounded-full" style={{ background: color }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}
