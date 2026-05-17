const fs = require('fs');
const files = ['neupravlyaemye-stoechnye.js', '16-канальные-hd-видеорегистраторы.js', 'setevye-patch-kordy.js', '123.js'];
let loaded = 0, failed = 0;

files.forEach(f => {
  const c = fs.readFileSync('src/data/' + f, 'utf8');
  if (!c.includes('"http://')) {
    // Simple file without SVG http: just parse with JSON
    const startIdx = c.indexOf('[');
    const endIdx = c.lastIndexOf(']');
    const arr = c.substring(startIdx, endIdx + 1);
    try {
      const items = JSON.parse(arr);
      console.log('✅', f, '-', items.length, 'items');
      loaded += items.length;
    } catch(e) {
      console.log('❌', f, '-', e.message.substring(0, 60));
      failed++;
    }
  } else {
    console.log('⚠️  ', f, '- has "http://", needs special handling');
    failed++;
  }
});
console.log(`\nLoaded: ${loaded}, Failed: ${failed}`);
