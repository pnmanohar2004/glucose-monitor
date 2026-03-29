import { Microscope, Zap, Wind, ShieldCheck, ExternalLink } from 'lucide-react'

export default function RamanSpectroscopyInfo() {
  return (
    <section className="flex flex-col gap-10 animate-fade-in bg-dark-800/20 rounded-3xl p-8 border border-dark-600/30">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 w-fit">
          <Microscope size={14} />
          <span className="text-[10px] font-bold tracking-widest uppercase">The Science Behind GlucoSense</span>
        </div>
        <h2 className="text-4xl font-bold text-white tracking-tight">Non-Invasive Monitoring with Raman Spectroscopy</h2>
        <p className="text-gray-400 max-w-3xl leading-relaxed">
          Traditional glucose monitors require skin pricks and blood samples. GlucoSense utilizes advanced Raman Spectroscopy to analyze your glucose levels through the skin—no needles required.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
            <Zap size={24} />
          </div>
          <h3 className="text-white font-bold text-lg">Laser Interaction</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            A low-power laser shines through the top layer of skin. When the light hits glucose molecules in the interstitial fluid, it scatters in a unique "fingerprint" pattern.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
            <Wind size={24} />
          </div>
          <h3 className="text-white font-bold text-lg">Molecular Analysis</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Our sensor captures this scattered light (Raman shift). By measuring the intensity and frequency of these shifts, we can calculate the exact concentration of glucose.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
            <ShieldCheck size={24} />
          </div>
          <h3 className="text-white font-bold text-lg">AI Calibration</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Machine learning models filter out interference from other skin components like proteins and lipids, ensuring medical-grade accuracy for every reading.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-2xl bg-dark-900 border border-dark-600/50">
        <div className="flex-1">
          <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
            Why Raman Spectroscopy?
          </h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-8">
            <li className="text-xs text-emerald-400 flex items-center gap-2">✓ Pain-free & Non-invasive</li>
            <li className="text-xs text-emerald-400 flex items-center gap-2">✓ Continuous Real-time Monitoring</li>
            <li className="text-xs text-emerald-400 flex items-center gap-2">✓ Cost-effective (Zero lancets needed)</li>
            <li className="text-xs text-emerald-400 flex items-center gap-2">✓ Environmentally Sustainable</li>
          </ul>
        </div>
        <a href="#" className="flex items-center gap-2 text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors uppercase tracking-widest bg-purple-500/5 px-4 py-3 rounded-xl border border-purple-500/20">
          Read Whitepaper <ExternalLink size={14} />
        </a>
      </div>
    </section>
  )
}
