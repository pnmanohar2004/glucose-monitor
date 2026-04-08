import { Activity, Droplets, Heart, Wifi } from 'lucide-react'
import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"

export default function LiveHardwareFeed() {
  const hardwareLogs = useQuery(api.hardwareLogs.listLogs) || []

  const formatDate = (dateString) => {
    const d = new Date(dateString)
    return isNaN(d.getTime()) ? dateString : d.toLocaleString()
  }

  const statusColor = (status) => {
    if (!status) return 'text-slate-400'
    const s = status.toUpperCase()
    if (s === 'HIGH') return 'text-red-500 dark:text-red-400'
    if (s === 'LOW')  return 'text-yellow-500 dark:text-yellow-400'
    return 'text-green-500 dark:text-green-400'
  }

  const statusBg = (status) => {
    if (!status) return 'bg-slate-100 dark:bg-slate-800 text-slate-400'
    const s = status.toUpperCase()
    if (s === 'HIGH') return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
    if (s === 'LOW')  return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
    return 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Live Webhook Logs */}
      <div className="glass-card p-6 flex flex-col gap-4 border-l-4 border-green-500/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-400">
              <Activity size={20} />
            </div>
            <div>
              <h3 className="text-slate-900 dark:text-white font-semibold">Live ESP32 Readings</h3>
              <p className="text-[10px] text-slate-500 uppercase font-bold">Real-time data from your device</p>
            </div>
          </div>
          {hardwareLogs.length > 0 && (
            <span className="text-[10px] font-bold text-green-600 dark:text-green-400 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20">
              {hardwareLogs.length} reading{hardwareLogs.length !== 1 ? 's' : ''} received
            </span>
          )}
        </div>

        {hardwareLogs.length === 0 ? (
          <div className="bg-slate-100/50 dark:bg-[#13132B]/50 border border-slate-200 dark:border-white/10 rounded-xl p-10 flex flex-col items-center justify-center text-center gap-3">
            <Activity size={36} className="text-slate-400 opacity-40" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Waiting for ESP32 data...</p>
            <p className="text-[11px] text-slate-500">Point your ESP32 to the webhook URL. Data will appear here automatically.</p>
          </div>
        ) : (
          <>
            {/* Latest reading cards */}
            {hardwareLogs.slice(0, 1).map((log) => (
              <div key={log._id + '_card'} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/15 flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase font-bold">
                    <Droplets size={12} className="text-purple-500" /> Glucose
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{log.glucose_mgdl}</div>
                  <div className="text-[10px] text-slate-500">mg/dL</div>
                  {log.glucose_status && (
                    <span className={`mt-1 text-[9px] font-bold px-2 py-0.5 rounded-full w-fit ${statusBg(log.glucose_status)}`}>
                      {log.glucose_status}
                    </span>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/15 flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase font-bold">
                    <Heart size={12} className="text-rose-500" /> Heart Rate
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{log.heart_rate ?? '—'}</div>
                  <div className="text-[10px] text-slate-500">BPM</div>
                  {log.hr_status && (
                    <span className={`mt-1 text-[9px] font-bold px-2 py-0.5 rounded-full w-fit ${statusBg(log.hr_status)}`}>
                      {log.hr_status}
                    </span>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/15 flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase font-bold">
                    <Activity size={12} className="text-blue-500" /> SpO2
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{log.spo2 ?? '—'}</div>
                  <div className="text-[10px] text-slate-500">%</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-500/5 border border-slate-500/15 flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase font-bold">
                    <Wifi size={12} className="text-slate-500" /> WiFi RSSI
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{log.wifi_rssi ?? '—'}</div>
                  <div className="text-[10px] text-slate-500">dBm</div>
                  <div className="text-[10px] text-slate-400 mt-1 truncate">{log.device ?? 'ESP32'}</div>
                </div>
              </div>
            ))}


          </>
        )}
      </div>
    </div>
  )
}
