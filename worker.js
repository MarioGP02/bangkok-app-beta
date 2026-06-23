/**
 * Bangkok Noodles — Cloudflare Worker
 * Sirve la SPA y expone la API de pagos con Stripe.
 *
 * Rutas:
 *   POST /api/create-payment-intent  →  crea PaymentIntent en Stripe
 *   *                                →  sirve assets estáticos (React SPA)
 *
 * Secrets requeridos (wrangler secret put):
 *   STRIPE_SECRET_KEY  →  sk_test_... / sk_live_...
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    // ── CORS preflight ────────────────────────────────────────────────────────
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      })
    }

    // ── API: crear PaymentIntent ──────────────────────────────────────────────
    if (url.pathname === '/api/create-payment-intent' && request.method === 'POST') {
      return handleCreatePaymentIntent(request, env)
    }

    // ── Resto: assets estáticos / SPA fallback ────────────────────────────────
    return env.ASSETS.fetch(request)
  },
}

// ─────────────────────────────────────────────────────────────────────────────

async function handleCreatePaymentIntent(request, env) {
  try {
    const body = await request.json()
    const amount = Math.round(Number(body.amount)) // importe en céntimos

    if (!amount || amount < 50) {
      return json({ error: 'Importe inválido (mínimo 0,50 €)' }, 400)
    }

    // Si se especifican métodos concretos (ej: ['bizum']), usarlos;
    // si no, activar automatic_payment_methods para tarjeta.
    const paymentMethodTypes = Array.isArray(body.paymentMethodTypes) ? body.paymentMethodTypes : null

    const params = {
      amount:      String(amount),
      currency:    'eur',
      description: body.description ?? 'Bangkok Noodles — pedido',
    }

    if (paymentMethodTypes) {
      paymentMethodTypes.forEach((t, i) => { params[`payment_method_types[${i}]`] = t })
    } else {
      params['automatic_payment_methods[enabled]'] = 'true'
    }

    const stripeRes = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(params),
    })

    const pi = await stripeRes.json()

    if (!stripeRes.ok) {
      return json({ error: pi.error?.message ?? 'Error de Stripe' }, 400)
    }

    return json({ clientSecret: pi.client_secret })
  } catch (err) {
    console.error('create-payment-intent error:', err)
    return json({ error: 'Error interno del servidor' }, 500)
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
