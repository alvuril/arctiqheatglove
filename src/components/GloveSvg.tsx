import React from 'react';

interface GloveSvgProps {
  className?: string;
  showDetails?: boolean;
}

export const GloveSvg: React.FC<GloveSvgProps> = ({
  className = 'w-64 h-auto',
  showDetails = true,
}) => {
  return (
    <svg
      className={`${className} select-none drop-shadow-2xl`}
      viewBox="0 0 260 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Arctiq HeatGlove Frontal Outline"
    >
      <defs>
        {/* Subtle technical gradients */}
        <linearGradient id="gloveBodyGrad" x1="130" y1="20" x2="130" y2="360" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1c202a" />
          <stop offset="50%" stopColor="#141720" />
          <stop offset="100%" stopColor="#0e1017" />
        </linearGradient>

        <linearGradient id="strapGrad" x1="60" y1="240" x2="200" y2="240" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#252b38" />
          <stop offset="50%" stopColor="#303848" />
          <stop offset="100%" stopColor="#252b38" />
        </linearGradient>
      </defs>

      {/* --- GLOVE MAIN SHELL OUTLINE (Frontal, Straight-on View with Tight Cinched Wrist) --- */}
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
        fill="url(#gloveBodyGrad)"
        stroke="#4a5568"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* --- FINGER SEAMS & BAFFLE LINES (Matching the real glove's padded paneling) --- */}
      {/* Index Finger Seams */}
      <path d="M 86 65 L 86 145" stroke="#333d4e" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 101 65 L 101 145" stroke="#333d4e" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 85 95 Q 94 92 103 95" stroke="#2d3544" strokeWidth="1.2" fill="none" />
      
      {/* Middle Finger Seams */}
      <path d="M 117 48 L 117 148" stroke="#333d4e" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 133 48 L 133 148" stroke="#333d4e" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 116 85 Q 125 82 134 85" stroke="#2d3544" strokeWidth="1.2" fill="none" />

      {/* Ring Finger Seams */}
      <path d="M 148 58 L 148 148" stroke="#333d4e" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 163 58 L 163 148" stroke="#333d4e" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 148 92 Q 156 89 164 92" stroke="#2d3544" strokeWidth="1.2" fill="none" />

      {/* Pinky Finger Seams */}
      <path d="M 179 92 L 179 155" stroke="#333d4e" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 191 92 L 191 155" stroke="#333d4e" strokeWidth="1.5" strokeLinecap="round" />

      {/* Thumb Anatomical Seam */}
      <path d="M 52 130 C 58 145, 64 165, 68 185" stroke="#333d4e" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 44 145 C 50 152, 58 158, 68 162" stroke="#2d3544" strokeWidth="1.2" />

      {/* Fourchette valleys between fingers */}
      <path d="M 107 140 L 109 160" stroke="#4a5568" strokeWidth="2" strokeLinecap="round" />
      <path d="M 140 140 L 141 160" stroke="#4a5568" strokeWidth="2" strokeLinecap="round" />
      <path d="M 169 145 L 171 165" stroke="#4a5568" strokeWidth="2" strokeLinecap="round" />

      {/* --- BACK OF HAND PANEL SEAM --- */}
      <path
        d="M 68 175 C 90 178, 160 178, 194 175"
        stroke="#3c4659"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* --- ARCTIQ MOUNTAIN CREST + LOGO (Exactly as on glove) --- */}
      {showDetails && (
        <g transform="translate(130, 204)" textAnchor="middle">
          {/* Mountain Peak Icon */}
          <path
            d="M -18 -8 L -9 -20 L -3 -12 L 5 -24 L 18 -8"
            stroke="#94a3b8"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* Brand Wordmark */}
          <text
            x="0"
            y="9"
            fill="#e2e8f0"
            fontSize="12.5"
            fontWeight="800"
            letterSpacing="3.5"
            fontFamily="'Space Grotesk', 'Inter', sans-serif"
          >
            ARCTIQ
          </text>
        </g>
      )}

      {/* --- FABRIC TENSION GATHERS / RUCHING RADIATING INTO TIGHT STRAP --- */}
      <g stroke="#2c3647" strokeWidth="1.3" strokeLinecap="round" fill="none">
        {/* Above-strap compression pleats */}
        <path d="M 70 228 Q 88 238 98 245" />
        <path d="M 185 228 Q 166 238 154 245" />
        <path d="M 128 233 L 128 245" />
        <path d="M 80 238 C 100 242, 155 242, 174 238" stroke="#384357" strokeWidth="1.2" />

        {/* Below-strap compression pleats */}
        <path d="M 72 278 Q 88 270 98 265" />
        <path d="M 183 278 Q 166 270 154 265" />
        <path d="M 128 275 L 128 265" />
        <path d="M 78 268 C 100 265, 155 265, 177 268" stroke="#384357" strokeWidth="1.2" />
      </g>

      {/* --- TIGHT HORIZONTAL CINCH WRIST STRAP --- */}
      <g>
        {/* Webbing strap tightly pulled across the constricted wrist */}
        <rect
          x="68"
          y="245"
          width="120"
          height="20"
          rx="2.5"
          fill="url(#strapGrad)"
          stroke="#4b5563"
          strokeWidth="1.8"
        />

        {/* Webbing weave texture subtle lines */}
        <line x1="70" y1="249" x2="186" y2="249" stroke="#374151" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="70" y1="261" x2="186" y2="261" stroke="#374151" strokeWidth="1" strokeDasharray="3 3" />

        {/* Heavy-duty cinch buckle clamped tight on the strap */}
        <rect
          x="86"
          y="238"
          width="18"
          height="34"
          rx="3"
          fill="#111317"
          stroke="#94a3b8"
          strokeWidth="2"
        />
        {/* Buckle center bar */}
        <line x1="95" y1="240" x2="95" y2="270" stroke="#64748b" strokeWidth="2.5" />
        
        {/* Pulled tight strap tail extending securely through buckle */}
        <path d="M 86 255 L 64 255" stroke="#252b38" strokeWidth="16" strokeLinecap="round" />
        <path d="M 86 255 L 64 255" stroke="#4b5563" strokeWidth="1.8" />
        <line x1="64" y1="248" x2="64" y2="262" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* --- LOWER GAUNTLET CUFF & BATTERY / CONTROLLER FLAP --- */}
      {/* Battery / Module flap on right side of lower cuff */}
      <rect
        x="176"
        y="288"
        width="14"
        height="32"
        rx="3"
        fill="#11141c"
        stroke="#475569"
        strokeWidth="1.5"
      />
      {/* Small subtle thermal LED / power indicator dot on flap */}
      <circle cx="183" cy="298" r="2.5" fill="#f97316" className="animate-pulse" />

      {/* Bottom Cuff Hem Binding */}
      <path
        d="M 68 358 C 100 365, 160 365, 192 358"
        stroke="#4b5563"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M 68 364 C 100 371, 160 371, 192 364"
        stroke="#2d3545"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};
