import React, { useState } from 'react';
import { Flame, Battery, Clock, Zap, Shield, Sparkles } from 'lucide-react';

interface ThermalVisualizerProps {
  maxTemp?: number;
}

export const ThermalVisualizer: React.FC<ThermalVisualizerProps> = ({ maxTemp = 45 }) => {
  const [temperature, setTemperature] = useState<number>(() => Math.min(35, maxTemp));

  // Automatically clamp temperature when switching between Adult (45°C) and Kids (40°C)
  React.useEffect(() => {
    if (temperature > maxTemp) {
      setTemperature(maxTemp);
    }
  }, [maxTemp, temperature]);

  // Calculate battery runtime based on temperature (up to 10 hours at lowest, down to 4h at maxTemp)
  const getBatteryRuntime = (temp: number) => {
    const minTemp = 20;
    const clamped = Math.min(temp, maxTemp);
    const ratio = (clamped - minTemp) / (maxTemp - minTemp);
    const hours = 10.0 - ratio * 6.0;
    return Math.max(4.0, Math.min(10.0, hours)).toFixed(1);
  };

  // Get heating mode descriptor
  const getModeLabel = (temp: number) => {
    if (temp <= 28) return { name: 'Eco Conservation Mode', color: 'text-sky-400', badge: 'bg-sky-500/10 border-sky-500/20 text-sky-300' };
    if (temp < maxTemp) return { name: 'Balanced Nordic Comfort', color: 'text-amber-400', badge: 'bg-amber-500/10 border-amber-500/20 text-amber-300' };
    return { name: `Peak Thermal Output (${maxTemp}°C Max)`, color: 'text-orange-500', badge: 'bg-orange-500/15 border-orange-500/30 text-orange-400' };
  };

  // Dynamic filament stroke color and glow effect
  const getFilamentColor = (temp: number) => {
    if (temp <= 28) return '#38bdf8'; // Ice blue / soft cyan
    if (temp <= 38) return '#f59e0b'; // Warm amber gold
    return '#ff4d00'; // High-heat incandescent ember
  };

  const getFilamentGlowFilter = (temp: number) => {
    const intensity = Math.max(0.4, (temp - 20) / 25);
    const color = getFilamentColor(temp);
    return `drop-shadow(0 0 ${4 + intensity * 10}px ${color})`;
  };

  const runtimeHours = getBatteryRuntime(temperature);
  const modeInfo = getModeLabel(temperature);
  const filamentColor = getFilamentColor(temperature);
  const watts = (((temperature - 15) / 30) * 3.5 + 1.2).toFixed(1);

  return (
    <section className="mt-16 pt-12 border-t border-white/10 space-y-8">
      
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-slate-300">
          <Flame className="w-3.5 h-3.5 text-orange-400" />
          <span>Interactive Thermal Matrix</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Space_Grotesk']">
          Inspect The Active Heating Elements
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          Adjust the thermal slider to visualize micro-carbon filament heat emission and observe real-time battery endurance up to {maxTemp}°C.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#12151c] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden relative">
        
        {/* Left: Outline Graphic with Dynamic Visible Heating Elements */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-4 relative min-h-[420px]">
          
          {/* Ambient heat glow behind glove */}
          <div
            className="absolute inset-8 rounded-full blur-[60px] pointer-events-none transition-all duration-500 opacity-40"
            style={{
              backgroundColor: filamentColor,
            }}
          />

          {/* Glove Outline SVG with Visible Carbon Heating Paths */}
          <svg
            className="w-64 sm:w-72 h-auto select-none relative z-10 transition-all duration-300"
            viewBox="0 0 260 380"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label="Arctiq HeatGlove Internal Heating Elements"
          >
            <defs>
              <linearGradient id="gloveDarkShell" x1="130" y1="20" x2="130" y2="360" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#151922" />
                <stop offset="50%" stopColor="#10131a" />
                <stop offset="100%" stopColor="#0a0c10" />
              </linearGradient>
            </defs>

            {/* --- GLOVE OUTER PROFILE (Straight-on frontal view) --- */}
            <path
              d="
                M 72 360
                L 65 295
                C 63 275, 68 266, 72 256
                C 74 246, 71 238, 66 226
                C 60 212, 54 185, 42 165
                C 36 150, 38 135, 44 125
                C 50 115, 62 118, 68 132
                L 78 160
                C 78 150, 79 125, 80 85
                C 80 62, 85 52, 94 52
                C 103 52, 107 62, 107 88
                L 108 128
                L 110 65
                C 110 40, 115 30, 125 30
                C 135 30, 140 40, 140 68
                L 140 128
                L 142 75
                C 142 50, 147 42, 156 42
                C 165 42, 169 50, 169 76
                L 169 135
                L 172 105
                C 173 85, 178 78, 186 78
                C 194 78, 198 86, 198 108
                C 198 140, 196 175, 195 210
                C 193 226, 187 236, 184 246
                C 181 256, 186 274, 194 295
                L 188 360
                Z
              "
              fill="url(#gloveDarkShell)"
              stroke="#2c3444"
              strokeWidth="2.5"
            />

            {/* Subtle finger divider valleys */}
            <path d="M 107 135 L 109 155" stroke="#1f2533" strokeWidth="2" strokeLinecap="round" />
            <path d="M 140 135 L 141 155" stroke="#1f2533" strokeWidth="2" strokeLinecap="round" />
            <path d="M 169 140 L 171 160" stroke="#1f2533" strokeWidth="2" strokeLinecap="round" />

            {/* Wrist strap silhouette */}
            <rect x="68" y="245" width="120" height="20" rx="2.5" fill="#151922" stroke="#2c3444" strokeWidth="1.5" />
            <rect x="86" y="238" width="18" height="34" rx="2" fill="#0c0e14" stroke="#4b5563" strokeWidth="1.5" />

            {/* Cuff hem binding */}
            <path d="M 68 358 C 100 365, 160 365, 192 358" stroke="#252c3a" strokeWidth="3" />

            {/* --- VISIBLE MICRO-CARBON HEATING FILAMENT NETWORK (Dynamic Glow) --- */}
            <g
              stroke={filamentColor}
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                filter: getFilamentGlowFilter(temperature),
                transition: 'stroke 0.4s ease, filter 0.4s ease',
              }}
            >
              {/* Thumb Loop */}
              <path d="M 80 185 Q 55 165 48 135 Q 52 124 62 135 Q 68 150 78 175" />

              {/* Index Finger Loop (Over fingertip & down to capillary bed) */}
              <path d="M 88 180 L 88 78 Q 94 65 99 78 L 99 180" />

              {/* Middle Finger Loop (Longest) */}
              <path d="M 118 180 L 118 55 Q 125 42 131 55 L 131 180" />

              {/* Ring Finger Loop */}
              <path d="M 148 180 L 148 68 Q 155 54 161 68 L 161 180" />

              {/* Pinky Finger Loop */}
              <path d="M 178 185 L 178 100 Q 186 90 190 100 L 190 185" />

              {/* Back-of-Hand Central Thermal Distribution Mesh */}
              <path d="M 85 185 C 100 205, 160 205, 185 185" />
              <path d="M 90 205 C 110 220, 150 220, 170 205" />
              
              {/* Central Power Lead down through wrist to battery bus */}
              <line x1="130" y1="218" x2="130" y2="285" strokeWidth="2.5" />
              <circle cx="130" cy="285" r="4" fill={filamentColor} />
            </g>

            {/* Arctiq Crest & Logo in subtle outline */}
            <g transform="translate(130, 210)" textAnchor="middle" opacity="0.4">
              <path d="M -15 -6 L -8 -16 L -2 -10 L 4 -20 L 15 -6" stroke="#94a3b8" strokeWidth="1.8" fill="none" />
              <text x="0" y="8" fill="#94a3b8" fontSize="10" fontWeight="700" letterSpacing="3">ARCTIQ</text>
            </g>
          </svg>

          {/* Active Status Badge */}
          <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-white/10 text-[11px] font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: filamentColor }} />
            <span>ELEMENTS ACTIVE &bull; {temperature}°C</span>
          </div>

        </div>

        {/* Right: Interactive Controls & Real-Time Telemetry */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Temperature Status Header */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${modeInfo.badge}`}>
                {modeInfo.name}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                MAX LIMIT: {maxTemp}°C
              </span>
            </div>
            
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-4xl sm:text-5xl font-extrabold text-white font-['Space_Grotesk'] tabular-nums">
                {temperature}°C
              </span>
              <span className="text-lg text-slate-400 font-medium">
                / {((temperature * 9) / 5 + 32).toFixed(0)}°F
              </span>
            </div>
          </div>

          {/* Interactive Temperature Slider */}
          <div className="space-y-3 p-4 rounded-2xl bg-black/40 border border-white/10">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                Target Thermal Setting
              </span>
              <span className="font-mono text-white font-bold">{temperature}°C</span>
            </div>

            <input
              type="range"
              min="20"
              max={maxTemp}
              step="1"
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="w-full accent-orange-500 h-2.5 bg-neutral-800 rounded-lg cursor-pointer"
            />

            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>20°C (Ambient)</span>
              <span>25°C (Eco)</span>
              <span>{maxTemp === 40 ? '32°C' : '35°C'} (Standard)</span>
              <span className="text-orange-400 font-semibold">{maxTemp}°C (Max Limit)</span>
            </div>

            {/* Quick Presets */}
            <div className="pt-2 flex gap-2">
              {[
                { temp: 25, label: '25°C Eco' },
                { temp: maxTemp === 40 ? 32 : 35, label: `${maxTemp === 40 ? 32 : 35}°C Balanced` },
                { temp: maxTemp, label: `${maxTemp}°C Max` },
              ].map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setTemperature(p.temp)}
                  className={`flex-1 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                    temperature === p.temp
                      ? 'border-white bg-white text-black font-semibold shadow-sm'
                      : 'border-white/10 bg-white/5 text-slate-300 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Telemetry Cards Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            
            {/* Battery Life Card */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                <span className="font-semibold uppercase text-[10px]">Estimated Runtime</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-white font-['Space_Grotesk'] tabular-nums">
                  {runtimeHours}
                </span>
                <span className="text-xs text-slate-400">Hours</span>
              </div>
              <span className="text-[10px] text-slate-400 block">
                Up to 10h at low thermal draw
              </span>
            </div>

            {/* Power Draw Card */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-semibold uppercase text-[10px]">Power Draw</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-white font-['Space_Grotesk'] tabular-nums">
                  {watts}
                </span>
                <span className="text-xs text-slate-400">Watts / Pair</span>
              </div>
              <span className="text-[10px] text-slate-400 block">
                Micro-carbon current
              </span>
            </div>

            {/* Warm-Up Speed */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold uppercase text-[10px]">Ramp-Up Speed</span>
              </div>
              <span className="text-base font-bold text-white block mt-0.5">
                3.2 Seconds
              </span>
              <span className="text-[10px] text-slate-400 block">
                Immediate capillary warmth
              </span>
            </div>

            {/* Heating Coverage */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400">
                <Shield className="w-3.5 h-3.5 text-purple-400" />
                <span className="font-semibold uppercase text-[10px]">Zone Coverage</span>
              </div>
              <span className="text-base font-bold text-white block mt-0.5">
                5 Fingers &amp; Palm
              </span>
              <span className="text-[10px] text-slate-400 block">
                All fingertips + thumb
              </span>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
};
