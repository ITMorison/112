import { PRODUCTS } from './src/data.js';
const purpose_map = {
  'videonablyudenie': 'video',
  'domofoniya': 'doorbell',
  'sistemy-kontrolya-dostupa': 'access',
  'ip-telefony': 'ip-phone',
  'pozharnaya-signalizaciya': 'fire',
  'setevoe-oborudovanie': 'network-equip',
  'passivnoe-setevoe': 'passive-net',
  'istochniki-besperebojnogo-pitaniya': 'ups',
  'servernye-shkafi': 'servers',
  'garnitura': 'headsets',
  'wifi-oborudovanie': 'wifi',
  'radiooborudovanie': 'radio',
  'optovolokonaya-produkciya': 'fiber',
};
const catCounts = {};
PRODUCTS.forEach(function(p) {
  const cat = p.category || 'uncategorized';
  catCounts[cat] = (catCounts[cat] || 0) + 1;
});
Object.entries(catCounts).sort(function(a,b) { return b[1]-a[1]; }).forEach(function(e) {
  console.log(e[1].toString().padStart(5), purpose_map[e[0]] || e[0]);
});