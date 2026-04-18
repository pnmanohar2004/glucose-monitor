import { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer
} from 'recharts'
import { format } from 'date-fns'
import { classifyGlucose } from '../utils'
import { BarChart2, Heart, Activity, Thermometer, Layers } from 'lucide-react'

const TABS = [
  { id: 'all', label: 'All', icon: Layers, color: '#94a3b8' },
  { id: 'glucose', label: 'Glucose', icon: BarChart2, color: '#a855f7' },
  { id: 'bpm', label: 'Heart Rate', icon: Heart, color: '#f43f5e' },
  { id: 'spo2', label: 'SpO2', icon: Activity, color: '#3b82f6' },
  { id: 'temperature', label: 'Temperature', icon: Thermometer, color: '#f97316' },
]

function CustomDot(props) {
  const { cx, cy, payload, dataKey } = props
  
  if (cx === undefined || cy === undefined) return null

  let fill = '#fff'
  if (dataKey === 'glucose') {
    const status = classifyGlucose(payload.glucose)
    fill = status.color
  } else if (dataKey === 'bpm') {
    fill = '#f43f5e'
  } else if (dataKey === 'spo2') {
    fill = '#3b82f6'
  } else if (dataKey === 'temperature') {
    fill = '#f97316'
  }

  return <circle cx={cx} cy={cy} r={4} fill={fill} stroke="currentColor" className="text-white dark:text-[#1a1625]" strokeWidth={2} />
}

function CustomTooltip({ active, payload, label: xLabel, dataKey }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  
  if (dataKey === 'all') {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 shadow-xl text-xs min-w-[150px]">
        <div className="flex justify-between items-start gap-4 mb-3 pb-2 border-b border-slate-100 dark:border-slate-800/50">
          <p className="text-slate-500 dark:text-slate-400 font-medium">{format(new Date(d.datetime), 'MM/dd HH:mm')}</p>
        </div>
        <div className="flex flex-col gap-2">
          {TABS.filter(t => t.id !== 'all').map(tab => {
            const val = d[tab.id]
            if (val === undefined || val === null) return null
            const unit = tab.id === 'bpm' ? 'BPM' : tab.id === 'spo2' ? '%' : tab.id === 'temperature' ? '°C' : 'mg/dL'
            return (
              <div key={tab.id} className="flex justify-between items-center gap-4">
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                  <tab.icon size={12} style={{ color: tab.color }} />
                  <span>{tab.label}</span>
                </div>
                <div className="font-bold text-slate-900 dark:text-white">
                  {val} <span className="text-[10px] font-normal text-slate-500">{unit}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (dataKey === 'glucose') {
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

  const value = d[dataKey]
  const unit = dataKey === 'bpm' ? 'BPM' : dataKey === 'spo2' ? '%' : '°C'
  
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 shadow-xl text-xs">
      <div className="flex justify-between items-start gap-4 mb-2">
        <p className="text-slate-500 dark:text-slate-400 font-medium">{format(new Date(d.datetime), 'MM/dd HH:mm')}</p>
      </div>
      <div className="flex items-baseline gap-1 mb-1">
        <p className="text-slate-900 dark:text-white font-bold text-xl">{value !== undefined && value !== null ? value : '—'}</p>
        <span className="text-slate-500 text-xs">{unit}</span>
      </div>
    </div>
  )
}

export default function GlucoseChart({ readings }) {
  const [activeTab, setActiveTab] = useState('glucose')
  
  const data = [...readings]
    .filter(r => r && r.datetime && !isNaN(new Date(r.datetime).getTime()))
    .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
    .map(r => ({
      ...r,
      label: format(new Date(r.datetime), 'MM/dd HH:mm'),
    }))

  const filteredData = activeTab === 'all' 
    ? data 
    : data.filter(d => d[activeTab] !== undefined && d[activeTab] !== null)
  
  const activeConfig = TABS.find(t => t.id === activeTab)
  const ActiveIcon = activeConfig.icon

  return (
    <div className="animate-fade-in flex flex-col min-h-[480px] bg-white dark:bg-[#1a1625] rounded-xl p-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <ActiveIcon size={24} style={{ color: activeConfig.color }} />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {activeConfig.label} Trend
          </h3>
        </div>
        
        <div className="flex flex-wrap bg-slate-100 dark:bg-slate-800/50 p-1 rounded-lg gap-1">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 sm:py-1.5 rounded-md text-xs font-bold transition-all ${
                  isActive 
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <Icon size={14} className={isActive ? '' : 'opacity-70'} style={isActive ? { color: tab.color } : {}} />
                <span className="inline">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="h-[350px] min-h-[350px] w-full min-w-0">
        {filteredData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-600">
            <ActiveIcon size={48} className="mb-4 opacity-10" />
            <p className="text-xs font-bold uppercase tracking-widest">No readings yet</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <LineChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                domain={['auto', 'auto']}
                tick={{ fill: '#64748B', fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip dataKey={activeTab} />} cursor={{ stroke: activeConfig.color, strokeWidth: 1, strokeDasharray: '4 4' }} />
              {activeTab === 'glucose' && <ReferenceLine y={70} stroke="#EF4444" strokeDasharray="3 3" />}
              {activeTab === 'all' ? (
                TABS.filter(t => t.id !== 'all').map(tab => (
                  <Line
                    key={tab.id}
                    type="monotone"
                    dataKey={tab.id}
                    stroke={tab.color}
                    strokeWidth={2}
                    dot={{ r: 3, fill: tab.color, strokeWidth: 0 }}
                    activeDot={{ r: 5, strokeWidth: 0, fill: tab.color }}
                    animationDuration={1500}
                    isAnimationActive={false}
                  />
                ))
              ) : (
                <Line
                  type="monotone"
                  dataKey={activeTab}
                  stroke={activeConfig.color}
                  strokeWidth={3}
                  dot={<CustomDot dataKey={activeTab} />}
                  activeDot={{ r: 6, strokeWidth: 0, fill: activeConfig.color }}
                  animationDuration={1500}
                  isAnimationActive={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {activeTab === 'glucose' && (
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
      )}
    </div>
  )
}
