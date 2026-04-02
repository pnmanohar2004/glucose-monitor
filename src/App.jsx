import { useCallback, useState, useEffect } from 'react'
import { Activity } from 'lucide-react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../convex/_generated/api'
import Header from './components/Header.jsx'
import StatsCards from './components/StatsCards.jsx'
import LogMeasurementForm from './components/LogMeasurementForm.jsx'
import GlucoseChart from './components/GlucoseChart.jsx'
import RecentLogs from './components/RecentLogs.jsx'
import HardwareIntegration from './components/HardwareIntegration.jsx'
import LandingPage from './components/LandingPage.jsx'
import Sidebar from './components/Sidebar.jsx'

function Dashboard({ readings, onSave, onDelete, onBack, theme, onToggleTheme }) {
  const [activeTab, setActiveTab] = useState('Historical Logs')

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors duration-500 animate-fade-in">
      <Sidebar onBack={onBack} activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 flex flex-col h-screen overflow-y-auto w-full">
        <Header onBack={onBack} theme={theme} onToggleTheme={onToggleTheme} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col gap-8">
        
        {activeTab === 'Historical Logs' && (
          <>
            {/* Page Heading */}
            <div className="flex flex-col gap-1 border-l-4 border-purple-500 pl-6 py-2">
              <h2 className="text-3xl font-black tracking-tight uppercase italic">NIR Sensor Dashboard</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 dark:text-white/30">Near-Infrared Light Penetration Stream</p>
            </div>

            {/* Stats Row */}
            <StatsCards readings={readings} />

            {/* Main Chart Section: Large & Primary */}
            <div className="glass-card p-10 border-slate-200 dark:border-white/5 shadow-2xl bg-white dark:bg-dark-800">
               <GlucoseChart readings={readings} />
            </div>

            {/* Bottom Row: Form + Logs side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Log Form */}
              <div className="lg:col-span-1">
                <div className="glass-card p-8 border-dashed border-2 border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02]">
                  <LogMeasurementForm onSave={onSave} />
                </div>
              </div>

              {/* Activity Logs */}
              <div className="lg:col-span-2">
                <div className="glass-card p-8 border-slate-200 dark:border-white/5 bg-white dark:bg-dark-800 h-full">
                  <div className="flex items-center justify-between mb-8 border-b border-slate-100 dark:border-white/5 pb-4">
                    <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                      <Activity size={14} className="text-purple-500" /> NIR Reading Log
                    </h3>
                    <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">ESP8266 Cloud Sync</div>
                  </div>
                  <RecentLogs readings={readings} onDelete={onDelete} />
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'Webhook Logic' && (
          <>
            <div className="flex flex-col gap-1 border-l-4 border-purple-500 pl-6 py-2">
              <h2 className="text-3xl font-black tracking-tight uppercase italic">Webhook Controller</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 dark:text-white/30">Data Ingestion Settings</p>
            </div>
            <HardwareIntegration />
          </>
        )}
        
        {/* Placeholder for other tabs */}
        {(activeTab === 'Live Feed' || activeTab === 'Device Nodes' || activeTab === 'Alerts & Rules' || activeTab === 'Console Config') && (
          <div className="flex flex-col items-center justify-center flex-1 h-[60vh] opacity-50">
            <Activity className="text-purple-500 mb-4 animate-pulse" size={48} />
            <h2 className="text-2xl font-bold uppercase tracking-widest">{activeTab}</h2>
            <p className="text-sm mt-2 font-mono">Module pending initialization</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-16 border-t border-slate-100 dark:border-white/5 bg-white dark:bg-dark-900 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-8 opacity-40">
          <div className="flex items-center gap-3">
            <Activity className="text-purple-500" size={16} />
            <span className="font-black text-[10px] uppercase tracking-[0.6em]">GlucoSense NIR Optical Core</span>
          </div>
          <p className="text-[9px] font-black uppercase tracking-[0.8em]">© 2026 Powered by Convex Cloud Persistence</p>
        </div>
      </footer>
      </div>
    </div>
  )
}

export default function App() {
  const [view, setView] = useState('landing')
  const [theme, setTheme] = useState(() => {
    // Restore saved theme or default to 'light'
    return localStorage.getItem('theme') || 'light'
  })

  // Theme Engine: Sync with HTML element and LocalStorage
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
  }

  // Real-time readings from Convex
  const readings = useQuery(api.readings.listReadings) ?? []
  const saveReadingMutation = useMutation(api.readings.saveReading)
  const deleteReadingMutation = useMutation(api.readings.deleteReading)

  const handleSave = useCallback(async (newReading) => {
    try {
      await saveReadingMutation({
        glucose: newReading.glucose,
        datetime: newReading.datetime,
        type: newReading.type,
        notes: newReading.notes,
      })
    } catch (e) {
      console.error('Save failed:', e)
    }
  }, [saveReadingMutation])

  const handleDelete = useCallback(async (id) => {
    await deleteReadingMutation({ id })
  }, [deleteReadingMutation])

  if (view === 'landing') {
    return (
      <>
        <LandingPage 
          onLaunch={() => setView('dashboard')} 
          theme={theme} 
          onToggleTheme={toggleTheme} 
        />
      </>
    )
  }

  return (
    <>
      <Dashboard 
        readings={readings} 
        onSave={handleSave} 
        onDelete={handleDelete} 
        onBack={() => setView('landing')}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    </>
  )
}
