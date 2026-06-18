import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Star, Package, User, LogOut, Check, AlertCircle, Eye, EyeOff, Flame, Loader2 } from 'lucide-react'
import useUserStore, { STAMPS_REQUIRED } from '@/store/userStore'
import { supabase } from '@/lib/supabaseClient'
import { formatPrice } from '@/lib/utils'
import Input  from '@/components/ui/Input'
import Button from '@/components/ui/Button'

// ─── Tabs ──────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'loyalty',  icon: Star,    label: 'Fidelidad' },
  { id: 'orders',   icon: Package, label: 'Pedidos'   },
  { id: 'account',  icon: User,    label: 'Mi Cuenta' },
]

// ─── Mini gorilla stamp icon (matches BKGorilla visual language) ──────────────
function GorillaStamp({ filled }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={`w-full h-full transition-all duration-300 ${filled ? 'opacity-100' : 'opacity-15'}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Same palette as BKGorilla, unique gs-* IDs */}
        <radialGradient id="gs-fur" cx="38%" cy="30%" r="70%">
          <stop offset="0%"   stopColor="#2e2e2e"/>
          <stop offset="35%"  stopColor="#181818"/>
          <stop offset="100%" stopColor="#060606"/>
        </radialGradient>
        <radialGradient id="gs-mz" cx="44%" cy="24%" r="72%">
          <stop offset="0%"   stopColor="#daa870"/>
          <stop offset="50%"  stopColor="#ae7a3e"/>
          <stop offset="100%" stopColor="#6c3a12"/>
        </radialGradient>
        <radialGradient id="gs-cap" cx="30%" cy="16%" r="80%">
          <stop offset="0%"   stopColor="#ffb035"/>
          <stop offset="38%"  stopColor="#ff6c00"/>
          <stop offset="100%" stopColor="#b42e00"/>
        </radialGradient>
        <radialGradient id="gs-lens" cx="28%" cy="22%" r="76%">
          <stop offset="0%"   stopColor="#ffba4c"/>
          <stop offset="52%"  stopColor="#ff7200"/>
          <stop offset="100%" stopColor="#ba3600"/>
        </radialGradient>
        <radialGradient id="gs-ear" cx="36%" cy="34%" r="65%">
          <stop offset="0%"   stopColor="#1e1e1e"/>
          <stop offset="100%" stopColor="#090909"/>
        </radialGradient>
      </defs>

      {/* Shoulders */}
      <path d="M0,32 Q2,26 7.5,23 Q11,21.5 16,21 Q21,21.5 24.5,23 Q30,26 32,32Z"
            fill="#0a0a0a"/>

      {/* Ears — 3 layers matching BKGorilla */}
      <ellipse cx="4"  cy="19.5" rx="3.5" ry="4.2" fill="url(#gs-ear)"/>
      <ellipse cx="4"  cy="19.5" rx="2"   ry="2.6" fill="#181818"/>
      <ellipse cx="4"  cy="19.8" rx="1"   ry="1.3" fill="#222"/>
      <ellipse cx="28" cy="19.5" rx="3.5" ry="4.2" fill="url(#gs-ear)"/>
      <ellipse cx="28" cy="19.5" rx="2"   ry="2.6" fill="#181818"/>
      <ellipse cx="28" cy="19.8" rx="1"   ry="1.3" fill="#222"/>

      {/* Head */}
      <path d="M16,9.5
               C20.5,9.5 25,12 27,15.5
               C28.5,18.5 28,23 27,26
               C25.5,29.5 21,31.5 16,31.5
               C11,31.5 6.5,29.5 5,26
               C4,23 3.5,18.5 5,15.5
               C7,12 11.5,9.5 16,9.5Z"
            fill="url(#gs-fur)"/>

      {/* Fur strokes */}
      <path d="M6,14 Q5,17.5 4.5,21"  stroke="#2a2a2a" strokeWidth="0.6" fill="none" strokeLinecap="round"/>
      <path d="M8.5,11 Q7.5,15 7,19"  stroke="#272727" strokeWidth="0.5" fill="none" strokeLinecap="round"/>
      <path d="M26,14 Q27,17.5 27.5,21" stroke="#2a2a2a" strokeWidth="0.6" fill="none" strokeLinecap="round"/>
      <path d="M23.5,11 Q24.5,15 25,19" stroke="#272727" strokeWidth="0.5" fill="none" strokeLinecap="round"/>

      {/* Muzzle */}
      <ellipse cx="16" cy="27.2" rx="7.5" ry="4.8" fill="#1a0a04" opacity="0.35"/>
      <ellipse cx="16" cy="26.5" rx="7"   ry="4.4" fill="url(#gs-mz)"/>
      <ellipse cx="15" cy="25"   rx="3"   ry="1.6" fill="#e8c080" opacity="0.14"/>

      {/* Philtrum */}
      <path d="M15.2,24 Q16,23 16.8,24 L16.4,26 Q16,26.3 15.6,26Z"
            fill="#7a4818" opacity="0.4"/>

      {/* Nostrils */}
      <ellipse cx="13.5" cy="25.8" rx="2.1" ry="1.7" fill="#060606"/>
      <ellipse cx="18.5" cy="25.8" rx="2.1" ry="1.7" fill="#060606"/>
      <ellipse cx="13.2" cy="25.5" rx="0.8" ry="0.6" fill="#131313" opacity="0.4"/>
      <ellipse cx="18.2" cy="25.5" rx="0.8" ry="0.6" fill="#131313" opacity="0.4"/>

      {/* Mouth */}
      <path d="M12,28.5 Q14,30 16,30.2 Q18,30 20,28.5"
            stroke="#ff6b00" strokeWidth="1.2" strokeLinecap="round" fill="none"/>

      {/* Sunglasses — before brow so brow overlaps */}
      <circle cx="10.5" cy="20" r="4.5" fill="url(#gs-lens)"/>
      <circle cx="10.5" cy="20" r="3.5" fill="#c03e00" opacity="0.4"/>
      <ellipse cx="8.5"  cy="18" rx="1.8" ry="1.2" fill="white" opacity="0.13"/>
      <circle cx="10.5" cy="20" r="4.5" fill="none" stroke="#0b0b0b" strokeWidth="1.2"/>
      <circle cx="10.5" cy="20" r="3.7" fill="none" stroke="#1c1c1c" strokeWidth="0.4" opacity="0.5"/>

      <circle cx="21.5" cy="20" r="4.5" fill="url(#gs-lens)"/>
      <circle cx="21.5" cy="20" r="3.5" fill="#c03e00" opacity="0.4"/>
      <ellipse cx="19.5" cy="18" rx="1.8" ry="1.2" fill="white" opacity="0.13"/>
      <circle cx="21.5" cy="20" r="4.5" fill="none" stroke="#0b0b0b" strokeWidth="1.2"/>
      <circle cx="21.5" cy="20" r="3.7" fill="none" stroke="#1c1c1c" strokeWidth="0.4" opacity="0.5"/>

      {/* Bridge */}
      <path d="M15,19.5 Q16,18.2 17,19.5"
            stroke="#0b0b0b" strokeWidth="1.4" fill="none" strokeLinecap="round"/>

      {/* Temple arms + hinge circles */}
      <path d="M6,19.8 L3.5,19.5"   stroke="#0b0b0b" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M26,19.8 L28.5,19.5" stroke="#0b0b0b" strokeWidth="1.2" strokeLinecap="round"/>
      <circle cx="6"  cy="19.8" r="0.9" fill="#181818"/>
      <circle cx="26" cy="19.8" r="0.9" fill="#181818"/>

      {/* Brow — drawn OVER glasses, same as BKGorilla */}
      <path d="M3.8,16.5 Q5.5,10 16,9.5 Q26.5,10 28.2,16.5 Q26.5,21.5 16,21 Q5.5,21.5 3.8,16.5Z"
            fill="#0c0c0c"/>
      <path d="M4,16 Q5.5,10.5 16,10 Q26.5,10.5 28,16"
            stroke="#1e1e1e" strokeWidth="0.5" fill="none" opacity="0.5"/>
      <path d="M5,18.5 Q10,16 15,16"  stroke="#191919" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
      <path d="M27,18.5 Q22,16 17,16" stroke="#191919" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
      {/* Center furrows */}
      <path d="M13.5,15.5 Q16,13.5 18.5,15.5"
            stroke="#090909" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
      <path d="M14,17 Q16,15.5 18,17"
            stroke="#090909" strokeWidth="0.7" fill="none" strokeLinecap="round" opacity="0.75"/>

      {/* Cap crown */}
      <path d="M7.5,13 Q9.5,2 16,1.5 Q22.5,2 24.5,13Z" fill="url(#gs-cap)"/>
      {/* Front panel highlight */}
      <path d="M11.5,2.2 Q14,1.5 16,1.5 Q18,1.5 20.5,2.2 Q21.5,8 16,9.5 Q10.5,8 11.5,2.2Z"
            fill="#ffcc60" opacity="0.2"/>
      {/* Seam + side shadows */}
      <path d="M16,1.5 L16,13"             stroke="#9c2600" strokeWidth="0.7" opacity="0.42"/>
      <path d="M7.5,13 Q8.5,7 12,3.5 Q9.5,7 8.5,13Z"    fill="#a83000" opacity="0.15"/>
      <path d="M24.5,13 Q23.5,7 20,3.5 Q22.5,7 23.5,13Z" fill="#a83000" opacity="0.15"/>

      {/* Button — 3 circles matching BKGorilla */}
      <circle cx="16" cy="1.8" r="1.2" fill="#861e00"/>
      <circle cx="16" cy="1.8" r="0.8" fill="#aa2e00"/>
      <circle cx="16" cy="1.8" r="0.4" fill="#cc4a00"/>

      {/* BK embroidery — shadow then white text */}
      <text x="16.3" y="8.7" textAnchor="middle" fontSize="4.5" fill="rgba(0,0,0,0.5)"
            fontWeight="900" letterSpacing="1" fontFamily="Arial Black, Arial, sans-serif">BK</text>
      <text x="16" y="8.4" textAnchor="middle" fontSize="4.5" fill="rgba(255,255,255,0.97)"
            fontWeight="900" letterSpacing="1" fontFamily="Arial Black, Arial, sans-serif">BK</text>

      {/* Cap band — 3 lines matching BKGorilla */}
      <rect x="7"   y="11"    width="18" height="2.2" rx="1.1" fill="#861e00"/>
      <rect x="7"   y="12.4"  width="18" height="0.5" rx="0.3" fill="#aa2e00" opacity="0.5"/>
      <rect x="7"   y="13"    width="18" height="0.3" rx="0.2" fill="#5e1200" opacity="0.5"/>

      {/* Flat brim — 3 layers matching BKGorilla */}
      <rect x="1.5" y="12.8"  width="29" height="3"   rx="1.5" fill="#1a1a1a"/>
      <rect x="1.5" y="12.8"  width="29" height="1.2" rx="0.8" fill="#272727" opacity="0.6"/>
      <rect x="1.5" y="15"    width="29" height="0.9" rx="0.5" fill="#080808" opacity="0.92"/>
      <rect x="1.5" y="15.6"  width="29" height="0.5" rx="0.3" fill="#0c0c0c"/>
    </svg>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const navigate           = useNavigate()
  const user               = useUserStore((s) => s.user)
  const pendingReward      = useUserStore((s) => s.pendingReward)
  const clearPendingReward = useUserStore((s) => s.clearPendingReward)
  const logout             = useUserStore((s) => s.logout)
  const updateProfile      = useUserStore((s) => s.updateProfile)

  const [activeTab, setActiveTab] = useState('loyalty')

  // ── Orders from Supabase ───────────────────────────────────────────────────
  const [myOrders,      setMyOrders]      = useState([])
  const [loadingOrders, setLoadingOrders] = useState(false)

  useEffect(() => {
    if (activeTab !== 'orders' || !user?.id) return
    setLoadingOrders(true)
    supabase
      .from('orders')
      .select('*, order_items(*)')
      .eq('customer_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20)
      .then(({ data }) => {
        setMyOrders(
          (data ?? []).map((o) => ({
            id:        o.id,
            time:      new Date(o.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
            table:     o.table_type,
            payMethod: o.pay_method,
            total:     parseFloat(o.total),
            items:     (o.order_items ?? []).map((i) => ({ name: i.name, price: parseFloat(i.price) })),
          }))
        )
        setLoadingOrders(false)
      })
  }, [activeTab, user?.id])

  // ── Edit profile state ─────────────────────────────────────────────────────
  const [name,     setName]     = useState(user?.name  ?? '')
  const [email,    setEmail]    = useState(user?.email ?? '')
  const [pass,     setPass]     = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [showPass, setShowPass] = useState(false)
  const [saving,   setSaving]   = useState(false)
  const [saveMsg,  setSaveMsg]  = useState(null)
  const [errors,   setErrors]   = useState({})

  const stamps   = user?.stamps ?? 0
  const progress = Math.round((stamps / STAMPS_REQUIRED) * 100)

  async function handleSave() {
    const e = {}
    if (!name.trim())  e.name    = 'El nombre es obligatorio'
    if (!email.trim()) e.email   = 'El email es obligatorio'
    if (pass && pass.length < 6) e.pass = 'Mínimo 6 caracteres'
    if (pass && pass !== confirm) e.confirm = 'Las contraseñas no coinciden'
    if (Object.keys(e).length) { setErrors(e); return }

    setSaving(true)
    const result = await updateProfile({
      name:     name.trim(),
      email:    email.trim(),
      password: pass || undefined,
    })
    setSaving(false)

    if (result?.error) {
      setSaveMsg({ type: 'error', text: result.error })
    } else {
      setSaveMsg({ type: 'ok', text: '¡Datos actualizados correctamente!' })
      setPass('')
      setConfirm('')
      setErrors({})
      setTimeout(() => setSaveMsg(null), 3500)
    }
  }

  async function handleLogout() {
    await logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="px-4 pt-5 pb-6 animate-fade-in">

      {/* ── Reward popup ──────────────────────────────────────────────────────── */}
      {pendingReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center
                         bg-black/85 backdrop-blur-sm px-6">
          <div className="bg-bk-card border border-bk-primary/30 rounded-3xl
                           p-7 max-w-xs w-full text-center animate-fade-in">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="text-[22px] font-black mb-1.5">¡Plato gratis!</h2>
            <p className="text-[13px] text-bk-muted leading-relaxed mb-6">
              Has completado tu tarjeta de sellos.<br/>
              ¡Reclámalo en caja en tu próxima visita!
            </p>
            <button
              onClick={clearPendingReward}
              className="w-full py-3.5 rounded-2xl bg-bk-primary text-black
                         font-black text-[14px] shadow-orange"
            >
              ¡Genial, gracias! 🦍
            </button>
          </div>
        </div>
      )}

      {/* ── User header ───────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3.5 mb-6">
        <div className="w-[52px] h-[52px] rounded-2xl bg-bk-primary/10
                         border border-bk-primary/20 flex items-center justify-center flex-shrink-0">
          <span className="text-[22px] font-black text-bk-primary leading-none">
            {user?.name?.[0]?.toUpperCase() ?? '?'}
          </span>
        </div>
        <div className="min-w-0">
          <h2 className="text-[18px] font-black tracking-tight truncate">{user?.name}</h2>
          <p className="text-[11px] text-bk-muted truncate">{user?.email}</p>
        </div>
      </div>

      {/* ── Tab selector ──────────────────────────────────────────────────────── */}
      <div className="flex gap-1 bg-bk-card border border-bk-border rounded-2xl p-1 mb-5">
        {TABS.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl
                        transition-all text-[11px] font-bold
                        ${activeTab === id
                          ? 'bg-bk-primary/10 text-bk-primary border border-bk-primary/20'
                          : 'text-bk-muted hover:text-bk-text'
                        }`}
          >
            <Icon size={13} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* ══ TAB: Fidelidad ════════════════════════════════════════════════════ */}
      {activeTab === 'loyalty' && (
        <div className="animate-fade-in space-y-4">
          <div className="bg-gradient-to-br from-[#141414] to-[#0c0c0c]
                           border border-bk-border rounded-2xl p-5">
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.14em] text-bk-muted mb-1">
                  Tarjeta de sellos
                </p>
                <p className="text-[28px] font-black tracking-tight leading-none">
                  {stamps}
                  <span className="text-bk-muted font-normal text-[16px]"> / {STAMPS_REQUIRED}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-bold uppercase tracking-wider text-bk-muted mb-1">
                  Platos ganados
                </p>
                <p className="text-[28px] font-black text-bk-primary leading-none">
                  {user?.rewardsClaimed ?? 0}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2.5 mb-4">
              {Array.from({ length: STAMPS_REQUIRED }, (_, i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-xl p-1.5 transition-all duration-300
                    ${i < stamps
                      ? 'bg-bk-primary/15 border border-bk-primary/40 shadow-orange'
                      : 'bg-bk-card border border-bk-border'
                    }`}
                >
                  <GorillaStamp filled={i < stamps} />
                </div>
              ))}
            </div>
            <div className="h-1.5 bg-bk-border rounded-full overflow-hidden mb-1.5">
              <div
                className="h-full bg-bk-primary rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[10px] text-bk-muted text-right">
              {stamps === 0
                ? '¡Haz tu primer pedido para empezar!'
                : stamps === STAMPS_REQUIRED - 1
                  ? '🔥 ¡Un pedido más para tu regalo!'
                  : `${STAMPS_REQUIRED - stamps} pedidos para tu próximo plato gratis`
              }
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-bk-card border border-bk-border rounded-xl p-4 text-center">
              <p className="text-[28px] font-black text-bk-primary leading-none mb-1">
                {user?.completedOrders ?? 0}
              </p>
              <p className="text-[9px] font-bold uppercase tracking-wider text-bk-muted">
                Pedidos totales
              </p>
            </div>
            <div className="bg-bk-card border border-bk-border rounded-xl p-4 text-center">
              <p className="text-[28px] font-black text-bk-primary leading-none mb-1">
                {user?.rewardsClaimed ?? 0}
              </p>
              <p className="text-[9px] font-bold uppercase tracking-wider text-bk-muted">
                Platos gratis
              </p>
            </div>
          </div>

          <div className="bg-bk-primary/5 border border-bk-primary/15 rounded-xl px-4 py-3">
            <p className="text-[11px] text-bk-muted leading-relaxed">
              <span className="text-bk-primary font-bold">¿Cómo funciona?</span>
              {' '}Cada pedido completado suma 1 sello. Al llegar a {STAMPS_REQUIRED} sellos,
              ganas un plato gratis para canjear en tu próxima visita.
            </p>
          </div>
        </div>
      )}

      {/* ══ TAB: Pedidos ══════════════════════════════════════════════════════ */}
      {activeTab === 'orders' && (
        <div className="animate-fade-in">
          {loadingOrders ? (
            <div className="flex items-center justify-center py-16 gap-3 text-bk-muted">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-[13px]">Cargando historial…</span>
            </div>
          ) : myOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center animate-fade-in">
              <div className="grid grid-cols-4 gap-2 mb-5 opacity-20">
                {Array.from({ length: 8 }, (_, i) => (
                  <div key={i} className="w-9 h-9 rounded-xl bg-bk-card border border-bk-border p-1">
                    <GorillaStamp filled={false} />
                  </div>
                ))}
              </div>
              <h3 className="text-[16px] font-black tracking-tight mb-1">Sin pedidos aún</h3>
              <p className="text-[12px] text-bk-muted mb-5">
                Tu historial aparecerá aquí después de tu primer pedido
              </p>
              <button
                onClick={() => navigate('/customer/menu')}
                className="px-5 py-2.5 rounded-xl bg-bk-primary text-black font-black text-[12px]"
              >
                Ver la carta →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-bk-card border border-bk-border rounded-2xl p-4"
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-black text-bk-primary">{order.id}</span>
                      <span className="text-[10px] text-bk-muted">{order.time}</span>
                    </div>
                    <span className="text-[13px] font-black">{formatPrice(order.total)}</span>
                  </div>
                  <div className="text-[11px] text-bk-muted mb-2">
                    {order.table} · {order.payMethod}
                  </div>
                  <div className="space-y-0.5">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-[11px]">
                        <span className="text-bk-text">{item.name}</span>
                        <span className="text-bk-muted">{formatPrice(item.price)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ══ TAB: Mi cuenta ════════════════════════════════════════════════════ */}
      {activeTab === 'account' && (
        <div className="animate-fade-in space-y-4">

          {/* Save message */}
          {saveMsg && (
            <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-[12px] font-semibold
                             ${saveMsg.type === 'ok'
                               ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                               : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
              {saveMsg.type === 'ok'
                ? <Check size={13} />
                : <AlertCircle size={13} />
              }
              {saveMsg.text}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-[11px] font-semibold text-bk-muted uppercase tracking-wider mb-1.5">
              Nombre
            </label>
            <input
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors((p) => { const n={...p}; delete n.name; return n }) }}
              className={`w-full bg-bk-card rounded-xl px-4 py-3 text-[13px] text-bk-text
                          focus:outline-none transition-colors border
                          ${errors.name ? 'border-red-500/60' : 'border-bk-border focus:border-bk-primary'}`}
            />
            {errors.name && <p className="text-[11px] text-red-400 mt-1 ml-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-[11px] font-semibold text-bk-muted uppercase tracking-wider mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors((p) => { const n={...p}; delete n.email; return n }) }}
              className={`w-full bg-bk-card rounded-xl px-4 py-3 text-[13px] text-bk-text
                          focus:outline-none transition-colors border
                          ${errors.email ? 'border-red-500/60' : 'border-bk-border focus:border-bk-primary'}`}
            />
            {errors.email && <p className="text-[11px] text-red-400 mt-1 ml-1">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-[11px] font-semibold text-bk-muted uppercase tracking-wider mb-1.5">
              Nueva contraseña <span className="text-bk-muted2 normal-case font-normal">(dejar vacío para no cambiar)</span>
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={pass}
                onChange={(e) => { setPass(e.target.value); setErrors((p) => { const n={...p}; delete n.pass; return n }) }}
                placeholder="••••••••"
                className={`w-full bg-bk-card rounded-xl pl-4 pr-10 py-3 text-[13px] text-bk-text
                            placeholder:text-bk-muted2 focus:outline-none transition-colors border
                            ${errors.pass ? 'border-red-500/60' : 'border-bk-border focus:border-bk-primary'}`}
              />
              <button
                type="button"
                onClick={() => setShowPass((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-bk-muted hover:text-bk-text"
              >
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {errors.pass && <p className="text-[11px] text-red-400 mt-1 ml-1">{errors.pass}</p>}
          </div>

          {/* Confirm password */}
          {pass && (
            <div>
              <label className="block text-[11px] font-semibold text-bk-muted uppercase tracking-wider mb-1.5">
                Confirmar contraseña
              </label>
              <input
                type={showPass ? 'text' : 'password'}
                value={confirm}
                onChange={(e) => { setConfirm(e.target.value); setErrors((p) => { const n={...p}; delete n.confirm; return n }) }}
                placeholder="••••••••"
                className={`w-full bg-bk-card rounded-xl px-4 py-3 text-[13px] text-bk-text
                            placeholder:text-bk-muted2 focus:outline-none transition-colors border
                            ${errors.confirm ? 'border-red-500/60' : 'border-bk-border focus:border-bk-primary'}`}
              />
              {errors.confirm && <p className="text-[11px] text-red-400 mt-1 ml-1">{errors.confirm}</p>}
            </div>
          )}

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3.5 rounded-2xl bg-bk-primary text-black font-black text-[14px]
                       disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {saving ? 'Guardando…' : 'Guardar cambios'}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl
                       border border-bk-border text-bk-muted hover:text-red-400
                       hover:border-red-400/30 transition-colors text-[13px] font-semibold"
          >
            <LogOut size={14} />
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  )
}
