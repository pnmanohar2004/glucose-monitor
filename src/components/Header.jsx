import { UserButton } from '@clerk/react'
import { Bell, Search, Sun, Moon, Menu } from 'lucide-react'

export default function Header({ onBack, theme, onToggleTheme, onMenuClick }) {
  return (
    <header className="sticky top-0 z-50 w-full flex items-center gap-3 px-5 py-3
                       bg-white/85 dark:bg-[#07080f]/85 backdrop-blur-xl
                       border-b border-slate-200 dark:border-white/[0.06]
                       transition-colors duration-300">

      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-xl bg-slate-100 dark:bg-white/[0.05]
                   border border-slate-200 dark:border-white/[0.07]
                   text-slate-600 dark:text-white/50
                   hover:text-violet-600 dark:hover:text-violet-400
                   hover:border-violet-500/30 transition-all"
      >
        <Menu size={18} />
      </button>

      {/* Search */}
      <div className="relative flex-1 max-w-xs">
        <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-white/25 pointer-events-none" />
        <input
          type="text"
          placeholder="Search logs…"
          className="w-full bg-slate-100 dark:bg-white/[0.05]
                     border border-slate-200 dark:border-white/[0.07]
                     rounded-xl pl-9 pr-4 py-2 text-[13px]
                     text-slate-900 dark:text-white
                     placeholder:text-slate-400 dark:placeholder:text-white/20
                     focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/50
                     transition-all"
        />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Controls */}
      <div className="flex items-center gap-2">

        {/* Live status */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl
                        bg-violet-500/8 dark:bg-violet-500/10
                        border border-violet-500/15 dark:border-violet-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">NIR Live</span>
        </div>

        {/* Bell */}
        <button className="relative p-2 rounded-xl
                           bg-slate-100 dark:bg-white/[0.05]
                           border border-slate-200 dark:border-white/[0.07]
                           text-slate-500 dark:text-white/40
                           hover:text-violet-600 dark:hover:text-violet-400
                           hover:border-violet-500/30 transition-all">
          <Bell size={16} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-violet-500" />
        </button>

        {/* Theme */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-xl
                     bg-slate-100 dark:bg-white/[0.05]
                     border border-slate-200 dark:border-white/[0.07]
                     text-slate-500 dark:text-white/40
                     hover:text-violet-600 dark:hover:text-violet-400
                     hover:border-violet-500/30 transition-all"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Avatar */}
        <div className="rounded-xl bg-slate-100 dark:bg-white/[0.05]
                        border border-slate-200 dark:border-white/[0.07] p-1.5">
          <UserButton />
        </div>
      </div>
    </header>
  )
}
