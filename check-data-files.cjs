const fs = require('fs');
const path = 'src/data';

// Re-usable status file tracking
const seen = new Set();
function log(msg) { console.log(msg); console.log('\n'); }

// Read each JS file and check its structure
const filesToCheck = [
  'mesh-системы.js',
  'ip-telefony.js',
  'ip-ats-i-shlyuzy.js',
  'poe-адаптеры.js',
  'neupravlyaemye-soho-poe.js',
  'upravlyaemye-soho-poe.js',
  'setevye-patch-kordy.js',
  'shkafy-napolnye-servernye.js',
];

// Also check filenames in data dir for relevant ones
const allFiles = fs.readdirSync(path);
const relevant = allFiles.filter(f => {
  const lc = f.toLowerCase();
  return /mesh|ups|poe|SFP|sfp|patch|klav|button|trans|klimatic|climate|server.cabinet|gibrid|hybrid|ip.phone|ip-tele|ipats|ats/i.test(lc);
});
console.log('=== RELEVANT DATA FILES FOUND ===\n');
relevant.forEach(f => console.log(f));
console.log();

relevant.forEach(fname => {
  let content;
  try {
    content = fs.readFileSync(path + '/' + fname, 'utf-8');
  } catch(e) {
    console.log('ERROR reading', fname, e.message);
    return;
  }
  
  // Extract all exported const vars
  const exports = content.match(/export\s+const\s+(\w+)/g) || [];
  const exportNames = exports.map(e => e.replace(/export\s+const\s+/, ''));
  
  // Look at first few items in each export
  const itemMatches = content.match(/export\s+const\s+\w+\s*=\s*\[[\s\S]*?\n\s+{\s["\n]((?:[^"\n]|\\")*?)[":\s]/g) || [];
  
  console.log(`--- ${fname} ---`);
  console.log('Exported:', exportNames.join(', '));
  
  // Extract first item from each export
  const firstItems = [];
  for (const en of exportNames) {
    const re = new RegExp(`export\\s+const\\s+${en}\\s*=\\s*\\[([\\s\\S]*?)\n\\s*\\]`, 'm');
    const m = content.match(re);
    if (m && m[1]) {
      const firstItemMatch = m[1].match(/\\{([\\s\\S]*?)\\n\\s*\\}/);
      if (firstItemMatch) {
        firstItems.push(`${en}: {${firstItemMatch[1].substring(0, 200)}}`);
      }
    }
  }
  if (firstItems.length) {
    console.log('First items:');
    firstItems.forEach(fi => console.log(' ', fi.substring(0, 250)));
  }
  
  // Count array lengths
  const arrayLenMatches = content.match(/export\s+const\s+\w+\s*=\s*\[$/gm);
  const lines = content.split('\n');
  let inArray = false, currentArr = null, arrLen = 0;
  for (const line of lines) {
    if (/export\s+const/.test(line)) {
      inArray = true; arrLen = 0;
    } else if (inArray && line.trim() === ']') {
      console.log(`Array length (${currentArr}):`, arrLen);
      inArray = false;
    }
    if (inArray && line.includes('articul') || line.includes('"title"')) {
      arrLen++;
    }
  }
  console.log('');
});