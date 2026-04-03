import { useState } from 'react'
import { Cpu, Fingerprint, Code, Database, Info, Check, Copy, Activity, Wifi, Heart, Droplets } from 'lucide-react'
import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"

export default function HardwareIntegration() {
  const [copiedUrl, setCopiedUrl] = useState(false)
  const webhookUrl = `${import.meta.env.VITE_CONVEX_SITE_URL}/add-reading`

  const hardwareLogs = useQuery(api.hardwareLogs.listLogs) || []

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl)
      setCopiedUrl(true)
      setTimeout(() => setCopiedUrl(false), 2000)
    } catch (err) {
      console.error('Failed to copy', err)
    }
  }

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
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 w-fit">
          <Cpu size={14} />
          <span className="text-[10px] font-bold tracking-widest uppercase">Hardware Integration</span>
        </div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Connect Your ESP32 Module</h2>
        <p className="text-slate-600 dark:text-gray-400 max-w-2xl text-sm leading-relaxed">
          Integrate your ESP32 hardware directly with the GlucoSense cloud. Use the Webhook URL below — your device is already sending the correct payload format.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Webhook URL */}
        <div className="glass-card p-6 flex flex-col gap-6 border-l-4 border-purple-500/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Database size={20} />
            </div>
            <div>
              <h3 className="text-slate-900 dark:text-white font-semibold">Webhook Endpoint</h3>
              <p className="text-[10px] text-slate-500 uppercase font-bold">Convex HTTP Action</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Webhook URL (POST)</span>
              <div className="bg-slate-100 dark:bg-[#13132B] border border-slate-200 dark:border-white/10 rounded-lg p-3 font-mono text-purple-600 dark:text-purple-400 text-sm flex items-center justify-between group break-all">
                <span className="truncate mr-4">{webhookUrl}</span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 bg-white dark:bg-dark-800 border border-slate-200 dark:border-white/10 px-2 py-1 rounded text-[10px] text-slate-600 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors uppercase font-bold shrink-0"
                >
                  {copiedUrl ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                  {copiedUrl ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-auto p-4 rounded-xl bg-purple-500/5 border border-purple-500/10 flex gap-3">
            <Info size={16} className="text-purple-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-purple-700 dark:text-purple-400/80 leading-snug">
              Send a <strong>POST JSON payload</strong> to this URL. No changes needed on your ESP32 — the payload format is already correct.
            </p>
          </div>
        </div>

        {/* Payload Example */}
        <div className="glass-card p-6 flex flex-col gap-4 border-l-4 border-blue-500/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Fingerprint size={20} />
            </div>
            <div>
              <h3 className="text-slate-900 dark:text-white font-semibold">ESP32 Payload Format</h3>
              <p className="text-[10px] text-slate-500 uppercase font-bold">Exact data your device sends</p>
            </div>
          </div>

          <div className="relative group flex-1">
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <Code size={14} className="text-slate-400" />
            </div>
            <pre className="bg-slate-100 dark:bg-[#13132B] border border-slate-200 dark:border-white/10 rounded-xl p-5 text-[11px] font-mono leading-relaxed text-slate-700 dark:text-gray-300 overflow-x-auto shadow-inner">
{`POST /add-reading
Content-Type: application/json

{
  "device": "ESP32-GlucoseMonitor",
  "glucose_mgdl": 68,
  "heart_rate": 14,
  "spo2": 99,
  "wifi_rssi": -36,
  "glucose_status": "LOW",
  "hr_status": "LOW"
}`}
            </pre>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Live Webhook Active — Receiving Data
          </div>
        </div>
      </div>

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
            <p className="text-[11px] text-slate-500">Point your ESP32 to the webhook URL above. Data will appear here automatically.</p>
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

            {/* Full history table */}
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/10">
                    <th className="py-3 px-4 font-semibold text-slate-700 dark:text-white uppercase text-[10px] tracking-wider">Time</th>
                    <th className="py-3 px-4 font-semibold text-slate-700 dark:text-white uppercase text-[10px] tracking-wider">Glucose (mg/dL)</th>
                    <th className="py-3 px-4 font-semibold text-slate-700 dark:text-white uppercase text-[10px] tracking-wider hidden sm:table-cell">Status</th>
                    <th className="py-3 px-4 font-semibold text-slate-700 dark:text-white uppercase text-[10px] tracking-wider hidden md:table-cell">Heart Rate</th>
                    <th className="py-3 px-4 font-semibold text-slate-700 dark:text-white uppercase text-[10px] tracking-wider hidden md:table-cell">SpO2</th>
                    <th className="py-3 px-4 font-semibold text-slate-700 dark:text-white uppercase text-[10px] tracking-wider hidden lg:table-cell">WiFi</th>
                    <th className="py-3 px-4 font-semibold text-slate-700 dark:text-white uppercase text-[10px] tracking-wider hidden lg:table-cell">Device</th>
                  </tr>
                </thead>
                <tbody>
                  {hardwareLogs.map((log) => (
                    <tr key={log._id} className="border-b border-slate-200 dark:border-white/5 last:border-0 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 text-slate-600 dark:text-gray-300 text-xs">{formatDate(log.datetime)}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-800 dark:text-white">{log.glucose_mgdl}</span>
                        <span className="text-slate-400 text-xs ml-1">mg/dL</span>
                      </td>
                      <td className="py-3 px-4 hidden sm:table-cell">
                        {log.glucose_status
                          ? <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusBg(log.glucose_status)}`}>{log.glucose_status}</span>
                          : <span className="text-slate-400">—</span>}
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        {log.heart_rate !== undefined
                          ? <><span className={`font-semibold ${statusColor(log.hr_status)}`}>{log.heart_rate}</span><span className="text-slate-400 text-xs ml-1">bpm</span></>
                          : <span className="text-slate-400">—</span>}
                      </td>
                      <td className="py-3 px-4 hidden md:table-cell">
                        {log.spo2 !== undefined
                          ? <><span className="font-semibold text-blue-500 dark:text-blue-400">{log.spo2}</span><span className="text-slate-400 text-xs ml-1">%</span></>
                          : <span className="text-slate-400">—</span>}
                      </td>
                      <td className="py-3 px-4 text-slate-500 dark:text-gray-400 text-xs hidden lg:table-cell">{log.wifi_rssi !== undefined ? `${log.wifi_rssi} dBm` : '—'}</td>
                      <td className="py-3 px-4 text-slate-500 dark:text-gray-400 text-xs hidden lg:table-cell">{log.device ?? 'ESP32'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
