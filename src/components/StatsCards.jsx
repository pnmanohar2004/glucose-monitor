import StatusBadge from './StatusBadge'
import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react'
import { classifyGlucose } from '../utils'

function TrendIcon({ readings }) {
  if (readings.length < 2) return <Minus size={14} className="text-gray-500" />
  const last = readings[readings.length - 1].glucose
  const prev = readings[readings.length - 2].glucose
  if (last > prev) return <TrendingUp size={14} className="text-red-400" />
  if (last < prev) return <TrendingDown size={14} className="text-green-400" />
  return <Minus size={14} className="text-gray-500" />
}

export default function StatsCards({ readings }) {
  const latest = readings[readings.length - 1]
  const avg7 = readings.length > 0
    ? (readings.slice(-7).reduce((a, r) => a + r.glucose, 0) / Math.min(readings.length, 7)).toFixed(1)
    : null
  const avg30 = readings.length > 0
    ? (readings.reduce((a, r) => a + r.glucose, 0) / readings.length).toFixed(1)
    : null

  const highCount = readings.filter(r => r.glucose >= 126).length
  const lowCount = readings.filter(r => r.glucose < 70).length

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Latest Reading */}
      <div className="stat-card col-span-2 sm:col-span-1 animate-fade-in">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Latest Reading</p>
        {latest ? (
          <>
            <div className="flex items-end gap-2 mt-1">
              <span className="text-4xl font-bold" style={{ color: classifyGlucose(latest.glucose).color }}>
                {latest.glucose}
              </span>
              <span className="text-sm text-gray-400 mb-1">mg/dL</span>
              <span className="mb-1 ml-auto">
                <TrendIcon readings={readings} />
              </span>
            </div>
            <StatusBadge value={latest.glucose} className="mt-1 w-fit" />
            <p className="text-xs text-gray-600 mt-2">{new Date(latest.datetime).toLocaleString()}</p>
          </>
        ) : (
          <p className="text-gray-600 text-sm mt-2">No readings yet</p>
        )}
      </div>

      {/* 7-Day Avg */}
      <div className="stat-card animate-fade-in">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">7-Day Avg</p>
        {avg7 ? (
          <>
            <div className="flex items-end gap-1 mt-1">
              <span className="text-3xl font-bold text-brand-secondary">{avg7}</span>
              <span className="text-sm text-gray-400 mb-1">mg/dL</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">Target: 70–140 mg/dL</p>
          </>
        ) : (
          <p className="text-gray-600 text-sm mt-2">—</p>
        )}
      </div>

      {/* All-time Avg */}
      <div className="stat-card animate-fade-in">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">All-Time Avg</p>
        {avg30 ? (
          <>
            <div className="flex items-end gap-1 mt-1">
              <span className="text-3xl font-bold text-purple-300">{avg30}</span>
              <span className="text-sm text-gray-400 mb-1">mg/dL</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">{readings.length} total readings</p>
          </>
        ) : (
          <p className="text-gray-600 text-sm mt-2">—</p>
        )}
      </div>

      {/* Alerts */}
      <div className="stat-card animate-fade-in">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider flex items-center gap-1">
          <Activity size={10} /> Alerts
        </p>
        <div className="mt-2 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-orange-400">High (&gt;125)</span>
            <span className="text-sm font-bold text-orange-400">{highCount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-red-400">Low (&lt;70)</span>
            <span className="text-sm font-bold text-red-400">{lowCount}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
