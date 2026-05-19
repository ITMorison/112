import p3 from './src/price3-products.json' with { type: "json" };
// Count wireless DECT products
const B = 'б\u0435\u0441\u043f\u0440\u043e\u0432\u043e\u0434\u043d'; // 'бес' part of бес-прода
const D = '\u0434\u0435\u043a\u0442'; // 'дект'
const dect = p3.filter(p => String(p.category_raw || '') === 'dect');

const w = dect.filter(p => {
  const txt = String(p.name || '') + ' ' + String(p.fullName || '');
  return new RegExp(D, 'iu').test(txt) || new RegExp(B, 'iu').test(txt);
});
const nonW = dect.filter(p => {
  const txt = String(p.name || '') + ' ' + String(p.fullName || '');
  return !(new RegExp(D, 'iu').test(txt) || new RegExp(B, 'iu').test(txt));
});

console.log('DECT total:', dect.length, 'with keyword:', w.length, 'no keyword:', nonW.length);
console.log('Samples - keyword:', w.slice(0,5).map(p=>p.code+'|'+String(p.name||'').slice(0,40)));
console.log('Samples - no keyword:', nonW.slice(0,5).map(p=>p.code+'|'+String(p.name||'').slice(0,40)));
