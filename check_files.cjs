const fs = require('fs');
const files = ['opticheskie-polki-i-krossy.js','optovolokonnye-adaptery-i-rozetki.js','perehodniki.js','pitaniya.js','rozetki-nastennye.js','setevye-instrumenty.js','setevye-patch-kordy.js','setevye-ustroystva-i-oborudovanie.js'];
files.forEach(f => {
  const c = fs.readFileSync('src/data/' + f, 'utf8');
  const hasHttp = c.includes('"http://');
  console.log(f, hasHttp ? 'HAS_HTTP' : 'NO_HTTP', '| lines:', c.split('\n').length);
});
