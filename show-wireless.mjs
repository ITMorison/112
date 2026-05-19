import { PRODUCTS } from './src/data.js';

// 'беспроводные телефоны' = б+е+с+п+р+о+в+о+д+н+ы+е т+е+л+е+ф+о+н+ы
const B = 'б\u0435\u0441\u043f\u0440\u043e\u0432\u043e\u0434\u043d';
const wireless = PRODUCTS.filter(function(p) { 
  return new RegExp(B, 'iu').test(p.title || p.description || '');
});

console.log('Wireless产品的数量:', wireless.length);
