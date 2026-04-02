import StatusBadge from './StatusBadge'
import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react'
import { classifyGlucose } from '../utils'

function TrendIcon({ readings }) {
  if (readings.length < 2) return <Minus size={14} className="text-slate-500" />
  const last = readings[readings.length - 1].glucose
  const prev = readings[readings.length - 2].glucose
  if (last > prev) return <TrendingUp size={14} className="text-orange-500" />
  if (last < prev) return <TrendingDown size={14} className="text-emerald-500" />
  return <Minus size={14} className="text-slate-500" />
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Latest Reading */}
      <div className={`glass-card p-6 flex flex-col justify-between border-l-4 ${latest ? '' : 'border-transparent'}`} style={{ borderLeftColor: latest ? classifyGlucose(latest.glucose).color : 'transparent' }}>
        <div className="text-[10px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-500 mb-4">Latest Reading</div>
        {latest ? (
          <div>
            <div className="flex items-end gap-2 mb-4">
              <span className="text-5xl font-black text-slate-900 dark:text-white leading-none" style={{ color: classifyGlucose(latest.glucose).color }}>
                {latest.glucose}
              </span>
              <span className="text-sm font-bold text-slate-400 dark:text-slate-500 mb-1">mg/dL</span>
              <span className="ml-auto mb-2">
                <TrendIcon readings={readings} />
              </span>
            </div>
            <div className="flex items-center gap-3 mt-auto pt-2">
              <StatusBadge value={latest.glucose} />
              {latest.type && <span className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500">{latest.type}</span>}
            </div>
          </div>
        ) : (
          <div className="text-sm font-bold text-slate-400 dark:text-slate-600 mt-2">No readings yet</div>
        )}
      </div>

      {/* Fasting Avg */}
      <div className="glass-card p-6 flex flex-col justify-between">
        <div className="text-[10px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-500 mb-4">Fasting Avg</div>
        {avgFasting ? (
          <div>
             <div className="flex items-end gap-2 mb-4">
              <span className="text-4xl font-black text-purple-500 dark:text-purple-400 leading-none">{avgFasting}</span>
              <span className="text-sm font-bold text-slate-400 dark:text-slate-500 mb-1">mg/dL</span>
            </div>
            <div className="text-[9px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-600 mt-auto pt-2">Goal: 70–99 mg/dL</div>
          </div>
        ) : (
           <div className="text-4xl font-black text-slate-300 dark:text-slate-800 leading-none">—</div>
        )}
      </div>

      {/* Post-Meal Avg */}
      <div className="glass-card p-6 flex flex-col justify-between">
        <div className="text-[10px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-500 mb-4">Post-Meal Avg</div>
        {avgMeal ? (
          <div>
            <div className="flex items-end gap-2 mb-4">
              <span className="text-4xl font-black text-blue-500 dark:text-blue-400 leading-none">{avgMeal}</span>
              <span className="text-sm font-bold text-slate-400 dark:text-slate-500 mb-1">mg/dL</span>
            </div>
            <div className="text-[9px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-600 mt-auto pt-2">Goal: &lt;140 mg/dL</div>
          </div>
        ) : (
           <div className="text-4xl font-black text-slate-300 dark:text-slate-800 leading-none">—</div>
        )}
      </div>

       {/* Alerts Card */}
       <div className="glass-card p-6 flex flex-col justify-between">
        <div className="text-[10px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-2">
          <Activity size={12} /> Clinical Alerts
        </div>
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex justify-between items-center text-sm">
            <span className="font-bold text-orange-500">High / Hyper</span>
            <span className="font-black text-orange-500">{highCount}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="font-bold text-red-500">Hypoglycemia</span>
            <span className="font-black text-red-500">{hypoCount}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
