import { PRODUCTS } from './src/data.js' with { type: "json" };

// Find all products with "бумаг" or "папир" or "резин" (rubber) in name/category
const paper = PRODUCTS.filter(p => 
  /бумаг|папир|резин/i.test(String(p.name||'') + ' ' + String(p.fullName||'') + ' ' + String(p.category_raw||''))
);
console.log('Paper/Rubber/Rel products:', paper.length);
paper.forEach(p => {
  console.log(`[${p.code||p.articul}] category="${p.category}" subcat="${p.subcategory}" cat_raw="${p.category_raw}"`);
  console.log(`  Title: ${p.title}`);
  console.log(`  Image: ${p.image ? p.image.split('/').pop() : 'none'}`);
});
