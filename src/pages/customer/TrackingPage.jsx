import { useNavigate } from 'react-router-dom'
import { Clock, MapPin } from 'lucide-react'
import useOrderStore from '@/store/orderStore'
import DinoGame      from '@/components/customer/DinoGame'
import { ORDER_STATUS, PREP_TIME_PER_ORDER } from '@/lib/constants'

// ── Gorilla SVG — 3 states ─────────────────────────────────────────────────

function GorilaSVG({ status }) {
  const isReady     = status === ORDER_STATUS.READY
  const isPreparing = status === ORDER_STATUS.PREPARING

  return (
    <svg
      viewBox="0 0 200 230"
      className={`w-44 h-48 mx-auto transition-all duration-700 drop-shadow-lg
                  ${isReady     ? 'animate-gorilla-jump'
                  : isPreparing ? 'animate-gorilla-bob'
                  :               'animate-gorilla-sway'}`}
    >
      <defs>
        {/* Rich fur gradient */}
        <radialGradient id="trk-h" cx="38%" cy="30%" r="70%">
          <stop offset="0%"   stopColor="#2e2e2e"/>
          <stop offset="38%"  stopColor="#161616"/>
          <stop offset="100%" stopColor="#060606"/>
        </radialGradient>
        {/* Muzzle — warm tawny */}
        <radialGradient id="trk-mz" cx="44%" cy="24%" r="72%">
          <stop offset="0%"   stopColor="#daa870"/>
          <stop offset="50%"  stopColor="#ae7a3e"/>
          <stop offset="100%" stopColor="#6c3a12"/>
        </radialGradient>
        {/* Lens — fire orange */}
        <radialGradient id="trk-ln" cx="28%" cy="22%" r="76%">
          <stop offset="0%"   stopColor="#ffba4c"/>
          <stop offset="52%"  stopColor="#ff7200"/>
          <stop offset="100%" stopColor="#ba3600"/>
        </radialGradient>
        {/* Cap */}
        <radialGradient id="trk-cp" cx="30%" cy="16%" r="80%">
          <stop offset="0%"   stopColor="#ffb035"/>
          <stop offset="38%"  stopColor="#ff6c00"/>
          <stop offset="100%" stopColor="#b42e00"/>
        </radialGradient>
        {/* Ear */}
        <radialGradient id="trk-ear" cx="36%" cy="34%" r="62%">
          <stop offset="0%"   stopColor="#1e1e1e"/>
          <stop offset="100%" stopColor="#090909"/>
        </radialGradient>
      </defs>

      {/* ── Body ── */}
      <ellipse cx="100" cy="175" rx="50" ry="48" fill="#111"/>
      {/* Body fur highlight */}
      <ellipse cx="90" cy="160" rx="28" ry="20" fill="#1c1c1c" opacity="0.4"/>

      {/* ── Left arm ── */}
      {isPreparing ? (
        <path d="M50 158 Q24 130 30 92"  stroke="#111" strokeWidth="24" strokeLinecap="round" fill="none"/>
      ) : isReady ? (
        <path d="M50 148 Q26 118 33 82"  stroke="#111" strokeWidth="24" strokeLinecap="round" fill="none"/>
      ) : (
        <path d="M50 162 Q28 176 33 196" stroke="#111" strokeWidth="24" strokeLinecap="round" fill="none"/>
      )}

      {/* ── Left props — wok while cooking ── */}
      {isPreparing && (
        <>
          <ellipse cx="25" cy="85" rx="20" ry="9" fill="#2d2d2d" stroke="#444" strokeWidth="1.5"/>
          <path d="M5 85 Q8 67 25 64 Q42 67 45 85" fill="#333"/>
          {[14, 25, 36].map((x, i) => (
            <path key={i} d={`M${x} 61 Q${x-3} 51 ${x} 43 Q${x+3} 35 ${x} 27`}
                  stroke="rgba(160,160,160,0.4)" strokeWidth="2" strokeLinecap="round" fill="none"/>
          ))}
          <circle cx="21" cy="77" r="3" fill="#f0a020" opacity="0.8"/>
          <circle cx="28" cy="74" r="2" fill="#e06020" opacity="0.8"/>
        </>
      )}

      {/* ── Right arm ── */}
      {isReady ? (
        <path d="M150 148 Q174 118 167 82"  stroke="#111" strokeWidth="24" strokeLinecap="round" fill="none"/>
      ) : isPreparing ? (
        <path d="M150 158 Q172 168 167 188" stroke="#111" strokeWidth="24" strokeLinecap="round" fill="none"/>
      ) : (
        <path d="M150 162 Q172 176 167 196" stroke="#111" strokeWidth="24" strokeLinecap="round" fill="none"/>
      )}

      {/* ── Right props — bag when ready ── */}
      {isReady && (
        <>
          <rect x="152" y="57" width="44" height="36" rx="5" fill="#ff6b00"/>
          <path d="M162 57 Q174 49 186 57" stroke="#cc5500" strokeWidth="3" strokeLinecap="round" fill="none"/>
          <text x="174" y="82" textAnchor="middle" fontSize="11" fill="white" fontWeight="900" letterSpacing="1">BK</text>
        </>
      )}

      {/* ── Hands / fists ── */}
      {!isReady && !isPreparing && (
        <>
          <ellipse cx="33"  cy="196" rx="14" ry="11" fill="url(#trk-mz)"/>
          <ellipse cx="167" cy="196" rx="14" ry="11" fill="url(#trk-mz)"/>
          <rect x="155" y="191" width="24" height="15" rx="3" fill="#222"/>
          <rect x="157" y="193" width="20" height="10" rx="1.5" fill="#1a3a6a" opacity="0.7"/>
        </>
      )}
      {isPreparing && (
        <ellipse cx="167" cy="190" rx="13" ry="10" fill="url(#trk-mz)"/>
      )}
      {isReady && (
        <ellipse cx="33" cy="82" rx="13" ry="10" fill="url(#trk-mz)"/>
      )}

      {/* ══════════════════════════════
          EARS — detailed with inner cup
      ══════════════════════════════ */}
      <ellipse cx="46"  cy="92" rx="20" ry="24" fill="url(#trk-ear)"/>
      <ellipse cx="46"  cy="92" rx="12" ry="14" fill="#181818"/>
      <ellipse cx="46"  cy="93" rx="6.5" ry="8" fill="#222"/>
      <path d="M37,83 Q42,92 39,101" stroke="#111" strokeWidth="1.8" fill="none" strokeLinecap="round"/>

      <ellipse cx="154" cy="92" rx="20" ry="24" fill="url(#trk-ear)"/>
      <ellipse cx="154" cy="92" rx="12" ry="14" fill="#181818"/>
      <ellipse cx="154" cy="93" rx="6.5" ry="8" fill="#222"/>
      <path d="M163,83 Q158,92 161,101" stroke="#111" strokeWidth="1.8" fill="none" strokeLinecap="round"/>

      {/* ══════════════════════════════
          HEAD — anatomical gorilla skull
      ══════════════════════════════ */}
      <path d="M100,38
               C130,38 158,50 166,68
               C176,88 174,112 170,130
               C165,150 156,165 143,174
               C130,182 116,185 100,185
               C84,185 70,182 57,174
               C44,165 35,150 30,130
               C26,112 24,88 34,68
               C42,50 70,38 100,38Z"
            fill="url(#trk-h)"/>

      {/* Temporal muscle ridges */}
      <path d="M34,100 Q38,82 52,70 Q44,96 38,122Z" fill="#1c1c1c" opacity="0.35"/>
      <path d="M166,100 Q162,82 148,70 Q156,96 162,122Z" fill="#1c1c1c" opacity="0.35"/>

      {/* Fur texture strokes — left */}
      <path d="M42,78  Q36,93 34,110"  stroke="#2a2a2a" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      <path d="M52,68  Q46,84 44,102"  stroke="#272727" strokeWidth="1.9" fill="none" strokeLinecap="round"/>
      <path d="M63,61  Q59,78 58,97"   stroke="#242424" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
      <path d="M75,56  Q72,74 71,93"   stroke="#212121" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
      {/* Right */}
      <path d="M158,78  Q164,93 166,110" stroke="#2a2a2a" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      <path d="M148,68  Q154,84 156,102" stroke="#272727" strokeWidth="1.9" fill="none" strokeLinecap="round"/>
      <path d="M137,61  Q141,78 142,97"  stroke="#242424" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
      <path d="M125,56  Q128,74 129,93"  stroke="#212121" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
      {/* Chin fur */}
      <path d="M72,178  Q86,184 100,185"  stroke="#1c1c1c" strokeWidth="2" fill="none" strokeLinecap="round"/>
      <path d="M128,178 Q114,184 100,185" stroke="#1c1c1c" strokeWidth="2" fill="none" strokeLinecap="round"/>

      {/* Cheekbone highlights */}
      <ellipse cx="50"  cy="130" rx="16" ry="11" fill="#252525" opacity="0.2"/>
      <ellipse cx="150" cy="130" rx="16" ry="11" fill="#252525" opacity="0.2"/>

      {/* ══════════════════════════════
          MUZZLE
      ══════════════════════════════ */}
      {/* Muzzle shadow base */}
      <ellipse cx="100" cy="151" rx="40" ry="29" fill="#1a0a04" opacity="0.3"/>
      {/* Muzzle main */}
      <ellipse cx="100" cy="149" rx="37" ry="27" fill="url(#trk-mz)"/>
      {/* Muzzle highlight */}
      <ellipse cx="97"  cy="143" rx="16" ry="9"  fill="#e8c080" opacity="0.14"/>

      {/* Philtrum */}
      <path d="M97,138 Q100,134 103,138 L102,146 Q100,148 98,146Z"
            fill="#8a4c1c" opacity="0.45"/>

      {/* Nostrils */}
      <ellipse cx="88"  cy="146" rx="10" ry="7.5" fill="#080808"/>
      <ellipse cx="112" cy="146" rx="10" ry="7.5" fill="#080808"/>
      <ellipse cx="86"  cy="145" rx="4"  ry="3"   fill="#151515" opacity="0.4"/>
      <ellipse cx="110" cy="145" rx="4"  ry="3"   fill="#151515" opacity="0.4"/>

      {/* Lip line */}
      <path d="M72,157 Q86,150 100,151 Q114,150 128,157"
            stroke="#7a4818" strokeWidth="2.2" fill="none" strokeLinecap="round"/>

      {/* Mouth — adapts to state */}
      {isReady ? (
        <path d="M76,163 Q88,174 100,175 Q112,174 124,163"
              stroke="#ff6b00" strokeWidth="4.5" strokeLinecap="round" fill="none"/>
      ) : isPreparing ? (
        <ellipse cx="100" cy="166" rx="11" ry="7.5" fill="#080808"/>
      ) : (
        <path d="M80,163 Q90,168 100,169 Q110,168 120,163"
              stroke="#444" strokeWidth="3.2" strokeLinecap="round" fill="none"/>
      )}

      {/* ══════════════════════════════
          SUNGLASSES — before brow
      ══════════════════════════════ */}
      {/* Left lens */}
      <circle cx="79"  cy="95" r="23" fill="url(#trk-ln)"/>
      <circle cx="79"  cy="95" r="18" fill="#c03e00" opacity="0.4"/>
      <ellipse cx="69"  cy="87" rx="8.5" ry="5.5" fill="white" opacity="0.13"/>
      <ellipse cx="66"  cy="85" rx="3.5" ry="2.2" fill="white" opacity="0.07"/>
      <circle cx="79"  cy="95" r="23" fill="none" stroke="#0b0b0b" strokeWidth="5"/>
      <circle cx="79"  cy="95" r="19.5" fill="none" stroke="#1c1c1c" strokeWidth="1" opacity="0.5"/>

      {/* Right lens */}
      <circle cx="121" cy="95" r="23" fill="url(#trk-ln)"/>
      <circle cx="121" cy="95" r="18" fill="#c03e00" opacity="0.4"/>
      <ellipse cx="111" cy="87" rx="8.5" ry="5.5" fill="white" opacity="0.13"/>
      <ellipse cx="108" cy="85" rx="3.5" ry="2.2" fill="white" opacity="0.07"/>
      <circle cx="121" cy="95" r="23" fill="none" stroke="#0b0b0b" strokeWidth="5"/>
      <circle cx="121" cy="95" r="19.5" fill="none" stroke="#1c1c1c" strokeWidth="1" opacity="0.5"/>

      {/* Bridge */}
      <path d="M102,93 Q100,87 98,93" stroke="#0b0b0b" strokeWidth="6" strokeLinecap="round" fill="none"/>

      {/* Temple arms */}
      <path d="M56,93 L38,91"   stroke="#0b0b0b" strokeWidth="5.5" strokeLinecap="round"/>
      <path d="M144,93 L162,91" stroke="#0b0b0b" strokeWidth="5.5" strokeLinecap="round"/>
      <circle cx="56"  cy="93" r="3.5" fill="#181818"/>
      <circle cx="144" cy="93" r="3.5" fill="#181818"/>

      {/* ══════════════════════════════
          BROW RIDGE — massive shelf, over glasses
      ══════════════════════════════ */}
      <path
        d={isPreparing
          ? 'M42,83 Q50,60 100,57 Q150,60 158,83 Q150,105 100,104 Q50,105 42,83Z'
          : isReady
          ? 'M42,79 Q50,55 100,52 Q150,55 158,79 Q150,101 100,100 Q50,101 42,79Z'
          : 'M42,85 Q50,63 100,60 Q150,63 158,85 Q150,107 100,106 Q50,107 42,85Z'}
        fill="#0c0c0c"
      />
      {/* Brow top highlight */}
      <path
        d={isPreparing ? 'M44,81 Q100,60 156,81' : isReady ? 'M44,77 Q100,55 156,77' : 'M44,83 Q100,63 156,83'}
        stroke="#1e1e1e" strokeWidth="2" fill="none" opacity="0.5"
      />
      {/* Brow fur strokes */}
      <path d="M52,97  Q64,90 82,90"  stroke="#181818" strokeWidth="2"   fill="none" strokeLinecap="round"/>
      <path d="M54,102 Q68,95 86,95"  stroke="#161616" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      <path d="M148,97  Q136,90 118,90" stroke="#181818" strokeWidth="2"   fill="none" strokeLinecap="round"/>
      <path d="M146,102 Q132,95 114,95" stroke="#161616" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Center furrow */}
      <path
        d={isPreparing ? 'M90,81 Q95,75 100,73 Q105,75 110,81' : isReady ? 'M90,77 Q95,70 100,68 Q105,70 110,77' : 'M90,83 Q95,76 100,74 Q105,76 110,83'}
        stroke="#090909" strokeWidth="3" fill="none" strokeLinecap="round"
      />

      {/* ══════════════════════════════
          CAP — detailed snapback
      ══════════════════════════════ */}
      {/* Crown */}
      <path d="M48,76 Q57,24 100,18 Q143,24 152,76Z" fill="url(#trk-cp)"/>
      {/* Front panel highlight */}
      <path d="M73,22 Q87,16 100,18 Q113,16 127,22 Q132,50 100,55 Q68,50 73,22Z"
            fill="#ffcc60" opacity="0.2"/>
      {/* Seam lines */}
      <path d="M100,18 L100,76"          stroke="#9c2600" strokeWidth="1.8" opacity="0.42"/>
      <path d="M73,22  Q66,52 50,76"     stroke="#9c2600" strokeWidth="1.5" opacity="0.3"/>
      <path d="M127,22 Q134,52 150,76"   stroke="#9c2600" strokeWidth="1.5" opacity="0.3"/>
      {/* Button */}
      <circle cx="100" cy="20" r="5"   fill="#861e00"/>
      <circle cx="100" cy="20" r="3"   fill="#aa2e00"/>
      <circle cx="100" cy="20" r="1.2" fill="#cc4800"/>
      {/* BK text */}
      <text x="101" y="51" textAnchor="middle" fontSize="14" fill="rgba(0,0,0,0.5)"
            fontWeight="900" letterSpacing="2.5" fontFamily="Arial Black, Arial, sans-serif">BK</text>
      <text x="100" y="50" textAnchor="middle" fontSize="14" fill="rgba(255,255,255,0.97)"
            fontWeight="900" letterSpacing="2.5" fontFamily="Arial Black, Arial, sans-serif">BK</text>
      {/* Band */}
      <rect x="47" y="72" width="106" height="8"   rx="4"   fill="#861e00"/>
      <rect x="47" y="74" width="106" height="1.5" rx="0.8" fill="#aa2e00" opacity="0.5"/>
      {/* Flat brim */}
      <rect x="26" y="78" width="148" height="14" rx="7"   fill="#1a1a1a"/>
      <rect x="26" y="78" width="148" height="5"  rx="4"   fill="#272727" opacity="0.6"/>
      <rect x="26" y="88" width="148" height="4"  rx="2"   fill="#080808" opacity="0.92"/>
      <rect x="26" y="90" width="148" height="2"  rx="1"   fill="#0c0c0c"/>
    </svg>
  )
}

