import { TrendingUp, TrendingDown, Minus, AlertTriangle, Droplets, Utensils, Moon, Activity } from 'lucide-react'
import { classifyGlucose } from '../utils'

function Trend({ readings }) {
  if (readings.length < 2) return <Minus size={13} className="text-slate-400" />
  const last = readings[readings.length - 1].glucose
  const prev = readings[readings.length - 2].glucose
  if (last > prev) return <TrendingUp size={13} className="text-amber-500" />
  if (last < prev) return <TrendingDown size={13} className="text-emerald-500" />
  return <Minus size={13} className="text-slate-400" />
}

function Card({ children, className = '' }) {
  return (
    <div className={`rounded-2xl border border-slate-200 dark:border-white/[0.07]
                     bg-white dark:bg-[#0e1017] p-5 flex flex-col gap-4
                     transition-colors duration-300 ${className}`}>
      {children}
    </div>
  )
}

function CardLabel({ icon: Icon, label, color }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}18` }}>
          <Icon size={14} style={{ color }} />
        </div>
        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/30">{label}</span>
      </div>
    </div>
  )
}

export default function StatsCards({ readings }) {
  const latest      = readings[readings.length - 1]
  const latestStatus = latest ? classifyGlucose(latest.glucose) : null

  const fastingReadings = readings.filter(r => r.type === 'fasting')
  const mealReadings    = readings.filter(r => r.type && r.type !== 'fasting')

  const avgFasting = fastingReadings.length > 0
    ? (fastingReadings.reduce((a, r) => a + r.glucose, 0) / fastingReadings.length).toFixed(1)
    : null

  const avgMeal = mealReadings.length > 0
    ? (mealReadings.reduce((a, r) => a + r.glucose, 0) / mealReadings.length).toFixed(1)
    : null

  const highCount = readings.filter(r => r.glucose >= 126).length
  const hypoCount = readings.filter(r => r.glucose  <  70).length

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

      {/* Latest Reading */}
      <Card className="col-span-2 lg:col-span-1">
        <CardLabel icon={Droplets} label="Latest Reading" color="#a855f7" />
        {latest ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-end gap-2 leading-none">
              <span className="text-4xl font-black" style={{ color: latestStatus.color }}>
                {latest.glucose}
              </span>
              <span className="text-sm font-semibold text-slate-400 mb-0.5">mg/dL</span>
              <span className="ml-auto mb-0.5">
                <Trend readings={readings} />
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span
                className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                style={{ background: `${latestStatus.color}18`, color: latestStatus.color }}
              >
                {latestStatus.label}
              </span>
              {latest.type && (
                <span className="text-[10px] font-semibold text-slate-400 dark:text-white/30 uppercase tracking-widest">
                  {latest.type}
                </span>
              )}
            </div>
          </div>
        ) : (
          <span className="text-3xl font-black text-slate-200 dark:text-white/10">—</span>
        )}
      </Card>

      {/* Fasting Average */}
      <Card>
        <CardLabel icon={Moon} label="Fasting Avg" color="#6366f1" />
        {avgFasting ? (
          <div className="flex flex-col gap-1">
            <div className="flex items-end gap-1.5 leading-none">
              <span className="text-3xl font-black text-indigo-500 dark:text-indigo-400">{avgFasting}</span>
              <span className="text-sm font-semibold text-slate-400 mb-0.5">mg/dL</span>
            </div>
            <span className="text-[10px] font-semibold text-slate-400 dark:text-white/25">Target: 70 – 99 mg/dL</span>
          </div>
        ) : (
          <span className="text-3xl font-black text-slate-200 dark:text-white/10">—</span>
        )}
      </Card>

      {/* Post-Meal Average */}
      <Card>
        <CardLabel icon={Utensils} label="Post-Meal Avg" color="#3b82f6" />
        {avgMeal ? (
          <div className="flex flex-col gap-1">
            <div className="flex items-end gap-1.5 leading-none">
              <span className="text-3xl font-black text-blue-500 dark:text-blue-400">{avgMeal}</span>
              <span className="text-sm font-semibold text-slate-400 mb-0.5">mg/dL</span>
            </div>
            <span className="text-[10px] font-semibold text-slate-400 dark:text-white/25">Target: &lt;140 mg/dL</span>
          </div>
        ) : (
          <span className="text-3xl font-black text-slate-200 dark:text-white/10">—</span>
        )}
      </Card>

      {/* Alerts */}
      <Card>
        <CardLabel icon={AlertTriangle} label="Clinical Alerts" color="#f59e0b" />
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-[12px] font-semibold text-slate-600 dark:text-white/60">Hyperglycemia</span>
            </div>
            <span className="text-base font-black text-amber-500">{highCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-[12px] font-semibold text-slate-600 dark:text-white/60">Hypoglycemia</span>
            </div>
            <span className="text-base font-black text-red-500">{hypoCount}</span>
          </div>
        </div>
      </Card>

    </div>
  )
}
