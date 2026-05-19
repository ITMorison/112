import p3 from './src/price3-products.json' with { type: "json" };

const wirelessNames = [];

// Find products that have an actual бес_прода value (using Unicode codepoints)
for (const p of p3) {
  const n = String(p.name || '');
  const fn = String(p.fullName || '');
  const cat = String(p.category_raw || '');
  // Look for Cyrillic 'б' (u0431) 'е' (u0435) followed by word "беспроводн"
  if (/\u0431\u0435\u0441\u043f\u0440\u043e\u0432\u043e\u0434\u043d/.test(n + fn)) {
    wirelessNames.push((p.code || '?') + ' | cat=' + cat.slice(0, 30) + ' | ' + (n || fn).slice(0, 65));
  }
}

console.log('Wireless products count:', wirelessNames.length);
console.log('Samples:');
wirelessNames.slice(0, 25).forEach(function(x) { console.log(x); });