// ── Steps ──────────────────────────────────────────────────────────────────

const STEPS = [
  { key: ORDER_STATUS.RECEIVED,  label: 'Recibido'   },
  { key: ORDER_STATUS.PREPARING, label: 'Preparando' },
  { key: ORDER_STATUS.READY,     label: 'Listo'       },
  { key: 'delivered',            label: 'Entregado'  },
]

const STATUS_IDX = {
  [ORDER_STATUS.RECEIVED]:  0,
  [ORDER_STATUS.PREPARING]: 1,
  [ORDER_STATUS.READY]:     2,
  delivered:                3,
}

const STATUS_MSG = {
  [ORDER_STATUS.RECEIVED]:  { title: 'Pedido recibido 🙌', sub: 'Ahora te preparamos algo bestial...' },
  [ORDER_STATUS.PREPARING]: { title: '¡Al wok! 🔥',         sub: 'Tu gorila está cocinando' },
  [ORDER_STATUS.READY]:     { title: '¡Listo para recoger! 🎉', sub: 'Pasa al mostrador' },
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function TrackingPage() {
  const navigate = useNavigate()

  const order = useOrderStore((s) =>
    s.orders.find((o) => o.id === s.currentOrderId) ?? null
  )
  const activeCount = useOrderStore((s) =>
    s.orders.filter((o) => o.status !== ORDER_STATUS.READY).length
  )

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] px-6 text-center animate-fade-in">
        <div className="text-5xl mb-4">🦍</div>
        <p className="text-[14px] font-semibold text-bk-muted">Sin pedido activo</p>
        <p className="text-[12px] text-bk-muted2 mt-1.5 mb-6">
          Haz un pedido desde la carta para seguirlo aquí.
        </p>
        <button
          onClick={() => navigate('/customer/menu')}
          className="px-5 py-2.5 rounded-xl border border-bk-border text-[12px]
                     font-semibold text-bk-muted hover:text-bk-text transition-colors"
        >
          Ver la carta
        </button>
      </div>
    )
  }

  const currentIdx = STATUS_IDX[order.status] ?? 0
  const msg        = STATUS_MSG[order.status] ?? STATUS_MSG[ORDER_STATUS.RECEIVED]
  const eta        = Math.max(0, activeCount * PREP_TIME_PER_ORDER - currentIdx * 4)
  const pct        = Math.round((currentIdx / (STEPS.length - 1)) * 100)

  return (
    <div className="flex flex-col animate-fade-in">

      {/* ── Gorilla zone ──────────────────────────────────────────────────── */}
      <div
        className="relative flex flex-col items-center pt-5 pb-4 px-4 overflow-hidden"
        style={{ background: 'radial-gradient(ellipse at 50% 30%, rgba(255,107,0,0.07) 0%, transparent 70%)' }}
      >
        {/* Order badge */}
        <div className="absolute top-4 left-4 flex items-center gap-1.5">
          <span className="text-[9px] text-bk-muted font-mono">Pedido</span>
          <span className="text-[13px] font-black text-bk-primary font-mono leading-none">{order.id}</span>
        </div>

        {/* ETA chip */}
        <div className="absolute top-4 right-4 flex items-center gap-1.5
                        bg-bk-card border border-bk-border rounded-full px-2.5 py-1">
          <Clock size={10} className="text-bk-primary" />
          <span className="text-[11px] font-bold text-bk-text">~{eta} min</span>
        </div>

        <GorilaSVG status={order.status} />

        <h2 className="text-[17px] font-black tracking-tight mt-1 text-center">{msg.title}</h2>
        <p className="text-[12px] text-bk-muted mt-1 text-center">{msg.sub}</p>

        <div className="flex items-center gap-1 mt-1.5 text-[10px] text-bk-muted2">
          <MapPin size={9} />
          <span>{order.table} · {order.customerName}</span>
        </div>
      </div>

      {/* ── Progress bar ──────────────────────────────────────────────────── */}
      <div className="mx-4 mb-3 h-1.5 rounded-full bg-bk-border overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #ff6b00, #ff9500)' }}
        />
      </div>

      {/* ── Step indicators ───────────────────────────────────────────────── */}
      <div className="px-4 pb-4 border-b border-bk-border">
        <div className="relative flex items-start justify-between">
          {/* Track line */}
          <div className="absolute left-3.5 right-3.5 top-[13px] h-0.5 bg-bk-border2 z-0" />
          <div
            className="absolute left-3.5 top-[13px] h-0.5 bg-bk-primary z-0 transition-all duration-700"
            style={{ width: `calc(${pct}% - 7px)` }}
          />

          {STEPS.map((step, i) => {
            const done    = i < currentIdx
            const current = i === currentIdx
            return (
              <div key={step.key} className="flex flex-col items-center gap-1.5 z-10 flex-1">
                <div
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center
                               transition-all duration-500 text-[10px] font-bold
                               ${done    ? 'bg-bk-primary border-bk-primary text-black'
                               : current ? 'bg-bk-bg border-bk-primary text-bk-primary animate-pulse-dot'
                               :           'bg-bk-card2 border-bk-border2 text-bk-muted'}`}
                >
                  {done ? '✓' : i + 1}
                </div>
                <span
                  className={`text-[9px] font-semibold uppercase tracking-wide text-center leading-tight
                               ${current ? 'text-bk-primary' : done ? 'text-bk-muted' : 'text-bk-muted2'}`}
                >
                  {step.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Queue info ─────────────────────────────────────────────────────── */}
      <div className="mx-4 mt-3 mb-3 flex items-center gap-2.5 bg-bk-card border border-bk-border
                      rounded-xl px-3.5 py-2.5">
        <Clock size={13} className="text-bk-primary flex-shrink-0" />
        <div>
          <p className="text-[12px] font-semibold text-bk-primary">~{eta} minutos estimados</p>
          <p className="text-[10px] text-bk-muted mt-0.5">
            {activeCount > 1
              ? `${activeCount - 1} pedido${activeCount > 2 ? 's' : ''} delante del tuyo`
              : 'Eres el siguiente en la cola 🙌'}
          </p>
        </div>
      </div>

      {/* ── Dino game ──────────────────────────────────────────────────────── */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-bold text-bk-muted uppercase tracking-widest">
            Mientras esperas...
          </span>
          <div className="flex-1 h-px bg-bk-border" />
        </div>
        <DinoGame />
      </div>

    </div>
  )
}
