import { useCallback, useState, useEffect } from 'react'
import { Show, SignIn, SignUp, useClerk } from '@clerk/react'
import { Activity, ArrowLeft } from 'lucide-react'
import { Authenticated, AuthLoading, Unauthenticated, useMutation, useQuery } from 'convex/react'
import { api } from '../convex/_generated/api'
import Header from './components/Header.jsx'
import StatsCards from './components/StatsCards.jsx'
import LogMeasurementForm from './components/LogMeasurementForm.jsx'
import GlucoseChart from './components/GlucoseChart.jsx'
import RecentLogs from './components/RecentLogs.jsx'
import HardwareIntegration from './components/HardwareIntegration.jsx'
import LiveHardwareFeed from './components/LiveHardwareFeed.jsx'
import LandingPage from './components/LandingPage.jsx'
import Sidebar from './components/Sidebar.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

function Dashboard({ readings, hardwareLogs, onSave, onDelete, onBack, theme, onToggleTheme }) {
  const [activeTab, setActiveTab] = useState('Historical Logs')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex bg-[#f5f6fa] dark:bg-[#07080f] text-slate-900 dark:text-white transition-colors duration-300 animate-fade-in">
      <Sidebar
        onBack={onBack}
        activeTab={activeTab}
        onTabChange={(tab) => { setActiveTab(tab); setSidebarOpen(false) }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto w-full">
        <Header onBack={onBack} theme={theme} onToggleTheme={onToggleTheme} onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 max-w-7xl w-full mx-auto px-5 py-5 flex flex-col gap-6">

          {activeTab === 'Historical Logs' && (
            <>
              {/* Page Heading */}
              <div className="flex flex-col gap-0.5 border-l-4 border-violet-500 pl-4 py-1">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">NIR Sensor Dashboard</h2>
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400 dark:text-white/25">Near-Infrared Light Penetration Stream</p>
              </div>

              {/* Stats Row */}
              <StatsCards readings={readings} />

              {/* Main Chart */}
              <div className="rounded-2xl border border-slate-200 dark:border-white/[0.07] bg-white dark:bg-[#0e1017] p-5">
                <ErrorBoundary>
                  <GlucoseChart readings={readings} />
                </ErrorBoundary>
              </div>

              {/* Bottom Row: Form + Logs */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-1 rounded-2xl border border-dashed border-slate-200 dark:border-white/[0.07] bg-white dark:bg-[#0e1017] p-5">
                  <LogMeasurementForm onSave={onSave} />
                </div>
                <div className="lg:col-span-2 rounded-2xl border border-slate-200 dark:border-white/[0.07] bg-white dark:bg-[#0e1017] p-5">
                  <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-100 dark:border-white/[0.06]">
                    <h3 className="text-[12px] font-bold uppercase tracking-widest flex items-center gap-2 text-slate-700 dark:text-white/70">
                      <Activity size={13} className="text-violet-500" /> NIR Reading Log
                    </h3>
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-white/20 uppercase tracking-widest">Cloud Sync</span>
                  </div>
                  <RecentLogs readings={readings} onDelete={onDelete} />
                </div>
              </div>
            </>
          )}

          {activeTab === 'Webhook Logic' && (
            <>
              <div className="flex flex-col gap-0.5 border-l-4 border-violet-500 pl-4 py-1">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">Webhook Controller</h2>
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400 dark:text-white/25">Data Ingestion Settings</p>
              </div>
              <HardwareIntegration />
            </>
          )}

          {activeTab === 'Live Feed' && (
            <>
              <div className="flex flex-col gap-0.5 border-l-4 border-violet-500 pl-4 py-1">
                <h2 className="text-xl font-black text-slate-900 dark:text-white">Live Feed</h2>
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-slate-400 dark:text-white/25">Real-Time Sensor Link</p>
              </div>
              <LiveHardwareFeed />
            </>
          )}

          {/* Placeholder for other tabs */}
          {(activeTab === 'Device Nodes' || activeTab === 'Alerts & Rules' || activeTab === 'Console Config') && (
            <div className="flex flex-col items-center justify-center flex-1 h-[60vh] opacity-50">
              <Activity className="text-purple-500 mb-4 animate-pulse" size={48} />
              <h2 className="text-2xl font-bold uppercase tracking-widest">{activeTab}</h2>
              <p className="text-sm mt-2 font-mono">Module pending initialization</p>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="px-5 py-4 border-t border-slate-100 dark:border-white/[0.05] bg-white dark:bg-[#0b0c14]">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-2 opacity-30">
              <Activity size={13} className="text-violet-500" />
              <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-slate-600 dark:text-white">GlucoSense</span>
            </div>
            <p className="text-[10px] font-semibold text-slate-400 dark:text-white/20">© 2026 · Convex Cloud</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default function App() {
  const [unauthenticatedView, setUnauthenticatedView] = useState(() => {
    const authView = new URLSearchParams(window.location.search).get('auth')
    return authView === 'sign-up' ? 'sign-up' : authView === 'sign-in' ? 'sign-in' : 'landing'
  })
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

  useEffect(() => {
    const url = new URL(window.location.href)
    const portal = url.searchParams.get('portal')
    const auth = url.searchParams.get('auth')
    if (!portal && !auth) {
      return
    }

    url.searchParams.delete('portal')
    url.searchParams.delete('auth')
    const nextSearch = url.searchParams.toString()
    const nextUrl = `${url.pathname}${nextSearch ? `?${nextSearch}` : ''}${url.hash}`
    window.history.replaceState({}, '', nextUrl)
  }, [])

  return (
    <>
      <AuthLoading>
        <div className="min-h-screen bg-slate-50 dark:bg-dark-900 text-slate-900 dark:text-white flex items-center justify-center">
          <div className="text-center">
            <div className="text-xs font-black uppercase tracking-[0.4em] text-purple-500">Authenticating</div>
          </div>
        </div>
      </AuthLoading>
      <Unauthenticated>
        {unauthenticatedView === 'landing' ? (
          <LandingPage
            onLaunch={() => setUnauthenticatedView('sign-in')}
            onOpenSignUp={() => setUnauthenticatedView('sign-up')}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        ) : (
          <AuthScreen
            mode={unauthenticatedView}
            theme={theme}
            onToggleTheme={toggleTheme}
            onBack={() => setUnauthenticatedView('landing')}
          />
        )}
      </Unauthenticated>
      <Authenticated>
        <AuthenticatedApp
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      </Authenticated>
    </>
  )
}

function AuthScreen({ mode, theme, onToggleTheme, onBack }) {
  const isSignUp = mode === 'sign-up'

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-900 text-slate-900 dark:text-white selection:bg-purple-500/30 bg-mesh transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-slate-500 dark:text-white/50 hover:text-purple-500 transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <button
            onClick={onToggleTheme}
            className="p-2.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/70 hover:scale-105 active:scale-95 transition-all"
          >
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="space-y-6">
            <div className="text-[10px] uppercase font-black tracking-[0.4em] text-purple-600 dark:text-purple-400">Bio Portal Access</div>
            <h1 className="text-5xl font-black tracking-tight">{isSignUp ? 'Create your account.' : 'Sign in to the dashboard.'}</h1>
            <p className="max-w-xl text-slate-500 dark:text-white/50 text-lg">
              Complete authentication here and you will be redirected directly to the dashboard.
            </p>
          </div>

          <div className="glass-card p-6 md:p-8 border-slate-200 dark:border-white/5 bg-white dark:bg-dark-800">
            {isSignUp ? (
              <SignUp
                forceRedirectUrl="/?portal=dashboard"
                fallbackRedirectUrl="/?portal=dashboard"
                signInUrl="/?auth=sign-in"
              />
            ) : (
              <SignIn
                forceRedirectUrl="/?portal=dashboard"
                fallbackRedirectUrl="/?portal=dashboard"
                signUpUrl="/?auth=sign-up"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function AuthenticatedApp({ theme, onToggleTheme }) {
  // Real-time readings from Convex
  const readings = useQuery(api.readings.listReadings) ?? []
  const hardwareLogs = useQuery(api.hardwareLogs.listLogs) ?? []
  const saveReadingMutation = useMutation(api.readings.saveReading)
  const deleteReadingMutation = useMutation(api.readings.deleteReading)

  const dashboardReadings = [
    ...readings.map((reading) => ({
      ...reading,
      source: 'manual',
      bpm: undefined,
      spo2: undefined,
      temperature: undefined,
      rValue: undefined,
      device: undefined,
    })),
    ...hardwareLogs.map((log) => ({
      ...log,
      glucose: log.glucose_mgdl,
      type: log.device ?? 'ESP32',
      notes: log.glucose_status,
      source: 'hardware',
      bpm: log.heart_rate,
      spo2: log.spo2,
      temperature: log.temperature,
      rValue: log.wifi_rssi,
      device: log.device ?? 'ESP32',
    })),
  ].sort((a, b) => new Date(a.datetime) - new Date(b.datetime))

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

  return (
    <Show when="signed-in">
      <Dashboard
        readings={dashboardReadings}
        hardwareLogs={hardwareLogs}
        onSave={handleSave}
        onDelete={handleDelete}
        onBack={() => { }}
        theme={theme}
        onToggleTheme={onToggleTheme}
      />
    </Show>
  )
}
