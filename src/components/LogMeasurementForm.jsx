import { useState } from 'react'
import { Plus, ClipboardEdit } from 'lucide-react'
import { classifyGlucose } from '../utils'

export default function LogMeasurementForm({ onSave }) {
  const now = new Date()
  const localISOString = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16)

  const [glucose, setGlucose] = useState('')
  const [datetime, setDatetime] = useState(localISOString)
  const [type, setType] = useState('fasting')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const preview = classifyGlucose(glucose)

  function handleSubmit(e) {
    e.preventDefault()
    const val = parseFloat(glucose)
    if (!glucose || isNaN(val) || val < 1 || val > 600) {
      setError('Please enter a valid glucose level (1–600 mg/dL)')
      return
    }
    setError('')

    const reading = {
      glucose: val,
      datetime: new Date(datetime).toISOString(),
      type: type,
      notes: notes.trim(),
    }

    onSave(reading)
    setGlucose('')
    setNotes('')
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="glass-card p-6 animate-slide-up">
      <h2 className="text-base font-semibold text-white flex items-center gap-2 mb-5">
        <ClipboardEdit size={16} className="text-brand-secondary" />
        Log Measurement
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Glucose Input */}
        <div>
          <label className="block text-xs text-gray-400 font-medium mb-1.5">
            Glucose Level <span className="text-gray-600">(mg/dL)</span>
          </label>
          <div className="relative">
            <input
              id="glucose-input"
              type="number"
              min="1"
              max="600"
              step="0.1"
              value={glucose}
              onChange={e => setGlucose(e.target.value)}
              placeholder="e.g., 110"
              className="input-field pr-20"
            />
            {glucose && !isNaN(parseFloat(glucose)) && (
              <span
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold px-2 py-0.5 rounded-full ${preview.bg} ${preview.text}`}
              >
                {preview.label}
              </span>
            )}
          </div>
          {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-400 font-medium mb-1.5">Date & Time</label>
            <input
              type="datetime-local"
              value={datetime}
              onChange={e => setDatetime(e.target.value)}
              className="input-field"
              style={{ colorScheme: 'dark' }}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-400 font-medium mb-1.5">Reading Type</label>
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              className="input-field appearance-none"
            >
              <option value="fasting">Fasting</option>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs text-gray-400 font-medium mb-1.5">Notes <span className="text-gray-600">(optional)</span></label>
          <input
            type="text"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="e.g., After breakfast"
            className="input-field"
            maxLength={120}
          />
        </div>

        {/* Submit */}
        <button type="submit" className="btn-primary mt-1" id="save-reading-btn">
          {saved ? (
            <span className="text-green-300">✓ Saved!</span>
          ) : (
            <>
              <Plus size={16} />
              Save Reading
            </>
          )}
        </button>
      </form>
    </div>
  )
}
