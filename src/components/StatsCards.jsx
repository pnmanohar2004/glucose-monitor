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
  
  const fastingReadings = readings.filter(r => r.type === 'fasting')
  const mealReadings = readings.filter(r => r.type && r.type !== 'fasting')

  const avgFasting = fastingReadings.length > 0
    ? (fastingReadings.reduce((a, r) => a + r.glucose, 0) / fastingReadings.length).toFixed(1)
    : null
  
  const avgMeal = mealReadings.length > 0
    ? (mealReadings.reduce((a, r) => a + r.glucose, 0) / mealReadings.length).toFixed(1)
    : null

  const highCount = readings.filter(r => r.glucose >= 126).length
  const hypoCount = readings.filter(r => r.glucose < 70).length

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Latest Reading */}
      <div className="stat-card col-span-2 sm:col-span-1 animate-fade-in border-l-4" style={{ borderColor: latest ? classifyGlucose(latest.glucose).color : 'transparent' }}>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Latest Reading</p>
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
            <div className="flex items-center gap-2 mt-1">
              <StatusBadge value={latest.glucose} />
              {latest.type && <span className="text-[10px] text-gray-500 uppercase font-bold">{latest.type}</span>}
            </div>
          </>
        ) : (
          <p className="text-gray-600 text-sm mt-2">No readings yet</p>
        )}
      </div>

      {/* Fasting Avg */}
      <div className="stat-card animate-fade-in">
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Fasting Avg</p>
        {avgFasting ? (
          <>
            <div className="flex items-end gap-1 mt-1">
              <span className="text-3xl font-bold text-brand-secondary">{avgFasting}</span>
              <span className="text-sm text-gray-400 mb-1">mg/dL</span>
            </div>
            <p className="text-[10px] text-gray-600 mt-1 uppercase font-semibold">Goal: 70–99 mg/dL</p>
          </>
        ) : (
          <p className="text-gray-600 text-sm mt-2">—</p>
        )}
      </div>

      {/* Post-Meal Avg */}
      <div className="stat-card animate-fade-in">
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Post-Meal Avg</p>
        {avgMeal ? (
          <>
            <div className="flex items-end gap-1 mt-1">
              <span className="text-3xl font-bold text-purple-300">{avgMeal}</span>
              <span className="text-sm text-gray-400 mb-1">mg/dL</span>
            </div>
            <p className="text-[10px] text-gray-600 mt-1 uppercase font-semibold">Goal: &lt;140 mg/dL</p>
          </>
        ) : (
          <p className="text-gray-600 text-sm mt-2">—</p>
        )}
      </div>

      {/* Alerts */}
      <div className="stat-card animate-fade-in">
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-1">
          <Activity size={10} /> Clinical Alerts
        </p>
        <div className="mt-2 flex flex-col gap-2">
          <div className="flex justify-between items-center group cursor-help">
            <span className="text-xs text-orange-400 group-hover:text-orange-300 transition-colors">High / Hyper</span>
            <span className="text-sm font-bold text-orange-400">{highCount}</span>
          </div>
          <div className="flex justify-between items-center group cursor-help">
            <span className="text-xs text-red-500 group-hover:text-red-400 transition-colors font-bold">Hypoglycemia</span>
            <span className="text-sm font-bold text-red-500 animate-pulse">{hypoCount}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
