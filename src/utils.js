// Utility to classify glucose levels
export function classifyGlucose(value) {
  const num = parseFloat(value)
  if (isNaN(num)) return { label: 'Unknown', color: 'gray', bg: 'bg-gray-700', text: 'text-gray-300' }
  if (num < 70)  return { label: 'Hypoglycemia', color: '#EF4444', bg: 'bg-red-900/60',    text: 'text-red-300' }
  if (num <= 99) return { label: 'Normal',       color: '#22C55E', bg: 'bg-green-900/60',  text: 'text-green-300' }
  if (num <= 125) return { label: 'Elevated',    color: '#F59E0B', bg: 'bg-amber-900/60',  text: 'text-amber-300' }
  return           { label: 'High',              color: '#F97316', bg: 'bg-orange-900/60', text: 'text-orange-300' }
}

// Generate a unique id (still used for optimistic UI if needed)
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}
