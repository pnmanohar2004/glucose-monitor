import { Droplets } from 'lucide-react'

export default function Header() {
  return (
    <header className="w-full py-5 px-6 flex items-center justify-between border-b border-dark-600/50">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-primary to-purple-400 flex items-center justify-center shadow-lg shadow-purple-500/30">
          <Droplets size={18} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white leading-tight">
            Glow<span className="text-brand-secondary">Monitor</span>
          </h1>
          <p className="text-xs text-gray-500 font-medium tracking-wide">NON-INVASIVE GLUCOSE TRACKER</p>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500 bg-dark-700 border border-dark-500 rounded-full px-3 py-1.5">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span>Monitoring Active</span>
      </div>
    </header>
  )
}
