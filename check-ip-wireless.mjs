import p3 from './src/price3-products.json' with { type: "json" };
import price2 from './src/price2-products.json' with { type: "json" };
import price1 from './src/price1-products.json' with { type: "json" };

const B = '\u0431\u0435\u0441\u043f\u0440\u043e\u0432\u043e\u0434\u043d';
const B_CAP = '\u0411\u0435\u0441\u043f\u0440\u043e\u0432\u043e\u0434\u043d';

// Find IP telephony wireless products (DECT phones, not WiFi routers)
const ipWireless = [];

for (const p of [...price1, ...price2, ...p3]) {
  const n = String(p.name || '');
  const fn = String(p.fullName || '');
  const cat = String(p.category_raw || '');
  
  // IP telephony category (for context)
  const isIPTel = /ip[- ]?(телефон|телеф|ats)/i.test(cat) || 
                  /dect/i.test(cat) ||
                  /сип/i.test(cat);
  
  if (!isIPTel) continue;
  
  // Check for wireless keywords in name
  if (B_CAP + B_CAP.toLowerCase() <= n + fn) {
    ipWireless.push((p.code || '?') + ' | cat=' + cat.slice(0, 40) + ' | ' + (n || fn).slice(0, 80));
  }
}

console.log('IP telephony wireless products count:', ipWireless.length);
ipWireless.forEach(function(x) { console.log(x); });
