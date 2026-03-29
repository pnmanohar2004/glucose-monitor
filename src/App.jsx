import { useState, useCallback } from 'react'
import Header from './components/Header.jsx'
import StatsCards from './components/StatsCards.jsx'
import LogMeasurementForm from './components/LogMeasurementForm.jsx'
import GlucoseChart from './components/GlucoseChart.jsx'
import RecentLogs from './components/RecentLogs.jsx'
import HardwareIntegration from './components/HardwareIntegration.jsx'
import RamanSpectroscopyInfo from './components/RamanSpectroscopyInfo.jsx'
import { loadReadings, saveReadings } from './utils.js'

export default function App() {
  const [readings, setReadings] = useState(() => loadReadings())

  const handleSave = useCallback((newReading) => {
    setReadings(prev => {
      const updated = [...prev, newReading]
      saveReadings(updated)
      return updated
    })
  }, [])

  const handleDelete = useCallback((id) => {
    setReadings(prev => {
      const updated = prev.filter(r => r.id !== id)
      saveReadings(updated)
      return updated
    })
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col gap-6">
        {/* Stats Row */}
        <StatsCards readings={readings} />

        {/* Main Content: Form + Chart side by side on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Log Form – 1 column on large screens */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <LogMeasurementForm onSave={handleSave} />
            <RecentLogs readings={readings} onDelete={handleDelete} />
          </div>

          {/* Chart – spans 2 columns on large screens */}
          <div className="lg:col-span-2">
            <GlucoseChart readings={readings} />
          </div>
        </div>

        {/* Raman Spectroscopy Section */}
        <RamanSpectroscopyInfo />

        {/* Hardware Integration Section */}
        <HardwareIntegration />
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-xs text-gray-700 border-t border-dark-600/30">
        GlucoSense · Data stored locally · Not a substitute for medical advice
      </footer>
    </div>
  )
}
