import React from 'react'
import { Activity, Clock, Database, Bell, Settings, LogOut, Webhook } from 'lucide-react'

export default function Sidebar({ onBack, activeTab, onTabChange }) {
  const NavItem = ({ icon: Icon, label, active }) => (
    <button
      onClick={() => onTabChange(label)}
      className={`w-full flex items-center gap-4 px-4 py-3.5 mb-1 rounded-xl transition-all duration-300 ${
        active 
          ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30' 
          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
      }`}
    >
      <Icon size={20} className={active ? 'text-white' : 'text-slate-400 dark:text-slate-500'} />
      <span className="font-bold text-sm tracking-wide">{label}</span>
    </button>
  )

  return (
    <aside className="hidden lg:flex flex-col w-72 h-screen sticky top-0 border-r border-slate-200 dark:border-white/5 bg-white dark:bg-[#12121e]">
      {/* Brand Header */}
      <div className="h-24 flex items-center px-8 border-b border-slate-100 dark:border-white/5">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20 mr-4">
          <Activity size={20} className="text-white" />
        </div>
        <span className="font-bold text-2xl tracking-tighter text-slate-900 dark:text-white uppercase transition-colors">
          Gluco<span className="text-purple-500 dark:text-purple-400">Sense</span>
        </span>
      </div>

      {/* Navigation Space */}
      <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-10">
        
        {/* Monitoring Group */}
        <div>
          <div className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-4 ml-1">
            Monitoring
          </div>
          <nav className="flex flex-col">
            <NavItem icon={Activity} label="Live Feed" active={activeTab === 'Live Feed'} />
            <NavItem icon={Clock} label="Historical Logs" active={activeTab === 'Historical Logs'} />
            <NavItem icon={Webhook} label="Webhook Logic" active={activeTab === 'Webhook Logic'} />
            <NavItem icon={Database} label="Device Nodes" active={activeTab === 'Device Nodes'} />
          </nav>
        </div>

        {/* System Group */}
        <div>
           <div className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-4 ml-1">
            System
          </div>
          <nav className="flex flex-col">
            <NavItem icon={Bell} label="Alerts & Rules" active={activeTab === 'Alerts & Rules'} />
            <NavItem icon={Settings} label="Console Config" active={activeTab === 'Console Config'} />
          </nav>
        </div>

      </div>

      {/* Footer / Exit */}
      <div className="p-6 border-t border-slate-100 dark:border-white/5 mt-auto">
        <button 
          onClick={onBack}
          className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 text-slate-500 dark:text-slate-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400"
        >
          <LogOut size={20} />
          <span className="font-bold text-sm tracking-wide">Exit</span>
        </button>
      </div>
    </aside>
  )
}
