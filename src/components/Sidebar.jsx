import React from 'react'
import { useClerk } from '@clerk/react'
import { Activity, Clock, Database, Bell, Settings, LogOut, Webhook, Radio, X } from 'lucide-react'

const NAV_GROUPS = [
  {
    label: 'Monitoring',
    items: [
      { icon: Radio,    label: 'Live Feed'       },
      { icon: Clock,    label: 'Historical Logs' },
      { icon: Webhook,  label: 'Webhook Logic'   },
      { icon: Database, label: 'Device Nodes'    },
    ],
  },
  {
    label: 'System',
    items: [
      { icon: Bell,     label: 'Alerts & Rules'  },
      { icon: Settings, label: 'Console Config'  },
    ],
  },
]

function SidebarContent({ activeTab, onTabChange, onClose, onExit }) {
  return (
    <div className="flex flex-col h-full">

      {/* ── Brand ── */}
      <div className="h-14 flex items-center justify-between px-5
                      border-b border-slate-100 dark:border-white/[0.06] shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600
                          flex items-center justify-center shadow-md shadow-violet-500/30 shrink-0">
            <Activity size={14} className="text-white" />
          </div>
          <span className="font-black text-[17px] tracking-tight text-slate-900 dark:text-white leading-none">
            Gluco<span className="text-violet-500">Sense</span>
          </span>
        </div>
        {/* Close button — mobile only */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white
                       hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* ── Nav ── */}
      <nav className="flex-1 overflow-y-auto px-3 py-5 flex flex-col gap-6">
        {NAV_GROUPS.map(group => (
          <div key={group.label}>
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400 dark:text-white/20 mb-1.5 px-2">
              {group.label}
            </p>
            <div className="flex flex-col gap-0.5">
              {group.items.map(({ icon: Icon, label }) => {
                const active = activeTab === label
                return (
                  <button
                    key={label}
                    onClick={() => onTabChange(label)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-150 ${
                      active
                        ? 'bg-violet-600 text-white shadow-md shadow-violet-500/25'
                        : 'text-slate-500 dark:text-white/40 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <Icon size={17} className={active ? 'text-white' : 'text-slate-400 dark:text-white/25'} />
                    {label}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ── Footer ── */}
      <div className="px-3 py-4 border-t border-slate-100 dark:border-white/[0.06] shrink-0">
        <button
          onClick={onExit}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold
                     text-slate-400 dark:text-white/30
                     hover:bg-red-50 dark:hover:bg-red-500/10
                     hover:text-red-500 dark:hover:text-red-400
                     transition-all duration-150"
        >
          <LogOut size={16} />
          Exit Portal
        </button>
      </div>
    </div>
  )
}

export default function Sidebar({ onBack, activeTab, onTabChange, isOpen, onClose }) {
  const { signOut } = useClerk()

  const handleExit = async () => {
    try {
      await signOut()
    } catch {
      onBack?.()
    }
  }

  return (
    <>
      {/* ── Desktop sidebar (always visible) ── */}
      <aside className="hidden lg:flex flex-col w-60 h-screen sticky top-0 shrink-0
                        bg-white dark:bg-[#0b0c14]
                        border-r border-slate-100 dark:border-white/[0.06]
                        transition-colors duration-300">
        <SidebarContent
          activeTab={activeTab}
          onTabChange={onTabChange}
          onExit={handleExit}
        />
      </aside>

      {/* ── Mobile overlay backdrop ── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* ── Mobile slide-in drawer ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 flex flex-col
                    bg-white dark:bg-[#0b0c14]
                    border-r border-slate-100 dark:border-white/[0.06]
                    shadow-2xl shadow-black/20
                    transform transition-transform duration-300 ease-in-out
                    lg:hidden
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <SidebarContent
          activeTab={activeTab}
          onTabChange={onTabChange}
          onClose={onClose}
          onExit={handleExit}
        />
      </aside>
    </>
  )
}
