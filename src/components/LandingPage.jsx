import React from 'react'
import { Show } from '@clerk/react'
import { ArrowRight, Activity, Shield, Zap, Microscope, LayoutDashboard, Share2, Eye, Server, Cpu, Database, Cloud, Search, Workflow, ChevronRight, Sun, Moon } from 'lucide-react'
import heroMockup from '../assets/hero-mockup.png'

export default function LandingPage({ onLaunch, onOpenSignUp, theme, onToggleTheme }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-900 text-slate-900 dark:text-white selection:bg-purple-500/30 overflow-x-hidden bg-mesh transition-colors duration-500">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between glass-card px-8 py-4 border-slate-200 dark:border-white/5 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-brand-primary rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Activity className="text-black" size={20} />
            </div>
            <span className="font-black tracking-tighter text-2xl">Gluco<span className="text-purple-500 dark:text-purple-400">Sense</span></span>
          </div>

          <div className="hidden lg:flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 dark:text-white/50">
            <a href="#blueprint" className="hover:text-purple-500 dark:hover:text-purple-400 transition-colors">Blueprint</a>
            <a href="#journey" className="hover:text-purple-500 dark:hover:text-purple-400 transition-colors">The Journey</a>
            <a href="#security" className="hover:text-purple-500 dark:hover:text-purple-400 transition-colors">Convex Cloud</a>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onToggleTheme}
              className="p-2.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/70 hover:scale-105 active:scale-95 transition-all"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Show when="signed-out">
              <div className="flex items-center gap-3">
                <button
                  onClick={onOpenSignUp}
                  className="px-5 py-3 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-300 dark:border-white/10 text-slate-700 dark:text-white hover:border-purple-500 hover:text-purple-500 transition-all"
                >
                  Create Account
                </button>
                <button
                  onClick={onLaunch}
                  className="px-6 py-3 bg-slate-900 text-white dark:bg-white dark:text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-purple-500 transition-all active:scale-95 shadow-xl shadow-black/5 dark:shadow-white/5"
                >
                  Open Bio-Portal
                </button>
              </div>
            </Show>
            <Show when="signed-in">
              <button
                onClick={onLaunch}
                className="px-6 py-3 bg-slate-900 text-white dark:bg-white dark:text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-purple-500 transition-all active:scale-95 shadow-xl shadow-black/5 dark:shadow-white/5"
              >
                Open Bio-Portal
              </button>
            </Show>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="flex flex-col gap-10 animate-slide-up">
            <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-purple-500/5 border border-purple-500/10 w-fit text-[10px] font-black uppercase tracking-[0.3em] text-purple-600 dark:text-purple-400">
              <Eye size={14} /> Non-Invasive Glucose Tracker
            </div>

            <h1 className="text-7xl md:text-[5.5rem] text-optic text-gradient-bio">
              Your Glucose. <br />
              <span className="text-slate-900 dark:text-white">Revealed by</span> <br />
              <span className="opacity-20 dark:opacity-30">NIR Light.</span>
            </h1>

            <p className="text-xl text-slate-500 dark:text-white/50 max-w-lg leading-[1.6] font-medium border-l-2 border-purple-500/20 pl-8">
              Near-Infrared light penetrates the skin to measure glucose absorption non-invasively. Real-time logging powered by
              <span className="text-slate-900 dark:text-white font-bold italic ml-1">ESP32 & Convex.</span>
            </p>

            <div className="flex flex-wrap gap-5 pt-6">
              <Show when="signed-out">
                <button onClick={onLaunch} className="btn-premium">
                  Open Dashboard <ArrowRight size={20} />
                </button>
              </Show>
              <Show when="signed-in">
                <button onClick={onLaunch} className="btn-premium">
                  Open Dashboard <ArrowRight size={20} />
                </button>
              </Show>
              <div className="flex items-center gap-3 px-6 py-4 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/40 shadow-sm">
                <LayoutDashboard size={14} className="text-purple-500 dark:text-purple-400" /> Convex Cloud Synced
              </div>
            </div>
          </div>

          <div className="relative animate-fade-in delay-300">
            <div className="absolute -inset-10 bg-purple-500/10 blur-[120px] rounded-full opacity-50" />
            <div className="relative glass-card border-slate-200 dark:border-white/5 p-3 hover:scale-[1.01] transition-all duration-1000 bio-glow">
              <img
                src={heroMockup}
                alt="GlucoSense Core"
                className="rounded-[1.5rem] shadow-2xl brightness-95 dark:brightness-90 hover:brightness-100 transition-all duration-1000"
              />
              <div className="absolute -bottom-6 -left-6 glass-card p-6 border-purple-500/20 shadow-purple-500/10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 dark:text-purple-400">
                    <Zap size={24} />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-black text-slate-400 dark:text-white/40 tracking-widest mb-1">Response Time</div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white italic">Sub-60ms</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The System Blueprint - Architecture Section */}
      <section id="blueprint" className="py-40 px-8 relative bg-slate-100/50 dark:bg-white/[0.02]">
        <div className="max-w-7xl mx-auto flex flex-col gap-24">
          <div className="flex flex-col gap-6 text-center max-w-2xl mx-auto">
            <div className="text-[10px] uppercase font-black tracking-[0.4em] text-purple-600 dark:text-purple-400">Under the Hood</div>
            <h2 className="text-5xl font-black italic tracking-tighter text-slate-900 dark:text-white">NIR Core Architecture.</h2>
            <p className="text-slate-500 dark:text-white/40 text-lg font-medium">From light penetration to secure cloud insights.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {[
              {
                title: "NIR Optical Sensor",
                role: "The Hardware",
                icon: <Cpu size={32} />,
                items: ["Near-Infrared LEDs", "Skin Penetration", "Photon Detection"],
                desc: "Capturing glucose shifts at the molecular level using light."
              },
              {
                title: "ESP32 + Convex",
                role: "The Link & Cloud",
                icon: <Cloud size={32} />,
                items: ["ESP32 WiFi Uplink", "Sub-second Sync", "Convex DB"],
                desc: "Transmitting sensor data directly to a resilient, real-time backend."
              },
              {
                title: "NIR Analytics",
                role: "The Interface",
                icon: <LayoutDashboard size={32} />,
                items: ["Dynamic Glucose Charts", "Clinical Alerts", "Cross-device logs"],
                desc: "Turning invisible light pulses into actionable mg/dL trends."
              }
            ].map((node, i) => (
              <div key={i} className="glass-card p-10 flex flex-col gap-8 group hover:scale-[1.02] transition-transform">
                <div className="flex items-center justify-between">
                  <div className="w-16 h-16 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-purple-500 dark:text-purple-400 group-hover:bg-purple-500 group-hover:text-white dark:group-hover:text-black transition-all">
                    {node.icon}
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/20">{node.role}</div>
                </div>
                <div>
                  <h3 className="text-2xl font-black mb-4 tracking-tight italic uppercase dark:text-white">{node.title}</h3>
                  <p className="text-slate-500 dark:text-white/40 text-sm leading-relaxed mb-6">{node.desc}</p>
                  <ul className="flex flex-col gap-3">
                    {node.items.map((item, j) => (
                      <li key={j} className="flex items-center gap-3 text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-white/40">
                        <ChevronRight size={14} className="text-purple-500 dark:text-purple-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Biometric Journey - Data Flow Section */}
      <section id="journey" className="py-40 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center gap-6 mb-24">
            <h2 className="text-5xl font-black italic tracking-tighter text-slate-900 dark:text-white">The NIR Process.</h2>
            <p className="text-slate-500 dark:text-white/40 text-lg font-medium max-w-xl">Tracing the path from localized light emission to cloud-synced intelligence.</p>
          </div>

          <div className="flex flex-col gap-10 md:gap-0 relative">
            <div className="absolute top-1/2 left-0 w-full h-px border-t border-dashed border-slate-200 dark:border-white/10 hidden md:block" />

            <div className="grid grid-cols-1 md:grid-cols-5 gap-10 relative z-10">
              {[
                { title: "Emission", desc: "NIR Light active", icon: <Sun size={24} /> },
                { title: "Penetrate", desc: "Through skin layer", icon: <Search size={24} /> },
                { title: "Capture", desc: "Photon Pulse", icon: <Shield size={24} /> },
                { title: "Uplink", desc: "ESP32 + Convex", icon: <Workflow size={24} /> },
                { title: "Insight", desc: "mg/dL Display", icon: <Activity size={24} /> }
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center gap-6 group">
                  <div className="w-20 h-20 rounded-full bg-white dark:bg-dark-800 border border-slate-200 dark:border-white/10 flex items-center justify-center text-purple-500 dark:text-purple-400 group-hover:scale-110 group-hover:bg-purple-500 group-hover:text-white dark:group-hover:text-black transition-all shadow-xl">
                    {step.icon}
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-black uppercase tracking-[0.2em] mb-1 italic dark:text-white">{step.title}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/30">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bio-Vault Section */}
      <section id="security" className="py-40 px-8 border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            <div className="lg:col-span-3 glass-card p-16 flex flex-col justify-end min-h-[500px] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-12 text-slate-200 dark:text-white/5 group-hover:text-purple-500/10 transition-colors duration-1000 rotate-12">
                <LayoutDashboard size={400} />
              </div>
              <div className="relative z-10">
                <h3 className="text-5xl font-black mb-6 tracking-tighter italic text-slate-900 dark:text-white">Human <br /> Console.</h3>
                <p className="text-slate-500 dark:text-white/40 max-w-md mb-10 text-xl font-medium">
                  Your biometric history, visualized with cinematic clarity. Access every trend, every peak, every insight.
                </p>
                <Show when="signed-out">
                  <button onClick={onLaunch} className="w-fit flex items-center gap-3 text-purple-600 dark:text-purple-400 font-black uppercase tracking-[0.2em] text-xs hover:gap-6 transition-all">
                    Enter Portal <ArrowRight size={20} />
                  </button>
                </Show>
                <Show when="signed-in">
                  <button
                    onClick={onLaunch}
                    className="w-fit flex items-center gap-3 text-purple-600 dark:text-purple-400 font-black uppercase tracking-[0.2em] text-xs hover:gap-6 transition-all"
                  >
                    Enter Portal <ArrowRight size={20} />
                  </button>
                </Show>
              </div>
            </div>

            <div className="lg:col-span-2 glass-card p-16 flex flex-col justify-center bg-gradient-to-br from-purple-500/10 to-transparent bio-glow group">
              <Shield size={64} className="mb-10 text-purple-500 dark:text-purple-400 group-hover:scale-110 transition-transform" />
              <h3 className="text-4xl font-black mb-6 tracking-tighter italic whitespace-pre-line text-gradient-bio">{"Convex Cloud \nData Logs."}</h3>
              <p className="text-slate-500 dark:text-white/40 leading-relaxed text-lg font-medium">
                Your historical data logs are securely anchored in the Convex decentralized cloudâ€”ensuring sub-second sync and accessibility across all your devices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-32 px-8 border-t border-slate-200 dark:border-white/5 text-center mt-20">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-10">
          <div className="flex items-center gap-3 opacity-30">
            <Activity className="text-purple-500 dark:text-purple-400" size={24} />
            <span className="font-black tracking-tighter text-2xl uppercase text-slate-900 dark:text-white">GlucoSense</span>
          </div>
          <p className="text-slate-400 dark:text-white/10 text-[10px] uppercase font-black tracking-[0.6em] max-w-sm leading-loose">
            Optic Core Intelligence Â· Bio-Portal v1.2 <br />
            Â© 2026 GlucoSense Systems
          </p>
        </div>
      </footer>
    </div>
  )
}
