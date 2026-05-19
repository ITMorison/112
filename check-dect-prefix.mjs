import p3 from './src/price3-products.json' with { type: "json" };

// Find DECT phones with "DECT-" prefix in name
for (const p of p3) {
  const n = String(p.name || '');
  if (n.toUpperCase().includes('DECT')) {
    console.log(p.code, '|', n.slice(0, 60), '|', p.subcategory);
  }
}
