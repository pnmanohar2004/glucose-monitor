import { useCallback } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../convex/_generated/api'
import Header from './components/Header.jsx'
import StatsCards from './components/StatsCards.jsx'
import LogMeasurementForm from './components/LogMeasurementForm.jsx'
import GlucoseChart from './components/GlucoseChart.jsx'
import RecentLogs from './components/RecentLogs.jsx'
import HardwareIntegration from './components/HardwareIntegration.jsx'
import RamanSpectroscopyInfo from './components/RamanSpectroscopyInfo.jsx'

export default function App() {
  // Real-time readings from Convex — auto-updates across all clients
  const readings = useQuery(api.readings.listReadings) ?? []

  const saveReadingMutation = useMutation(api.readings.saveReading)
  const deleteReadingMutation = useMutation(api.readings.deleteReading)

  const handleSave = useCallback(async (newReading) => {
    await saveReadingMutation({
      glucose: newReading.glucose,
      datetime: newReading.datetime,
      type: newReading.type,
      notes: newReading.notes,
    })
  }, [saveReadingMutation])

  const handleDelete = useCallback(async (id) => {
    await deleteReadingMutation({ id })
  }, [deleteReadingMutation])

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
        GlucoSense · Powered by Convex · Not a substitute for medical advice
      </footer>
    </div>
  )
}
