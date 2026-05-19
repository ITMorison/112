import p3 from './src/price3-products.json' with { type: "json" };

// Count products in various "1. SIP-телефоных" categories  
const sipMap = { wireless: 0, desktop: 0, other: 0 };
let wirelessCodes = [];

for (const p of p3) {
  const cat = String(p.category_raw || '');
  // Match "1. SIP-телефоные" using substitute for 'о' and 'ы'
  // The raw value in price3: "1. SIP-телефоные"
  if (cat.startsWith('1. SIP-')) {
    const n = String(p.name || '') + ' ' + String(p.fullName || '');
    // wireless indicators: has 'Беспроводн' in name or他的名字里有DECT
    if (n.includes('\u0411\u0435\u0441\u043f\u0440\u043e\u0432\u043e\u0434\u043d') || 
        n.includes('DECT') || n.includes('беспровод')) {
      sipMap.wireless++;
      wirelessCodes.push(p.code);
    } else {
      sipMap.desktop++;
    }
  }
}

console.log('SIP product breakdown:', sipMap);
console.log('Wireless SIP codes:', wirelessCodes.join(','));
