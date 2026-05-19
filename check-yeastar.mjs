import p3 from './src/price3-products.json' with { type: "json" };
const p = p3.find(x => x.code === 81361);
if (p) {
  console.log('Yeastar S20 raw data:');
  console.log('  name:', p.name);
  console.log('  fullName:', p.fullName);
  console.log('  category_raw:', JSON.stringify(p.category_raw));
  console.log('  category:', JSON.stringify(p.category));
  console.log('  subcategory:', JSON.stringify(p.subcategory));
}