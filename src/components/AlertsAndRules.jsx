import React, { useState, useMemo, useEffect } from 'react'
import { Bell, AlertTriangle, TrendingUp, TrendingDown, WifiOff, Save, CheckCircle2, ChevronRight, Activity, ArrowUpRight, ArrowDownRight, AlertOctagon, HeartPulse, Wind } from 'lucide-react'

export default function AlertsAndRules({ readings = [] }) {
  const [isSaving, setIsSaving] = useState(false)
  const [showSavedMsg, setShowSavedMsg] = useState(false)

  const [rules, setRules] = useState([
    {
      id: 'high_glucose',
      title: 'Critical High Glucose',
      description: 'Trigger an alert when glucose levels exceed the upper safety limit.',
      icon: TrendingUp,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      threshold: 250,
      unit: 'mg/dL',
      enabled: true,
    },
    {
      id: 'low_glucose',
      title: 'Critical Low Glucose',
      description: 'Trigger an alert when glucose levels drop below the lower safety limit.',
      icon: TrendingDown,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      threshold: 55,
      unit: 'mg/dL',
      enabled: true,
    },
    {
      id: 'rapid_rise',
      title: 'Rapid Rise Warning',
      description: 'Notify when glucose is increasing faster than the specified rate.',
      icon: ArrowUpRight,
      color: 'text-violet-500',
      bgColor: 'bg-violet-500/10',
      threshold: 3,
      unit: 'mg/dL/min',
      enabled: false,
    },
    {
      id: 'rapid_drop',
      title: 'Rapid Drop Warning',
      description: 'Notify when glucose is decreasing faster than the specified rate.',
      icon: ArrowDownRight,
      color: 'text-violet-500',
      bgColor: 'bg-violet-500/10',
      threshold: 3,
      unit: 'mg/dL/min',
      enabled: true,
    },
    {
      id: 'high_bpm',
      title: 'High Heart Rate',
      description: 'Trigger an alert when BPM exceeds the safe upper limit.',
      icon: HeartPulse,
      color: 'text-rose-500',
      bgColor: 'bg-rose-500/10',
      threshold: 120,
      unit: 'BPM',
      enabled: true,
    },
    {
      id: 'low_bpm',
      title: 'Low Heart Rate',
      description: 'Trigger an alert when BPM falls below the safe lower limit.',
      icon: HeartPulse,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10',
      threshold: 50,
      unit: 'BPM',
      enabled: true,
    },
    {
      id: 'low_spo2',
      title: 'Low Oxygen Saturation',
      description: 'Trigger an alert when SpO2 drops below healthy levels.',
      icon: Wind,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
      threshold: 92,
      unit: '%',
      enabled: true,
    },
    {
      id: 'sensor_timeout',
      title: 'Sensor Disconnected',
      description: 'Alert when no data has been received from the hardware node.',
      icon: WifiOff,
      color: 'text-slate-500',
      bgColor: 'bg-slate-500/10 dark:bg-white/10 dark:text-white/70',
      threshold: 15,
      unit: 'minutes',
      enabled: true,
    },
  ])

  const handleToggle = (id) => {
    setRules(prev => prev.map(rule => rule.id === id ? { ...rule, enabled: !rule.enabled } : rule))
  }

  const handleThresholdChange = (id, value) => {
    setRules(prev => prev.map(rule => rule.id === id ? { ...rule, threshold: value } : rule))
  }

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setShowSavedMsg(true)
      setTimeout(() => setShowSavedMsg(false), 3000)
    }, 800)
  }

  const [now, setNow] = useState(Date.now())
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  // Calculate active alerts based on latest readings and enabled rules
  const activeAlerts = useMemo(() => {
    const alerts = []
    if (!readings || readings.length === 0) return alerts
    
    // Get the latest reading
    const latestReading = readings[readings.length - 1]
    if (!latestReading) return alerts
    
    // Check if the data stream is live or stale
    const ageSeconds = (now - new Date(latestReading.datetime).getTime()) / 1000
    const isStale = ageSeconds > 15
    
    // Check if the sensor explicitly reported missing physical contact
    const notesStr = String(latestReading?.notes || "").toLowerCase()
    const hasNoFinger = notesStr.includes("no finger") || notesStr.includes("invalid")

    // If data is old (finger removed & stream stopped) OR explicitly reported as no finger, don't show physiological alerts
    if (isStale || hasNoFinger) return alerts

    const latestGlucose = latestReading?.glucose
    const latestBpm = latestReading?.bpm
    const latestSpo2 = latestReading?.spo2

    if (latestGlucose) {
      const highRule = rules.find(r => r.id === 'high_glucose')
      if (highRule?.enabled && latestGlucose > highRule.threshold) {
        alerts.push({
          id: 'active_high',
          title: 'Critical High Glucose Alert',
          message: `Current glucose level (${latestGlucose} mg/dL) exceeds the safety threshold of ${highRule.threshold} mg/dL.`,
          color: 'text-red-500',
          bgColor: 'bg-red-50 dark:bg-red-500/10',
          borderColor: 'border-red-200 dark:border-red-500/20',
          icon: AlertOctagon
        })
      }
      
      const lowRule = rules.find(r => r.id === 'low_glucose')
      if (lowRule?.enabled && latestGlucose < lowRule.threshold) {
        alerts.push({
          id: 'active_low',
          title: 'Critical Low Glucose Alert',
          message: `Current glucose level (${latestGlucose} mg/dL) is below the safety threshold of ${lowRule.threshold} mg/dL.`,
          color: 'text-orange-500',
          bgColor: 'bg-orange-50 dark:bg-orange-500/10',
          borderColor: 'border-orange-200 dark:border-orange-500/20',
          icon: AlertTriangle
        })
      }
    }

    if (latestBpm) {
      // Prevent false alarms when the user is not touching the sensor (BPM drops to 0 or very low)
      const hasValidPulse = latestBpm > 20;

      if (hasValidPulse) {
        const highBpmRule = rules.find(r => r.id === 'high_bpm')
        if (highBpmRule?.enabled && latestBpm > highBpmRule.threshold) {
          alerts.push({
            id: 'active_high_bpm',
            title: 'High Heart Rate Alert',
            message: `Current heart rate (${Math.round(latestBpm)} BPM) exceeds the safety threshold of ${highBpmRule.threshold} BPM.`,
            color: 'text-rose-500',
            bgColor: 'bg-rose-50 dark:bg-rose-500/10',
            borderColor: 'border-rose-200 dark:border-rose-500/20',
            icon: HeartPulse
          })
        }
        
        const lowBpmRule = rules.find(r => r.id === 'low_bpm')
        if (lowBpmRule?.enabled && latestBpm < lowBpmRule.threshold) {
          alerts.push({
            id: 'active_low_bpm',
            title: 'Low Heart Rate Alert',
            message: `Current heart rate (${Math.round(latestBpm)} BPM) is below the safety threshold of ${lowBpmRule.threshold} BPM.`,
            color: 'text-indigo-500',
            bgColor: 'bg-indigo-50 dark:bg-indigo-500/10',
            borderColor: 'border-indigo-200 dark:border-indigo-500/20',
            icon: HeartPulse
          })
        }
      }
    }

    if (latestSpo2) {
      const hasValidPulseForSpo2 = latestBpm && latestBpm > 20;
      
      const lowSpo2Rule = rules.find(r => r.id === 'low_spo2')
      // Only alert on low oxygen if there's actually a finger on the scanner
      if (lowSpo2Rule?.enabled && latestSpo2 < lowSpo2Rule.threshold && hasValidPulseForSpo2) {
        alerts.push({
          id: 'active_low_spo2',
          title: 'Low Oxygen Alert (Hypoxemia)',
          message: `Current SpO2 level (${latestSpo2}%) is below the safety threshold of ${lowSpo2Rule.threshold}%.`,
          color: 'text-cyan-500',
          bgColor: 'bg-cyan-50 dark:bg-cyan-500/10',
          borderColor: 'border-cyan-200 dark:border-cyan-500/20',
          icon: Wind
        })
      }
    }

    return alerts
  }, [readings, rules, now])

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5 border-l-4 border-violet-500 pl-4 py-1">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Alerts & Rules</h2>
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400 dark:text-white/25">
            System Notifications & Thresholds
          </p>
        </div>
        
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl
                     bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm
                     transition-all shadow-md shadow-violet-500/20 active:scale-95 disabled:opacity-70 disabled:scale-100"
        >
          {isSaving ? (
            <Activity className="animate-spin" size={16} />
          ) : showSavedMsg ? (
            <CheckCircle2 size={16} />
          ) : (
            <Save size={16} />
          )}
          {isSaving ? 'Saving...' : showSavedMsg ? 'Rules Saved' : 'Save Configuration'}
        </button>
      </div>

      {activeAlerts.length > 0 && (
        <div className="flex flex-col gap-3 animate-fade-in mb-2">
          <h3 className="text-[12px] font-bold uppercase tracking-widest text-slate-800 dark:text-white/70 flex items-center gap-2">
            <Bell size={14} className="text-red-500 animate-bounce" /> Active Alerts ({activeAlerts.length})
          </h3>
          {activeAlerts.map(alert => {
            const Icon = alert.icon
            return (
              <div key={alert.id} className={`p-4 rounded-xl border ${alert.bgColor} ${alert.borderColor} flex items-start gap-4 shadow-sm relative overflow-hidden group`}>
                <div className={`mt-0.5 p-2.5 rounded-xl bg-white dark:bg-[#07080f]/50 shadow-sm ${alert.color}`}>
                  <Icon size={20} />
                </div>
                <div className="flex-1">
                  <h4 className={`text-[15px] font-black ${alert.color} mb-0.5 tracking-tight`}>{alert.title}</h4>
                  <p className="text-[13px] text-slate-700 dark:text-white/70 font-medium leading-relaxed">
                    {alert.message}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {rules.map((rule) => {
          const Icon = rule.icon
          return (
            <div 
              key={rule.id} 
              className={`p-5 rounded-2xl border transition-all duration-300 ${
                rule.enabled 
                  ? 'bg-white dark:bg-[#0e1017] border-slate-200 dark:border-white/[0.07] shadow-sm' 
                  : 'bg-slate-50 dark:bg-white/[0.02] border-transparent opacity-75'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center gap-5 justify-between">
                
                {/* Left Section: Icon & Text */}
                <div className="flex items-start gap-4 flex-1">
                  <div className={`mt-0.5 p-3 rounded-xl shrink-0 ${rule.bgColor} ${rule.color}`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className={`text-[15px] font-bold ${rule.enabled ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-white/40'}`}>
                      {rule.title}
                    </h3>
                    <p className={`text-[13px] leading-relaxed max-w-lg ${rule.enabled ? 'text-slate-500 dark:text-white/50' : 'text-slate-400 dark:text-white/30'}`}>
                      {rule.description}
                    </p>
                  </div>
                </div>

                {/* Right Section: Controls */}
                <div className="flex items-center gap-6 self-start md:self-center ml-14 md:ml-0">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
                    rule.enabled ? 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5' : 'border-transparent opacity-50'
                  }`}>
                    <input
                      type="number"
                      value={rule.threshold || ''}
                      onChange={(e) => handleThresholdChange(rule.id, e.target.value)}
                      disabled={!rule.enabled}
                      className="w-14 text-right bg-transparent text-[15px] font-bold text-slate-800 dark:text-white outline-none focus:text-violet-500 transition-colors"
                    />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-white/30">
                      {rule.unit}
                    </span>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    onClick={() => handleToggle(rule.id)}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 outline-none focus:ring-2 focus:ring-violet-500/50 focus:ring-offset-2 dark:focus:ring-offset-[#07080f] ${
                      rule.enabled ? 'bg-violet-500' : 'bg-slate-300 dark:bg-white/10'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                        rule.enabled ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

              </div>
            </div>
          )
        })}
      </div>

      <div className="p-5 rounded-2xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/[0.05] mt-2 flex gap-4">
        <AlertTriangle className="text-orange-500 shrink-0 mt-0.5" size={20} />
        <div>
          <h4 className="text-[13px] font-bold text-slate-800 dark:text-white/90 mb-1">Important Note</h4>
          <p className="text-[12px] text-slate-500 dark:text-white/50 leading-relaxed">
            Alerts configured here apply globally to data processed by the GlucoSense platform. Depending on your browser permissions and external integrations, local push notifications may require additional authorization.
          </p>
        </div>
      </div>
    </div>
  )
}
