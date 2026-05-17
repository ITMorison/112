const fs = require('fs');
const files = ['setevye-patch-kordy.js', 'setevye-ustroystva-i-oborudovanie.js', 'neupravlyaemye-stoechnye.js', '16-канальные-hd-видеорегистраторы.js'];
files.forEach(f => {
  const c = fs.readFileSync('src/data/' + f, 'utf8');
  const hasHttp = c.includes('"http://');
  const hasEscape = c.includes('\\"');
  console.log(f, 'has "http://"', hasHttp, 'has \\"', hasEscape);
});
