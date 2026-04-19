import React from 'react'
import { Show } from '@clerk/react'
import {
  ArrowRight, Activity, Shield, Zap, Eye, LayoutDashboard,
  Cpu, Cloud, Sun, Moon, ChevronRight, CheckCircle,
  Wifi, Database, BookOpen, Code2, Layers, FlaskConical,
  Lightbulb, GitBranch, MonitorSmartphone
} from 'lucide-react'
import heroMockup from '../assets/hero-mockup.png'

// ─── Shared section label ─────────────────────────────────────────────────
function SectionLabel({ text }) {
  return (
    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20
                     text-[10px] font-black uppercase tracking-[0.3em] text-purple-600 dark:text-purple-400">
      {text}
    </span>
  )
}

export default function LandingPage({ onLaunch, onOpenSignUp, theme, onToggleTheme }) {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0d0d14] text-slate-900 dark:text-white overflow-x-hidden transition-colors duration-500">

      {/* ▰▰▰ NAV ▰▰▰ */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between
                        bg-white/80 dark:bg-[#13131f]/80 backdrop-blur-xl
                        border border-slate-200 dark:border-white/8 rounded-2xl px-6 py-3 shadow-xl shadow-black/5">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Activity className="text-white" size={18} />
            </div>
            <span className="font-black tracking-tight text-xl text-slate-900 dark:text-white">
              Gluco<span className="text-purple-500">Sense</span>
            </span>
          </div>

          {/* Links */}
          <div className="hidden lg:flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest text-slate-500 dark:text-white/40">
            <a href="#blueprint" className="hover:text-purple-500 dark:hover:text-purple-400 transition-colors">Blueprint</a>
            <a href="#journey"   className="hover:text-purple-500 dark:hover:text-purple-400 transition-colors">Journey</a>
            <a href="#knowledge" className="hover:text-purple-500 dark:hover:text-purple-400 transition-colors">Knowledge</a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button onClick={onToggleTheme}
              className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/60 hover:scale-105 transition-all">
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <Show when="signed-out">
              <button onClick={onOpenSignUp}
                className="hidden sm:block px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-widest border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white/70 hover:border-purple-500 hover:text-purple-500 transition-all">
                Sign Up
              </button>
              <button onClick={onLaunch}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-purple-500/30">
                Open Dashboard
              </button>
            </Show>
            <Show when="signed-in">
              <button onClick={onLaunch}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-[11px] font-bold uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-purple-500/30">
                Open Dashboard
              </button>
            </Show>
          </div>
        </div>
      </nav>

      {/* ▰▰▰ HERO ▰▰▰ */}
      <section className="relative pt-40 pb-28 px-6">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-500/8 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          {/* Left column */}
          <div className="flex flex-col gap-8">
            <SectionLabel text="Non-Invasive Glucose Tracker" />

            <h1 className="text-[3.5rem] md:text-[4.5rem] font-black leading-[1.05] tracking-tight text-slate-900 dark:text-white">
              Your Glucose,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-violet-500">Revealed</span><br />
              by NIR Light.
            </h1>

            <p className="text-lg text-slate-500 dark:text-white/50 max-w-lg leading-relaxed font-medium">
              Near-Infrared light penetrates the skin to detect glucose absorption — no needle, no pain.
              Real-time readings sync via <strong className="text-slate-900 dark:text-white font-bold">Controller &amp; Convex Cloud</strong>.
            </p>

            {/* CTA Row */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Show when="signed-out">
                <button onClick={onLaunch}
                  className="flex items-center gap-2 px-7 py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl shadow-purple-500/30">
                  Open Dashboard <ArrowRight size={18} />
                </button>
              </Show>
              <Show when="signed-in">
                <button onClick={onLaunch}
                  className="flex items-center gap-2 px-7 py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl shadow-purple-500/30">
                  Open Dashboard <ArrowRight size={18} />
                </button>
              </Show>
              <div className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/40">
                <Wifi size={14} className="text-purple-500" /> Live Cloud Sync
              </div>
            </div>

            {/* Stats row */}
            <div className="flex gap-8 pt-4 border-t border-slate-100 dark:border-white/5">
              {[
                { value: '<60ms', label: 'Response Time' },
                { value: '100%', label: 'Non-Invasive' },
                { value: 'Live', label: 'Real-Time Sync' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div className="text-2xl font-black text-purple-500">{value}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/30 mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column — hero image */}
          <div className="relative">
            <div className="absolute -inset-8 bg-purple-500/10 blur-[80px] rounded-full opacity-60 pointer-events-none" />
            <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-2xl shadow-purple-500/10">
              <img src={heroMockup} alt="GlucoSense Dashboard" className="w-full rounded-3xl brightness-95 dark:brightness-80" />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-white dark:bg-[#1a1a2e] border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-3 shadow-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                <Zap size={20} />
              </div>
              <div>
                <div className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Response Time</div>
                <div className="text-lg font-black text-slate-900 dark:text-white">Sub-60ms</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ▰▰▰ BLUEPRINT — System Architecture ▰▰▰ */}
      <section id="blueprint" className="py-28 px-6 bg-slate-50 dark:bg-white/[0.02]">
        <div className="max-w-7xl mx-auto flex flex-col gap-16">
          <div className="flex flex-col items-center gap-4 text-center">
            <SectionLabel text="Under the Hood" />
            <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">System Blueprint</h2>
            <p className="text-slate-500 dark:text-white/40 text-base font-medium max-w-xl">
              How light, hardware, and cloud combine to measure blood glucose without a single needle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Cpu size={28} />,
                label: 'Hardware',
                title: 'NIR Optical Sensor',
                desc: 'Near-Infrared LEDs emit light through skin. A photodetector captures the reflected signal and maps it to glucose absorption.',
                items: ['950nm NIR LEDs', 'Skin Penetration Layer', 'Photon Detection Array'],
                color: 'purple',
              },
              {
                icon: <Cloud size={28} />,
                label: 'Connectivity',
                title: 'Controller + Convex',
                desc: 'The Controller transmits processed readings over WiFi to the Convex real-time database in under 60ms.',
                items: ['WiFi Webhook Uplink', 'Sub-second Sync', 'Convex Cloud DB'],
                color: 'violet',
              },
              {
                icon: <LayoutDashboard size={28} />,
                label: 'Interface',
                title: 'NIR Analytics Portal',
                desc: 'A beautiful React dashboard visualizes live and historical trends with color-coded clinical alerts.',
                items: ['Live Feed Charts', 'Clinical Alerts', 'Cross-device Access'],
                color: 'indigo',
              },
            ].map((card, i) => (
              <div key={i} className="group flex flex-col gap-6 rounded-2xl p-8 border border-slate-200 dark:border-white/8
                                       bg-white dark:bg-white/[0.03] hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-500/5
                                       transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-all">
                    {card.icon}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/20">{card.label}</span>
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white mb-2">{card.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-white/40 leading-relaxed mb-5">{card.desc}</p>
                  <ul className="flex flex-col gap-2.5">
                    {card.items.map((item, j) => (
                      <li key={j} className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/40">
                        <ChevronRight size={13} className="text-purple-500 shrink-0" />
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

      {/* ▰▰▰ JOURNEY — How I Built This ▰▰▰ */}
      <section id="journey" className="py-28 px-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-16">
          <div className="flex flex-col items-center gap-4 text-center">
            <SectionLabel text="My Journey" />
            <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">How I Built This</h2>
            <p className="text-slate-500 dark:text-white/40 text-base font-medium max-w-xl">
              From an idea to a working non-invasive glucose monitor — the development process, step by step.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                step: '01',
                icon: <Lightbulb size={22} />,
                title: 'The Idea',
                desc: 'Inspired by painless glucose testing. Researched NIR photon-tissue interaction and its correlation with blood glucose levels.',
              },
              {
                step: '02',
                icon: <FlaskConical size={22} />,
                title: 'Hardware Experiments',
                desc: 'Built the NIR sensor circuit with 950nm LED and photodiode. Calibrated readings against known glucose solutions for a baseline.',
              },
              {
                step: '03',
                icon: <Code2 size={22} />,
                title: 'Controller Firmware',
                desc: 'Wrote firmware to read ADC values, calculate glucose index from the NIR signal, and transmit readings via WiFi HTTP webhook.',
              },
              {
                step: '04',
                icon: <Database size={22} />,
                title: 'Cloud Backend',
                desc: 'Set up Convex as the real-time backend. Defined hardware log schema, created a webhook endpoint, and enabled instant sync.',
              },
              {
                step: '05',
                icon: <MonitorSmartphone size={22} />,
                title: 'Dashboard Design',
                desc: 'Built the React frontend with live charts, historical logs, and a color-coded clinical alert system using Tailwind and Recharts.',
              },
              {
                step: '06',
                icon: <GitBranch size={22} />,
                title: 'End-to-End Testing',
                desc: 'Tested the full pipeline — finger on sensor → controller → Convex → dashboard — validating sub-60ms latency and data accuracy.',
              },
            ].map((item, i) => (
              <div key={i}
                className="flex flex-col justify-between gap-5 rounded-2xl p-7
                           min-h-[210px]
                           border border-slate-200 dark:border-white/8
                           bg-white dark:bg-white/[0.03]
                           hover:border-violet-500/25 hover:shadow-lg hover:shadow-violet-500/5
                           transition-all duration-300 group">
                {/* Icon + step — always pinned to top */}
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center
                                  text-violet-500 group-hover:bg-violet-500 group-hover:text-white transition-all shrink-0">
                    {item.icon}
                  </div>
                  <span className="text-3xl font-black text-slate-100 dark:text-white/6
                                   group-hover:text-violet-100 dark:group-hover:text-violet-800/30 transition-colors select-none">
                    {item.step}
                  </span>
                </div>
                {/* Title + desc — always anchored to bottom of card */}
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white mb-1.5">{item.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-white/40 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ▰▰▰ KNOWLEDGE — What I Learned ▰▰▰ */}
      <section id="knowledge" className="py-28 px-6 bg-slate-50 dark:bg-white/[0.02]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <SectionLabel text="Knowledge Gained" />
              <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                What This Project<br />Taught Me
              </h2>
              <p className="text-slate-500 dark:text-white/40 text-base font-medium leading-relaxed">
                Building GlucoSense from scratch was a deep dive into multiple domains simultaneously — biology, electronics, cloud architecture, and UI design.
              </p>
            </div>

            <ul className="flex flex-col gap-4">
              {[
                { label: 'NIR Spectroscopy',        desc: 'How near-infrared light interacts with glucose molecules in tissue' },
                { label: 'Embedded C Firmware',     desc: 'Reading ADC sensor values and transmitting over WiFi HTTP' },
                { label: 'Real-Time Databases',     desc: 'Using Convex for reactive, schema-first cloud data sync'  },
                { label: 'React & Data Viz',         desc: 'Building live charts with Recharts and state management'   },
                { label: 'Hardware-Software Bridge', desc: 'Connecting physical sensor output to a web dashboard end-to-end' },
              ].map(({ label, desc }) => (
                <li key={label} className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-purple-500 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-black text-slate-900 dark:text-white">{label}</div>
                    <div className="text-[12px] text-slate-500 dark:text-white/40 mt-0.5">{desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — Stack cards */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: <Cpu size={24} />,              label: 'NIR Hardware',    sub: 'Controller Sensor'     },
              { icon: <Cloud size={24} />,            label: 'Convex Cloud',    sub: 'Real-Time Backend'     },
              { icon: <Code2 size={24} />,            label: 'React + Vite',    sub: 'Frontend Framework'    },
              { icon: <Layers size={24} />,           label: 'Recharts',        sub: 'Data Visualization'    },
              { icon: <Shield size={24} />,           label: 'Clerk Auth',      sub: 'Secure Login'          },
              { icon: <BookOpen size={24} />,         label: 'NIR Research',    sub: 'Glucose Spectroscopy'  },
            ].map(({ icon, label, sub }) => (
              <div key={label}
                className="flex flex-col gap-3 rounded-2xl p-5 border border-slate-200 dark:border-white/8
                           bg-white dark:bg-white/[0.03] hover:border-purple-500/30 hover:shadow-lg
                           hover:shadow-purple-500/5 transition-all duration-300 group">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-all">
                  {icon}
                </div>
                <div>
                  <div className="text-sm font-black text-slate-900 dark:text-white">{label}</div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/30 mt-0.5">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ▰▰▰ CTA BANNER ▰▰▰ */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 to-violet-700 p-12 text-center shadow-2xl shadow-purple-500/30">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, white, transparent 60%), radial-gradient(circle at 70% 20%, white, transparent 50%)' }} />
            <div className="relative z-10 flex flex-col items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                <Activity size={32} />
              </div>
              <h2 className="text-3xl font-black tracking-tight text-white">Ready to Monitor?</h2>
              <p className="text-purple-200 text-base max-w-md font-medium">
                Open the GlucoSense dashboard to see real-time sensor readings, historical trends, and clinical insights.
              </p>
              <Show when="signed-out">
                <button onClick={onLaunch}
                  className="flex items-center gap-2 px-8 py-3.5 bg-white text-purple-700 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-purple-50 transition-all hover:scale-105 active:scale-95 shadow-xl">
                  Launch Dashboard <ArrowRight size={18} />
                </button>
              </Show>
              <Show when="signed-in">
                <button onClick={onLaunch}
                  className="flex items-center gap-2 px-8 py-3.5 bg-white text-purple-700 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-purple-50 transition-all hover:scale-105 active:scale-95 shadow-xl">
                  Launch Dashboard <ArrowRight size={18} />
                </button>
              </Show>
            </div>
          </div>
        </div>
      </section>

      {/* ▰▰▰ FOOTER ▰▰▰ */}
      <footer className="py-12 px-6 border-t border-slate-100 dark:border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
              <Activity className="text-white" size={14} />
            </div>
            <span className="font-black tracking-tight text-base text-slate-900 dark:text-white">
              Gluco<span className="text-purple-500">Sense</span>
            </span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 dark:text-white/20 text-center">
            Bio-Portal v1.2 · NIR Optic Intelligence · © 2026 GlucoSense Systems
          </p>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-white/30">Live System</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
