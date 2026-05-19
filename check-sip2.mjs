import p3 from './src/price3-products.json' with { type: "json" };

const WIRELESS_RE = new RegExp('\u0431\u0435\u0441\u043f\u0440\u043e\u0432\u043e\u0434\u043d', 'iu');

console.log('Checking wireless count for "1. SIP-\u0442\u0435\u043b\u0435\u0444\u043e\u043d\u044b":');
for (const p of p3) {
  if (String(p.category_raw || '') === '1. SIP-телефоные') {
    const n = String(p.name || '');
    if (WIRELESS_RE.test(n)) {
      console.log(p.code, '|', n.slice(0, 60));
    }
  }
}
