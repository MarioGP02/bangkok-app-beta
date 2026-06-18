// ─── Order status ───────────────────────────────────────────────────────────
export const ORDER_STATUS = /** @type {const} */ ({
  RECEIVED:  'received',
  PREPARING: 'preparing',
  READY:     'ready',
})

export const ORDER_STATUS_LABEL = {
  received:  'Recibido',
  preparing: 'En preparación',
  ready:     'Listo',
}

// ─── Payment status ──────────────────────────────────────────────────────────
export const PAY_STATUS = /** @type {const} */ ({
  PENDING: 'pending',
  PAID:    'paid',
})

// ─── Menu categories ─────────────────────────────────────────────────────────
export const MENU_CATEGORY = /** @type {const} */ ({
  ALL:      'Todos',
  NOODLES:  'Noodles',
  ARROZ:    'Arroz Frito',
  ENSALADA: 'Ensaladas',
  ENTRANTE: 'Entrantes',
  BEBIDA:   'Bebidas',
  POSTRE:   'Postres',
})

// ─── Customization: Spicy levels ─────────────────────────────────────────────
/** @type {{ id: string, label: string, chilis: number }[]} */
export const SPICY_LEVELS = [
  { id: 'none',   label: 'Sin picante', chilis: 0 },
  { id: 'mild',   label: 'Suave',       chilis: 1 },
  { id: 'medium', label: 'Medio',       chilis: 2 },
  { id: 'hot',    label: 'Picante',     chilis: 3 },
]

// ─── Customization: Extra proteins ───────────────────────────────────────────
/** @type {{ id: string, label: string, price: number }[]} */
export const EXTRA_PROTEINS = [
  { id: 'tofu',       label: 'Tofu',       price: 1.60 },
  { id: 'pollo',      label: 'Pollo',      price: 1.60 },
  { id: 'ternera',    label: 'Ternera',    price: 1.60 },
  { id: 'langostino', label: 'Langostino', price: 2.00 },
]

// ─── Customization: Extra toppings ───────────────────────────────────────────
/** @type {{ id: string, label: string, price: number }[]} */
export const EXTRA_TOPPINGS = [
  { id: 'huevo',    label: 'Huevo frito',  price: 0.50 },
  { id: 'bambu',    label: 'Brotes bambú', price: 0.50 },
  { id: 'edamame',  label: 'Edamame',      price: 0.50 },
  { id: 'maiz',     label: 'Maíz dulce',   price: 0.50 },
  { id: 'setas',    label: 'Setas',        price: 0.50 },
  { id: 'cacahuete',label: 'Cacahuete',    price: 0.50 },
]

// ─── Timing ──────────────────────────────────────────────────────────────────
/** Minutes of prep time per order in the queue */
export const PREP_TIME_PER_ORDER = 7

// ─── Finance ─────────────────────────────────────────────────────────────────
export const TAX_RATE = 0.10

// ─── Loyalty ─────────────────────────────────────────────────────────────────
export const STAMPS_REQUIRED = 8
