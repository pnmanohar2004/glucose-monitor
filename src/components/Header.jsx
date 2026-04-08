import { UserButton } from '@clerk/react'
import { Activity, Bell, Search, Sun, Moon, ArrowLeft, MoreVertical } from 'lucide-react'

export default function Header({ onBack, theme, onToggleTheme }) {
  return (
    <header className="w-full flex justify-between items-center py-4 px-8 border-b border-slate-200 dark:border-white/5 bg-white/50 dark:bg-[#12121e]/50 backdrop-blur-md sticky top-0 z-50 transition-colors duration-500">
      {/* Search Console */}
      <div className="flex items-center gap-6 flex-1 max-w-2xl">
        <div className="relative w-full">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600" />
          <input 
            type="text" 
            placeholder="Search NIR logs..." 
            className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full pl-12 pr-6 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Right Side Tools */}
      <div className="flex items-center gap-4 ml-8">
        {/* Alerts Center */}
        <button className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:scale-105 active:scale-95 transition-all relative">
          <Bell size={20} />
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-purple-500 shadow-lg shadow-purple-500/50" />
        </button>

        {/* Theme Toggle */}
        <button 
          onClick={onToggleTheme}
          className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-white/70 hover:scale-105 active:scale-95 transition-all"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <div className="rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1">
          <UserButton />
        </div>

        {/* System Overview Label */}
        <div className="hidden sm:flex items-center gap-3 px-4 py-2 border-l border-slate-200 dark:border-slate-800 ml-2">
          <div className="text-right">
            <div className="text-[10px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-600 leading-tight">NIR Sensor Uplink</div>
            <div className="text-xs font-bold text-purple-600 dark:text-purple-500 uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
              Live Link Active
            </div>
          </div>
          <MoreVertical size={16} className="text-slate-400" />
        </div>
      </div>
    </header>
  )
}
