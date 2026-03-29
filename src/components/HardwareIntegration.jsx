import { Cpu, Fingerprint, Code, Database, Info } from 'lucide-react'

export default function HardwareIntegration() {
  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 w-fit">
          <Cpu size={14} />
          <span className="text-[10px] font-bold tracking-widest uppercase">Hardware Integration</span>
        </div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Connect Your ESP32 Module</h2>
        <p className="text-gray-400 max-w-2xl text-sm leading-relaxed">
          Integrate your hardware kit directly with the GlucoSense cloud. Use the following credentials to authenticate your ESP32 module and start streaming real-time data to your dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Connection Credentials */}
        <div className="glass-card p-6 flex flex-col gap-6 border-l-4 border-emerald-500/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Database size={20} />
            </div>
            <div>
              <h3 className="text-white font-semibold">Cloud Credentials</h3>
              <p className="text-[10px] text-gray-500 uppercase font-bold">Firestore Auth</p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Device UID</span>
              <div className="bg-dark-900 border border-dark-600 rounded-lg p-3 font-mono text-emerald-400 text-sm flex items-center justify-between group">
                <span>demo-123</span>
                <button className="opacity-0 group-hover:opacity-100 text-[10px] text-gray-600 hover:text-white transition-opacity uppercase font-bold">Copy</button>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Firestore Path</span>
              <div className="bg-dark-900 border border-dark-600 rounded-lg p-3 font-mono text-emerald-400 text-sm flex items-center justify-between group">
                <span>readings/</span>
                <button className="opacity-0 group-hover:opacity-100 text-[10px] text-gray-600 hover:text-white transition-opacity uppercase font-bold">Copy</button>
              </div>
            </div>
          </div>

          <div className="mt-auto p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex gap-3">
            <Info size={16} className="text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-emerald-400/80 leading-snug">
              Ensure your ESP32 is running the latest firmware version (v2.4+) to support encrypted data transmission.
            </p>
          </div>
        </div>

        {/* Logic / Code Snippet */}
        <div className="glass-card p-6 flex flex-col gap-4 border-l-4 border-purple-500/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
              <Fingerprint size={20} />
            </div>
            <div>
              <h3 className="text-white font-semibold">Finger Placement Logic</h3>
              <p className="text-[10px] text-gray-500 uppercase font-bold">Sensor Trigger</p>
            </div>
          </div>

          <p className="text-xs text-gray-400 leading-relaxed">
            To ensure accurate readings, your ESP32 should only transmit glucose data when the sensor detects a finger. Update the <code className="text-emerald-400 px-1 py-0.5 bg-dark-900 rounded">devices/demo-123</code> document:
          </p>

          <div className="relative group">
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <Code size={14} className="text-gray-500" />
            </div>
            <pre className="bg-dark-900 border border-dark-600 rounded-xl p-5 text-[11px] font-mono leading-relaxed text-gray-300 overflow-x-auto shadow-inner">
{`// Update this when finger is detected
{
  "isFingerPlaced": true,
  "lastUpdate": serverTimestamp()
}`}
            </pre>
          </div>

          <div className="mt-2 flex items-center gap-2 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Real-time Sync Active
          </div>
        </div>
      </div>
    </div>
  )
}
