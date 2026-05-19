const p3 = require('./src/price3-products.json');
const wirelessNames = [];

// Find products that have "беспроводн" anywhere in their name/fullName
for (const p of p3) {
  const n = String(p.name || '');
  const fn = String(p.fullName || '');
  const cat = String(p.category_raw || '');
  if (n.includes('\u0431\u0435\u0441\u043f\u0440\u043e\u0432\u043e\u0434\u043d') || 
      fn.includes('\u0431\u0435\u0441\u043f\u0440\u043e\u0432\u043e\u0434\u043d')) {
    wirelessNames.push(p.code + ' | cat_raw=' + cat + ' | ' + (n || fn).slice(0, 60));
  }
}

console.log('Wireless products count:', wirelessNames.length);
console.log('Samples:');
wirelessNames.slice(0, 20).forEach(function(x) { console.log(x); });
