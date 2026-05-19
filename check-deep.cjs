const fs = require('fs');
const p1 = JSON.parse(fs.readFileSync('src/price1-products.json', 'utf-8'));
const p2 = JSON.parse(fs.readFileSync('src/price2-products.json', 'utf-8'));
const p3 = JSON.parse(fs.readFileSync('src/price3-products.json', 'utf-8'));
const np = JSON.parse(fs.readFileSync('src/new-products.json', 'utf-8'));
const all = [...p1, ...p2, ...p3, ...np];

const raw = (p) => String(p.category_raw || p.category || '').trim();
const name = (p) => String(p.name || p.fullName || '');

// ─── 1) HYBRID RECORDERS (all HД ones + regular "NVR" ones are separate) ─────
// raw categories for 16/8/4/32 канальные HD видеорегистраторы should be гибридные
const hybridRaws = all
  .map(p => raw(p))
  .filter(Boolean)
  .filter(c => {
    const items = all.filter(x => raw(x) === c);
    return items.some(x => /гибрид/i.test(name(x)));
  });
const hybridCategories = [...new Set(hybridRaws)];
console.log('=== RAW CATEGORIES WITH HYBRID PRODUCTS ===');
hybridCategories.forEach(c => {
  const items = all.filter(x => raw(x) === c);
  console.log(`[${items.length}] ${c}`);
});

// ─── 2) Mesh systems ──────────────────────────────────────────────────────────
console.log('\n=== MESH СИСТЕМЫ ===');
const mesh = all.filter(p => raw(p) === 'Mesh системы');
console.log('Count:', mesh.length);
mesh.slice(0, 5).forEach(p => console.log(' ', name(p).substring(0, 80)));

// ─── 3) SIP / IP phones in various categories ─────────────────────────────────
console.log('\n=== SIP | IP АТС | IP Телефоны | GSM LTE Модемы │ Разные шлюзы ===');
const phoneCats = ['1. SIP-телефоны', 'IP АТС и шлюзы', 'IP Телефоны', 'GSM LTE Модемы Роутеры', '8. GSM-VoIP шлюзы', 'FXS/FXO - шлюзы', 'GSM - шлюзы', 'ISDN - шлюзы'];
phoneCats.forEach(cat => {
  const items = all.filter(p => raw(p) === cat);
  console.log(`[${items.length}] ${cat}`);
  items.slice(0,3).forEach(p => console.log('   ', name(p).substring(0, 70)));
});

// ─── 4) Кнопки выхода и гибкие переходы ───────────────────────────────────────
console.log('\n=== КНОПКИ ВЫХОДА ===');
const knopItems = all.filter(p => raw(p) === 'Кнопки выхода и гибкие переходы');
console.log('Count:', knopItems.length);
knopItems.slice(0, 10).forEach(p => console.log(' ', name(p).substring(0, 80), '| price:', p.price));

// ─── 5) Other intercom items not in categoryMap ───────────────────────────────
console.log('\n=== РАЗНЫЕ ДОМОФОННЫЕ КАТЕГОРИИ (не в categoryMap) ===');
const intercomCats = ['Кнопки выхода и гибкие переходы', 'е). Вызывные панели', 'д). Общественные телефоны с клавиатурой', 'з). Телефоны срочного вызова', 'JR100 всепогодные телефоны', 'JR200 общепользовательские телефоны'];
intercomCats.forEach(c => {
  const items = all.filter(p => raw(p) === c);
  if (items.length > 0) console.log(`[${items.length}] ${c}`);
});

// ─── 6) UPS in Без категории ──────────────────────────────────────────────────
console.log('\n=== UPS БЕЗ КАТЕГОРИИ ===');
const upsUncat = all.filter(p => {
  const cat = raw(p);
  if (cat) return false;
  const n = name(p).toLowerCase();
  return /smart[- ]?ups|smartups|online ups|ups online|источник бесперебойн|ups[^a-z]/.test(n);
});
upsUncat.forEach(p => {
  console.log(`  ${p.price || '?'}  ${name(p).substring(0, 70)}`);
});

// ─── 7) UPS raw categories ────────────────────────────────────────────────────
console.log('\n=== UPS-РЕЛЕВАНТНЫЕ КАТЕГОРИИ ===');
const upsCats = all
  .map(p => raw(p))
  .filter(Boolean)
  .filter(c => {
    const items = all.filter(x => raw(x) === c);
    return items.some(x => /ups|ибп|источник бесперезб/.test(name(x).toLowerCase()));
  });
[...new Set(upsCats)].forEach(c => {
  const items = all.filter(x => raw(x) === c);
  console.log(`[${items.length}] ${c}`);
  items.slice(0,2).forEach(p => console.log('   ', name(p).substring(0, 60)));
});

// ─── 8) PoE switches ──────────────────────────────────────────────────────────
console.log('\n=== POE КОММУТАТОРЫ ===');
const poeCategories = all
  .map(p => raw(p))
  .filter(Boolean)
  .filter(c => {
    const items = all.filter(x => raw(x) === c);
    return items.some(x => /poe|инжектор|PoE/.test(name(x)) || /poe/i.test(c));
  });
[...new Set(poeCategories)].forEach(c => {
  const items = all.filter(x => raw(x) === c);
  console.log(`[${items.length}] ${c}`);
  items.slice(0,3).forEach(p => console.log('   ', name(p).substring(0, 70), '| price:', p.price));
});

// ─── 9) Shkafi klimaticheskie ─────────────────────────────────────────────────
console.log('\n=== КЛИМАТИЧЕСКИЕ ШКАФЫ ===');
const klim = all.filter(p => raw(p) === 'Шкафы климатические');
console.log('Count:', klim.length);

// ─── 10) Оптические патч корды ─────────────────────────────────────────────────
console.log('\n=== ОПТИЧЕСКИЕ ПАТЧ КОРДЫ ===');
const optPatch = all.filter(p => {
  const c = raw(p);
  return /оптическ.?[ий] п.?тч|оптоволокон.? п.?тч|оптическ.? патч/.test(c.toLowerCase());
});
console.log('Count (from related cat):', optPatch.length);
const relevant = [...new Set(optPatch.map(p => raw(p)))];
relevant.forEach(c => {
  const items = optPatch.filter(x => raw(x) === c);
  console.log(`[${items.length}] ${c}`);
  items.slice(0,2).forEach(p => console.log('   ', name(p).substring(0, 70)));
});
