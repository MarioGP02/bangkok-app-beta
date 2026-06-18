export default function BKGorilla({ className = 'w-20 h-20' }) {
  return (
    <svg viewBox="0 0 200 220" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* ── Fur — dark charcoal with subtle sheen ── */}
        <radialGradient id="bkg-fur" cx="38%" cy="30%" r="70%">
          <stop offset="0%"   stopColor="#2e2e2e"/>
          <stop offset="35%"  stopColor="#181818"/>
          <stop offset="100%" stopColor="#060606"/>
        </radialGradient>
        {/* ── Muzzle — warm tawny brown ── */}
        <radialGradient id="bkg-mz" cx="44%" cy="24%" r="72%">
          <stop offset="0%"   stopColor="#daa870"/>
          <stop offset="50%"  stopColor="#ae7a3e"/>
          <stop offset="100%" stopColor="#6c3a12"/>
        </radialGradient>
        {/* ── Cap ── */}
        <radialGradient id="bkg-cap" cx="30%" cy="16%" r="80%">
          <stop offset="0%"   stopColor="#ffb035"/>
          <stop offset="38%"  stopColor="#ff6c00"/>
          <stop offset="100%" stopColor="#b42e00"/>
        </radialGradient>
        {/* ── Lens — fire orange ── */}
        <radialGradient id="bkg-lens" cx="28%" cy="22%" r="76%">
          <stop offset="0%"   stopColor="#ffba4c"/>
          <stop offset="52%"  stopColor="#ff7200"/>
          <stop offset="100%" stopColor="#ba3600"/>
        </radialGradient>
        {/* ── Shoulder bulk ── */}
        <radialGradient id="bkg-sh" cx="50%" cy="0%" r="80%">
          <stop offset="0%"   stopColor="#202020"/>
          <stop offset="100%" stopColor="#070707"/>
        </radialGradient>
        {/* ── Ear ── */}
        <radialGradient id="bkg-ear" cx="36%" cy="34%" r="65%">
          <stop offset="0%"   stopColor="#1e1e1e"/>
          <stop offset="100%" stopColor="#090909"/>
        </radialGradient>
      </defs>

      {/* ══════════════════════════════════════════════
          SHOULDERS / NECK
      ══════════════════════════════════════════════ */}
      <path d="M0,220 Q0,194 28,180 Q55,167 78,162
               Q89,159 100,158 Q111,159 122,162
               Q145,167 172,180 Q200,194 200,220Z"
            fill="url(#bkg-sh)"/>
      {/* Neck */}
      <path d="M79,177 Q90,163 100,161 Q110,163 121,177
               L123,197 Q100,204 77,197Z"
            fill="#0f0f0f"/>
      {/* Collar-bone shadow crease */}
      <path d="M68,190 Q84,184 100,183 Q116,184 132,190"
            stroke="#050505" strokeWidth="3" fill="none" opacity="0.5"/>

      {/* ══════════════════════════════════════════════
          EARS
      ══════════════════════════════════════════════ */}
      {/* Left ear — outer shell, inner cup, inner hollow */}
      <ellipse cx="21"  cy="118" rx="19" ry="23" fill="url(#bkg-ear)"/>
      <ellipse cx="21"  cy="118" rx="11" ry="14" fill="#181818"/>
      <ellipse cx="21"  cy="119" rx="6"  ry="8"  fill="#222"/>
      <path d="M13,110 Q18,118 15,127" stroke="#111" strokeWidth="1.5"
            fill="none" strokeLinecap="round"/>
      {/* Right ear */}
      <ellipse cx="179" cy="118" rx="19" ry="23" fill="url(#bkg-ear)"/>
      <ellipse cx="179" cy="118" rx="11" ry="14" fill="#181818"/>
      <ellipse cx="179" cy="119" rx="6"  ry="8"  fill="#222"/>
      <path d="M187,110 Q182,118 185,127" stroke="#111" strokeWidth="1.5"
            fill="none" strokeLinecap="round"/>

      {/* ══════════════════════════════════════════════
          HEAD — wide gorilla skull with anatomical curves
      ══════════════════════════════════════════════ */}
      <path d="M100,55
               C132,55 162,68 170,88
               C180,108 178,132 174,152
               C169,172 160,190 146,202
               C133,213 117,217 100,217
               C83,217 67,213 54,202
               C40,190 31,172 26,152
               C22,132 20,108 30,88
               C38,68 68,55 100,55Z"
            fill="url(#bkg-fur)"/>

      {/* Temporal muscle ridges — structural depth */}
      <path d="M32,112 Q36,92 52,80 Q44,108 38,136Z"
            fill="#1c1c1c" opacity="0.38"/>
      <path d="M168,112 Q164,92 148,80 Q156,108 162,136Z"
            fill="#1c1c1c" opacity="0.38"/>

      {/* ── Fur strokes left side ── */}
      <path d="M40,92  Q33,108 31,126" stroke="#2a2a2a" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M50,80  Q43,98  41,118" stroke="#272727" strokeWidth="2.1" fill="none" strokeLinecap="round"/>
      <path d="M62,72  Q57,91  55,111" stroke="#242424" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <path d="M75,66  Q72,86  70,106" stroke="#212121" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M88,62  Q86,82  85,102" stroke="#1e1e1e" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      {/* ── Fur strokes right side ── */}
      <path d="M160,92  Q167,108 169,126" stroke="#2a2a2a" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M150,80  Q157,98  159,118" stroke="#272727" strokeWidth="2.1" fill="none" strokeLinecap="round"/>
      <path d="M138,72  Q143,91  145,111" stroke="#242424" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <path d="M125,66  Q128,86  130,106" stroke="#212121" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M112,62  Q114,82  115,102" stroke="#1e1e1e" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      {/* ── Chin fur ── */}
      <path d="M74,207  Q87,213 100,214"  stroke="#1c1c1c" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      <path d="M126,207 Q113,213 100,214" stroke="#1c1c1c" strokeWidth="2.2" fill="none" strokeLinecap="round"/>

      {/* Cheekbone highlights — give face dimension */}
      <ellipse cx="50"  cy="150" rx="16" ry="11" fill="#282828" opacity="0.22"/>
      <ellipse cx="150" cy="150" rx="16" ry="11" fill="#282828" opacity="0.22"/>

      {/* ══════════════════════════════════════════════
          MUZZLE — large, protruding, warm
      ══════════════════════════════════════════════ */}
      {/* Muzzle base shadow (shows it sits forward) */}
      <ellipse cx="100" cy="170" rx="54" ry="40" fill="#1a0a04" opacity="0.35"/>
      {/* Muzzle main */}
      <ellipse cx="100" cy="168" rx="50" ry="37" fill="url(#bkg-mz)"/>
      {/* Muzzle center highlight — forward projection */}
      <ellipse cx="97"  cy="160" rx="20" ry="11" fill="#e8c080" opacity="0.14"/>
      {/* Muzzle lower shadow */}
      <path d="M60,180 Q80,198 100,200 Q120,198 140,180
               Q150,172 150,168 Q150,145 100,145 Q50,145 50,168 Q50,172 60,180Z"
            fill="none" stroke="#4a2208" strokeWidth="3.5" opacity="0.3"/>

      {/* Philtrum groove */}
      <path d="M96,153 Q100,148 104,153 L103,163 Q100,166 97,163Z"
            fill="#8a4c1c" opacity="0.45"/>

      {/* Nostrils — large and flat like a real gorilla */}
      <ellipse cx="86"  cy="163" rx="12.5" ry="9.5" fill="#080808"/>
      <ellipse cx="114" cy="163" rx="12.5" ry="9.5" fill="#080808"/>
      {/* Nostril inner depth */}
      <ellipse cx="83"  cy="162" rx="5"    ry="3.5" fill="#151515" opacity="0.45"/>
      <ellipse cx="111" cy="162" rx="5"    ry="3.5" fill="#151515" opacity="0.45"/>
      {/* Nostril outer rim highlight */}
      <path d="M76,159 Q86,155 96,157"  stroke="#b07440" strokeWidth="1.2"
            fill="none" opacity="0.4" strokeLinecap="round"/>
      <path d="M124,159 Q114,155 104,157" stroke="#b07440" strokeWidth="1.2"
            fill="none" opacity="0.4" strokeLinecap="round"/>

      {/* Upper lip line */}
      <path d="M68,177 Q84,169 100,170 Q116,169 132,177"
            stroke="#7a4818" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      {/* Mouth — signature orange smile */}
      <path d="M72,184 Q86,195 100,196 Q114,195 128,184"
            stroke="#ff6b00" strokeWidth="3.2" fill="none" strokeLinecap="round"/>

      {/* ══════════════════════════════════════════════
          SUNGLASSES — drawn BEFORE brow so brow covers top
      ══════════════════════════════════════════════ */}

      {/* LEFT LENS */}
      <circle cx="71"  cy="116" r="27" fill="url(#bkg-lens)"/>
      <circle cx="71"  cy="116" r="21" fill="#c03e00" opacity="0.4"/>
      {/* Lens specular highlight (lens reflection) */}
      <ellipse cx="59"  cy="106" rx="10" ry="6.5" fill="white" opacity="0.13"/>
      <ellipse cx="56"  cy="104" rx="4"  ry="2.5" fill="white" opacity="0.07"/>
      {/* Frame outer */}
      <circle cx="71"  cy="116" r="27" fill="none" stroke="#0b0b0b" strokeWidth="5.5"/>
      {/* Frame inner bevel */}
      <circle cx="71"  cy="116" r="23" fill="none" stroke="#1c1c1c" strokeWidth="1" opacity="0.5"/>

      {/* RIGHT LENS */}
      <circle cx="129" cy="116" r="27" fill="url(#bkg-lens)"/>
      <circle cx="129" cy="116" r="21" fill="#c03e00" opacity="0.4"/>
      <ellipse cx="117" cy="106" rx="10" ry="6.5" fill="white" opacity="0.13"/>
      <ellipse cx="114" cy="104" rx="4"  ry="2.5" fill="white" opacity="0.07"/>
      <circle cx="129" cy="116" r="27" fill="none" stroke="#0b0b0b" strokeWidth="5.5"/>
      <circle cx="129" cy="116" r="23" fill="none" stroke="#1c1c1c" strokeWidth="1" opacity="0.5"/>

      {/* Bridge — connects the two frames */}
      <path d="M98,113 Q100,107 102,113"
            stroke="#0b0b0b" strokeWidth="6.5" strokeLinecap="round" fill="none"/>

      {/* Temple arms */}
      <path d="M44,112 L22,110" stroke="#0b0b0b" strokeWidth="5.5" strokeLinecap="round"/>
      <path d="M156,112 L178,110" stroke="#0b0b0b" strokeWidth="5.5" strokeLinecap="round"/>
      {/* Hinge screws */}
      <circle cx="44"  cy="112" r="4" fill="#181818"/>
      <circle cx="44"  cy="112" r="2" fill="#242424"/>
      <circle cx="156" cy="112" r="4" fill="#181818"/>
      <circle cx="156" cy="112" r="2" fill="#242424"/>

      {/* ══════════════════════════════════════════════
          BROW RIDGE — massive gorilla shelf, over glasses
      ══════════════════════════════════════════════ */}
      <path d="M23,103
               Q28,68 62,60 Q80,55 100,54 Q120,55 138,60
               Q172,68 177,103
               Q172,128 138,127 Q119,127 100,126
               Q81,127 62,127 Q28,128 23,103Z"
            fill="#0c0c0c"/>
      {/* Brow top highlight edge */}
      <path d="M25,101 Q30,70 64,62 Q100,56 136,62 Q170,70 175,101"
            stroke="#1e1e1e" strokeWidth="2.2" fill="none" opacity="0.5"/>
      {/* Brow fur texture strokes */}
      <path d="M33,117 Q46,110 64,110"  stroke="#191919" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      <path d="M35,122 Q49,115 67,115"  stroke="#161616" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
      <path d="M167,117 Q154,110 136,110" stroke="#191919" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      <path d="M165,122 Q151,115 133,115" stroke="#161616" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
      {/* Center brow furrows — gorilla "angry" expression */}
      <path d="M87,100 Q93,93 100,91 Q107,93 113,100"
            stroke="#090909" strokeWidth="3.2" fill="none" strokeLinecap="round"/>
      <path d="M90,106 Q95,100 100,98 Q105,100 110,106"
            stroke="#090909" strokeWidth="2"   fill="none" strokeLinecap="round" opacity="0.75"/>

      {/* ══════════════════════════════════════════════
          CAP — orange snapback with volume
      ══════════════════════════════════════════════ */}
      {/* Crown main shape */}
      <path d="M33,84 Q41,18 100,12 Q159,18 167,84Z" fill="url(#bkg-cap)"/>

      {/* Front panel — lighter to show forward-facing panel */}
      <path d="M70,15 Q85,9 100,12 Q115,9 130,15
               Q135,48 100,53 Q65,48 70,15Z"
            fill="#ffcc60" opacity="0.2"/>

      {/* Seam lines — stitched panels */}
      <path d="M100,12 L100,84"          stroke="#9c2600" strokeWidth="1.8" opacity="0.42"/>
      <path d="M70,15 Q63,50 35,84"      stroke="#9c2600" strokeWidth="1.5" opacity="0.3"/>
      <path d="M130,15 Q137,50 165,84"   stroke="#9c2600" strokeWidth="1.5" opacity="0.3"/>
      {/* Side panels — slightly darker */}
      <path d="M35,84 Q38,55 55,35 Q44,60 38,84Z"
            fill="#a83000" opacity="0.15"/>
      <path d="M165,84 Q162,55 145,35 Q156,60 162,84Z"
            fill="#a83000" opacity="0.15"/>

      {/* Cap button */}
      <circle cx="100" cy="14" r="5.5" fill="#861e00"/>
      <circle cx="100" cy="14" r="3.5" fill="#aa2e00"/>
      <circle cx="100" cy="14" r="1.5" fill="#cc4a00"/>

      {/* BK embroidery — shadow then text for depth */}
      <text x="101" y="47" textAnchor="middle" fontSize="13.5" fill="rgba(0,0,0,0.5)"
            fontWeight="900" letterSpacing="2.5"
            fontFamily="Arial Black, Arial, sans-serif">BK</text>
      <text x="100" y="46" textAnchor="middle" fontSize="13.5" fill="rgba(255,255,255,0.97)"
            fontWeight="900" letterSpacing="2.5"
            fontFamily="Arial Black, Arial, sans-serif">BK</text>

      {/* Cap band / sweatband */}
      <rect x="31" y="80" width="138" height="7"   rx="3.5" fill="#861e00"/>
      <rect x="31" y="82" width="138" height="1.5" rx="0.8" fill="#aa2e00" opacity="0.5"/>
      <rect x="31" y="85" width="138" height="1"   rx="0.5" fill="#5e1200" opacity="0.5"/>

      {/* Flat brim — three layers for thickness/depth */}
      <rect x="12" y="85" width="176" height="14" rx="7"   fill="#1a1a1a"/>
      <rect x="12" y="85" width="176" height="5"  rx="4"   fill="#272727" opacity="0.6"/>
      <rect x="12" y="95" width="176" height="4"  rx="2"   fill="#080808" opacity="0.92"/>
      <rect x="12" y="97" width="176" height="2"  rx="1"   fill="#0c0c0c"/>
    </svg>
  )
}
