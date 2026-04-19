import { Activity, Droplets, Heart, Wifi, Thermometer, Clock, AlertCircle } from 'lucide-react'
import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { useState, useEffect } from 'react'
import GlucoseHwChart from './GlucoseHwChart.jsx'
import BpmChart from './BpmChart.jsx'
import Spo2Chart from './Spo2Chart.jsx'
import TempChart from './TempChart.jsx'

// How many seconds old a reading can be before it's considered stale
const STALE_THRESHOLD_SECONDS = 15

export default function LiveHardwareFeed() {
  const hardwareLogs = useQuery(api.hardwareLogs.listLogs) || []
  const [now, setNow] = useState(Date.now())

  // Tick every second so the staleness indicator updates live
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  const latestLog = hardwareLogs[0] ?? null

  // _creationTime is in milliseconds (auto-set by Convex)
  const ageSeconds = latestLog
    ? Math.floor((now - latestLog._creationTime) / 1000)
    : null

  const isStale = ageSeconds === null || ageSeconds > STALE_THRESHOLD_SECONDS
  const isLive = !isStale

  const formatAge = (secs) => {
    if (secs < 60) return `${secs}s ago`
    if (secs < 3600) return `${Math.floor(secs / 60)}m ago`
    return `${Math.floor(secs / 3600)}h ago`
  }

  const statusBg = (status) => {
    if (!status) return 'bg-slate-100 dark:bg-slate-800 text-slate-400'
    const s = status.toUpperCase()
    if (s === 'HIGH') return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
    if (s === 'LOW') return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
    return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
  }

  // Only show the sensor value when data is live, otherwise show a dash
  const liveVal = (val) => (isLive && val !== undefined && val !== null) ? val : '—'

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className={`glass-card p-6 flex flex-col gap-4 border-l-4 ${isLive ? 'border-green-500/40' : 'border-yellow-500/40'}`}>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isLive ? 'bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'}`}>
              <Activity size={20} />
            </div>
            <div>
              <h3 className="text-slate-900 dark:text-white font-semibold">Live Controller Readings</h3>
              <p className="text-[10px] text-slate-500 uppercase font-bold">Real-time data from your device</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Live / Stale badge */}
            {isLive ? (
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-green-600 dark:text-green-400 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
                LIVE
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-yellow-600 dark:text-yellow-400 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
                <AlertCircle size={10} />
                {ageSeconds !== null ? `Last seen ${formatAge(ageSeconds)}` : 'No data yet'}
              </span>
            )}

            {hardwareLogs.length > 0 && (
              <span className="text-[10px] font-bold text-slate-400 bg-slate-500/10 px-3 py-1 rounded-full border border-slate-500/20">
                {hardwareLogs.length} reading{hardwareLogs.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Stale warning banner */}
        {isStale && latestLog && (
          <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-2.5">
            <AlertCircle size={14} className="text-yellow-500 shrink-0" />
            <p className="text-[11px] text-yellow-700 dark:text-yellow-300 font-medium">
              No finger on sensor — place your finger on the sensor to see live readings.
            </p>
          </div>
        )}

        {/* No data at all */}
        {hardwareLogs.length === 0 ? (
          <div className="bg-slate-100/50 dark:bg-[#13132B]/50 border border-slate-200 dark:border-white/10 rounded-xl p-10 flex flex-col items-center justify-center text-center gap-3">
            <Activity size={36} className="text-slate-400 opacity-40" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Waiting for controller data...</p>
            <p className="text-[11px] text-slate-500">Point your controller to the webhook URL. Data will appear here automatically.</p>
          </div>
        ) : (
          <>
            {/* Sensor reading cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

              {/* Glucose — always show last known (it's the main metric) */}
              <div className={`p-4 rounded-xl bg-purple-500/5 border border-purple-500/15 flex flex-col gap-1 transition-opacity ${isStale ? 'opacity-40' : 'opacity-100'}`}>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase font-bold">
                  <Droplets size={12} className="text-purple-500" /> Glucose
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {isLive ? latestLog.glucose_mgdl : '—'}
                </div>
                <div className="text-[10px] text-slate-500">mg/dL</div>
                {isLive && latestLog.glucose_status && (
                  <span className={`mt-1 text-[9px] font-bold px-2 py-0.5 rounded-full w-fit ${statusBg(latestLog.glucose_status)}`}>
                    {latestLog.glucose_status}
                  </span>
                )}
              </div>

              {/* Heart Rate */}
              <div className={`p-4 rounded-xl bg-rose-500/5 border border-rose-500/15 flex flex-col gap-1 transition-opacity ${isStale ? 'opacity-40' : 'opacity-100'}`}>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase font-bold">
                  <Heart size={12} className="text-rose-500" /> Heart Rate
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {liveVal(latestLog.heart_rate)}
                </div>
                <div className="text-[10px] text-slate-500">BPM</div>
                {isLive && latestLog.hr_status && (
                  <span className={`mt-1 text-[9px] font-bold px-2 py-0.5 rounded-full w-fit ${statusBg(latestLog.hr_status)}`}>
                    {latestLog.hr_status}
                  </span>
                )}
              </div>

              {/* SpO2 */}
              <div className={`p-4 rounded-xl bg-blue-500/5 border border-blue-500/15 flex flex-col gap-1 transition-opacity ${isStale ? 'opacity-40' : 'opacity-100'}`}>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase font-bold">
                  <Activity size={12} className="text-blue-500" /> SpO2
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {liveVal(latestLog.spo2)}
                </div>
                <div className="text-[10px] text-slate-500">%</div>
              </div>

              {/* Temperature */}
              <div className={`p-4 rounded-xl bg-orange-500/5 border border-orange-500/15 flex flex-col gap-1 transition-opacity ${isStale ? 'opacity-40' : 'opacity-100'}`}>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase font-bold">
                  <Thermometer size={12} className="text-orange-500" /> Temp
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {liveVal(latestLog.temperature)}
                </div>
                <div className="text-[10px] text-slate-500">°C</div>
              </div>

              {/* WiFi RSSI — always show (device connectivity, not finger-dependent) */}
              <div className="p-4 rounded-xl bg-slate-500/5 border border-slate-500/15 flex flex-col gap-1">
                <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase font-bold">
                  <Wifi size={12} className="text-slate-500" /> WiFi RSSI
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {latestLog.wifi_rssi ?? '—'}
                </div>
                <div className="text-[10px] text-slate-500">dBm</div>
                <div className="text-[10px] text-slate-400 mt-1 truncate">{latestLog.device ?? 'ESP32'}</div>
              </div>

            </div>

            {/* Dynamic Live Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mt-2">
              <GlucoseHwChart logs={hardwareLogs} isLive={isLive} />
              <BpmChart logs={hardwareLogs} isLive={isLive} />
              <Spo2Chart logs={hardwareLogs} isLive={isLive} />
              <TempChart logs={hardwareLogs} isLive={isLive} />
            </div>

            {/* Timestamp */}
            {latestLog._creationTime && (
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                <Clock size={10} />
                Last reading: {new Date(latestLog._creationTime).toLocaleTimeString()}
                {ageSeconds !== null && ` · ${formatAge(ageSeconds)}`}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
