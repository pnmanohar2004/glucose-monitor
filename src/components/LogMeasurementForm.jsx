import { useState } from 'react'
import { Plus, ClipboardEdit, Database, Activity } from 'lucide-react'
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
      setError('Invalid Glucose range (1–600 mg/dL)')
      return
    }
    setError('')

    const reading = {
      glucose: val,
      datetime: new Date(datetime).toISOString(),
      type: type,
    }
    if (notes.trim()) {
      reading.notes = notes.trim()
    }

    onSave(reading)
    setGlucose('')
    setNotes('')
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="animate-fade-in flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 mb-2">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
          <ClipboardEdit size={14} className="text-purple-500" /> Log NIR Reading
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-black uppercase text-slate-400">Secure Uplink</span>
          <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-lg shadow-purple-500/50" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Glucose Input */}
        <div className="group">
          <label className="block text-[10px] uppercase font-bold text-slate-400 dark:text-slate-600 tracking-widest mb-2 transition-colors group-hover:text-purple-500">
            Glucose Magnitude <span className="opacity-50">(mg/dL)</span>
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
              placeholder="e.g. 110.0"
              className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all shadow-inner"
            />
            {glucose && !isNaN(parseFloat(glucose)) && (
              <span
                className={`absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full ${preview.bg} ${preview.text} shadow-sm`}
              >
                {preview.label}
              </span>
            )}
          </div>
          {error && <p className="text-red-500 text-[10px] uppercase font-black tracking-widest mt-2">{error}</p>}
        </div>

        {/* Date & Type Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="group">
            <label className="block text-[10px] uppercase font-bold text-slate-400 dark:text-slate-600 tracking-widest mb-2 transition-colors group-hover:text-purple-500">Event Timestamp</label>
            <input
              type="datetime-local"
              value={datetime}
              onChange={e => setDatetime(e.target.value)}
              className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all shadow-inner"
            />
          </div>
          <div className="group">
            <label className="block text-[10px] uppercase font-bold text-slate-400 dark:text-slate-600 tracking-widest mb-2 transition-colors group-hover:text-purple-500">Measurement Context</label>
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all shadow-inner"
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
        <div className="group">
          <label className="block text-[10px] uppercase font-bold text-slate-400 dark:text-slate-600 tracking-widest mb-2 transition-colors group-hover:text-purple-500">Observation Notes</label>
          <input
            type="text"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Log specific physiological context..."
            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all shadow-inner"
            maxLength={120}
          />
        </div>

        {/* Submit */}
        <button 
          type="submit" 
          className={`w-full font-black uppercase text-[10px] tracking-[0.3em] py-4 px-6 rounded-xl transition-all duration-500 flex items-center justify-center gap-3 shadow-xl active:scale-95 ${saved ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white dark:bg-purple-500 dark:text-slate-950 dark:hover:bg-purple-400'}`} 
          id="save-reading-btn"
        >
          {saved ? (
             <>
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              Sync Successful
            </>
          ) : (
            <>
              <Database size={14} />
              Log NIR Reading
            </>
          )}
        </button>
      </form>
    </div>
  )
}
