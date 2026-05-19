import p3 from './src/price3-products.json' with { type: "json" };

const WIRELESS_RE = new RegExp('\u0411\u0435\u0441\u043f\u0440\u043e\u0432\u043e\u0434\u043d|\u0411\u043b\u044e\u0442\u0443\u0442\u0445', 'ui');

// Find IP telephony items with wireless indicator in name
for (const p of p3) {
  if (String(p.category_raw || '') === '1. SIP-телефоны') {
    const n = String(p.name || '');
    const fn = String(p.fullName || '');
    if (WIRELESS_RE.test(n + ' ' + fn)) {
      console.log(p.code, '|', (n || fn).slice(0, 80), '|', String(p.category_raw || '').slice(0, 30));
    }
  }
}
