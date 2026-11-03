import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';

function loadEnvFile() {
  if (!existsSync('.env')) return;
  for (const line of readFileSync('.env', 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match || match[1] in process.env) continue;
    process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2');
  }
}

loadEnvFile();

const catalog = {
  '1': { name: 'Espresso', amount: 250 },
  '2': { name: 'Cappuccino', amount: 350 },
  '3': { name: 'Iced Latte', amount: 400 },
  '4': { name: 'Mocha', amount: 425 },
  '5': { name: 'Americano', amount: 300 },
  '6': { name: 'Flat White', amount: 375 },
  '7': { name: 'Croissant', amount: 225 },
  '8': { name: 'Blueberry Muffin', amount: 275 },
  '9': { name: 'Caramel Macchiato', amount: 450 },
  '10': { name: 'Cold Brew', amount: 375 },
  '11': { name: 'Cortado', amount: 325 },
  '12': { name: 'Vanilla Latte', amount: 400 },
  '13': { name: 'Matcha Latte', amount: 425 },
  '14': { name: 'Chai Latte', amount: 400 },
  '15': { name: 'Affogato', amount: 450 },
  '16': { name: 'Banana Bread', amount: 300 },
  '17': { name: 'Caramel Frappe', amount: 475 },
  '18': { name: 'Iced Matcha', amount: 425 },
};

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const allowedOrigin = process.env.APP_ORIGIN || 'http://localhost:8081';
const successUrl = process.env.CHECKOUT_SUCCESS_URL;
const cancelUrl = process.env.CHECKOUT_CANCEL_URL;
const port = Number(process.env.PORT || 4242);
const host = process.env.HOST || '0.0.0.0';

function sendJson(response, status, body, origin) {
  response.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': origin || allowedOrigin,
    'Vary': 'Origin',
  });
  response.end(JSON.stringify(body));
}

function parseBody(request) {
  return new Promise((resolve, reject) => {
    let raw = '';
    request.on('data', chunk => {
      raw += chunk;
      if (raw.length > 24_000) reject(new Error('Request is too large.'));
    });
    request.on('end', () => {
      try { resolve(JSON.parse(raw || '{}')); }
      catch { reject(new Error('Request body must be valid JSON.')); }
    });
    request.on('error', reject);
  });
}

async function createStripeSession(items) {
  const params = new URLSearchParams({ mode: 'payment', success_url: successUrl, cancel_url: cancelUrl });
  items.forEach(({ id, quantity }, index) => {
    const product = catalog[id];
    params.set(`line_items[${index}][price_data][currency]`, 'usd');
    params.set(`line_items[${index}][price_data][unit_amount]`, String(product.amount));
    params.set(`line_items[${index}][price_data][product_data][name]`, product.name);
    params.set(`line_items[${index}][quantity]`, String(quantity));
  });

  const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${stripeSecretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });
  const stripeResult = await stripeResponse.json();
  if (!stripeResponse.ok) throw new Error(stripeResult.error?.message || 'Stripe could not create a checkout session.');
  return stripeResult.url;
}

async function getStripeResource(path) {
  const stripeResponse = await fetch(`https://api.stripe.com${path}`, {
    headers: { Authorization: `Bearer ${stripeSecretKey}` },
  });
  const result = await stripeResponse.json();
  if (!stripeResponse.ok) throw new Error(result.error?.message || 'Could not verify this payment.');
  return result;
}

const server = createServer(async (request, response) => {
  const origin = request.headers.origin;
  if (origin && origin !== allowedOrigin) {
    sendJson(response, 403, { error: 'This app origin is not allowed.' }, allowedOrigin);
    return;
  }

  if (request.method === 'OPTIONS') {
    response.writeHead(204, {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Origin',
    });
    response.end();
    return;
  }

  const requestUrl = new URL(request.url || '/', 'http://localhost');
  if (request.method === 'GET' && requestUrl.pathname === '/checkout-session') {
    if (!stripeSecretKey) {
      sendJson(response, 503, { error: 'Stripe server is missing STRIPE_SECRET_KEY.' }, origin);
      return;
    }
    const sessionId = requestUrl.searchParams.get('session_id') || '';
    if (!/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) {
      sendJson(response, 400, { error: 'A valid Checkout Session ID is required.' }, origin);
      return;
    }
    try {
      const [session, lineItems] = await Promise.all([
        getStripeResource(`/v1/checkout/sessions/${encodeURIComponent(sessionId)}`),
        getStripeResource(`/v1/checkout/sessions/${encodeURIComponent(sessionId)}/line_items?limit=100`),
      ]);
      sendJson(response, 200, {
        id: session.id,
        paymentStatus: session.payment_status,
        amountTotal: session.amount_total,
        currency: session.currency,
        items: (lineItems.data || []).map(item => ({
          name: item.description || 'Menu item',
          quantity: item.quantity || 1,
        })),
      }, origin);
    } catch (error) {
      sendJson(response, 502, { error: error instanceof Error ? error.message : 'Could not verify this payment.' }, origin);
    }
    return;
  }

  if (request.method !== 'POST' || request.url !== '/create-checkout-session') {
    sendJson(response, 404, { error: 'Not found.' }, origin);
    return;
  }

  if (!stripeSecretKey || !successUrl || !cancelUrl) {
    sendJson(response, 503, { error: 'Stripe server is missing configuration. Set STRIPE_SECRET_KEY, CHECKOUT_SUCCESS_URL, and CHECKOUT_CANCEL_URL.' }, origin);
    return;
  }

  try {
    const body = await parseBody(request);
    if (!Array.isArray(body.items) || body.items.length === 0 || body.items.length > 30) {
      sendJson(response, 400, { error: 'Add items to your cart before checkout.' }, origin);
      return;
    }

    const items = body.items.map(item => ({ id: String(item.id), quantity: Number(item.quantity) }));
    if (items.some(({ id, quantity }) => !catalog[id] || !Number.isInteger(quantity) || quantity < 1 || quantity > 20)) {
      sendJson(response, 400, { error: 'The cart contains an invalid item or quantity.' }, origin);
      return;
    }

    const url = await createStripeSession(items);
    sendJson(response, 200, { url }, origin);
  } catch (error) {
    sendJson(response, 502, { error: error instanceof Error ? error.message : 'Could not start checkout.' }, origin);
  }
});

server.listen(port, host, () => {
  console.log(`Stripe checkout server listening on port ${port}`);
});
