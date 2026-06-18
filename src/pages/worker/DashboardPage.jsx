import { useState } from 'react'
import { QrCode, X, Copy, Check, Loader2 } from 'lucide-react'
import useOrderStore from '@/store/orderStore'
import useUIStore    from '@/store/uiStore'
import StatCard      from '@/components/worker/StatCard'
import FilterTabs    from '@/components/worker/FilterTabs'
import OrderCard     from '@/components/worker/OrderCard'
import { formatPrice } from '@/lib/utils'
import { ORDER_STATUS, PAY_STATUS } from '@/lib/constants'

// QR URL reads from env so it works in local dev AND in Cloudflare Pages
// Set VITE_APP_URL in Cloudflare Pages -> Settings -> Environment variables
const QR_URL = `${import.meta.env.VITE_APP_URL ?? 'http://localhost:5173'}/qr`
const QR_IMG = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(QR_URL)}&bgcolor=111111&color=ff6b00&format=png&margin=12`

// --- QR Modal ---
function QRModal({ onClose }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(QR_URL).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-bk-card border border-bk-border rounded-3xl p-6 w-full max-w-xs
                      animate-fade-in shadow-orange text-center">

        <div className="flex items-center justify-between mb-5">
          <div className="text-left">
            <h3 className="text-[16px] font-black tracking-tight">QR de entrada</h3>
            <p className="text-[11px] text-bk-muted mt-0.5">Clientes escanean y piden directamente</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-bk-card2 text-bk-muted transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="bg-[#111] border border-bk-border rounded-2xl p-3 mb-4 inline-block">
          <img
            src={QR_IMG}
            alt="QR codigo Bangkok"
            width={220}
            height={220}
            className="rounded-xl block"
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
          <div className="hidden w-[220px] h-[220px] rounded-xl flex-col items-center
                          justify-center text-center text-bk-muted text-[11px] gap-2">
            <QrCode size={32} className="text-bk-muted2" />
            <span>Sin conexion.<br />Usa la URL directamente.</span>
          </div>
        </div>

        <div className="bg-bk-bg border border-bk-border rounded-xl px-3 py-2.5 mb-4
                        flex items-center gap-2">
          <code className="text-[10px] text-bk-muted font-mono flex-1 text-left truncate">
            {QR_URL}
          </code>
          <button
            onClick={handleCopy}
            className="flex-shrink-0 text-bk-muted hover:text-bk-primary transition-colors"
          >
            {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
          </button>
        </div>

        <div className="flex gap-2 justify-center flex-wrap mb-4">
          {['Sin registro necesario', 'Modo invitado', 'Pago integrado'].map((t) => (
            <span
              key={t}
              className="text-[9px] font-semibold text-bk-muted border border-bk-border
                         rounded-full px-2.5 py-1 uppercase tracking-wide"
            >
              {t}
            </span>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-bk-primary text-black font-black text-[13px]"
        >
          Cerrar
        </button>
      </div>
    </div>
  )
}

// --- Page ---
export default function DashboardPage() {
  const orders          = useOrderStore((s) => s.orders)
  const loading         = useOrderStore((s) => s.loading)
  const workerFilter    = useUIStore((s) => s.workerFilter)
  const setWorkerFilter = useUIStore((s) => s.setWorkerFilter)
  const stats           = useOrderStore((s) => s.getStats())
  const [showQR, setShowQR] = useState(false)

  const FILTERS = [
    { id: 'all',                  label: 'Todos'      },
    { id: ORDER_STATUS.RECEIVED,  label: 'Recibidos'  },
    { id: ORDER_STATUS.PREPARING, label: 'En cocina'  },
    { id: ORDER_STATUS.READY,     label: 'Listos'     },
  ]

  const filtered = workerFilter === 'all'
    ? orders
    : orders.filter((o) => o.status === workerFilter)

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 py-5 space-y-5">

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            label="Pedidos activos"
            value={stats.total}
            highlight={stats.total > 0}
          />
          <StatCard
            label="Pago pendiente"
            value={stats.pendingPayment}
            highlight={stats.pendingPayment > 0}
            variant="warning"
          />
          <StatCard
            label="En cocina"
            value={stats.inKitchen}
          />
          <StatCard
            label="Facturado hoy"
            value={formatPrice(stats.revenue)}
            isText
          />
        </div>

        <div className="flex items-center justify-between gap-3 flex-wrap">
          <FilterTabs
            filters={FILTERS}
            active={workerFilter}
            onChange={setWorkerFilter}
          />

          <button
            onClick={() => setShowQR(true)}
            className="flex items-center gap-1.5 text-[11px] text-bk-muted border border-bk-border
                       rounded-xl px-3 py-2 hover:border-bk-primary/40 hover:text-bk-primary
                       transition-colors"
          >
            <QrCode size={13} />
            <span className="hidden sm:inline">QR clientes</span>
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-bk-muted gap-3">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-[13px]">Cargando pedidos...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-12 h-12 rounded-2xl bg-bk-card border border-bk-border
                            flex items-center justify-center mb-4">
              <QrCode size={20} className="text-bk-muted2" />
            </div>
            <h3 className="text-[15px] font-black tracking-tight mb-1">
              {workerFilter === 'all' ? 'Sin pedidos activos' : 'Sin pedidos en este estado'}
            </h3>
            <p className="text-[12px] text-bk-muted">
              {workerFilter === 'all'
                ? 'Los nuevos pedidos apareceran aqui en tiempo real'
                : 'Cambia el filtro para ver otros pedidos'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>

      {showQR && <QRModal onClose={() => setShowQR(false)} />}
    </div>
  )
}
