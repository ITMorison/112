const fs = require('fs');
const dataPath = 'src/data';

// Read all JS data files and extract their exported arrays with sizes
const files = fs.readdirSync(dataPath).filter(f => f.endsWith('.js'));

const results = [];
files.forEach(fname => {
  const fullPath = dataPath + '/' + fname;
  const content = fs.readFileSync(fullPath, 'utf-8');
  
  // Find all exported arrays: each one starts with `export const X = [` and ends with `]`
  const lines = content.split('\n');
  let inExport = false;
  let currentName = '';
  let itemCount = 0;
  
  lines.forEach(line => {
    const exportMatch = line.match(/export\s+const\s+(\w[\w_]*)s?\s*=\s*\[/);
    if (exportMatch) {
      if (inExport && itemCount) results.push({ file: fname, name: currentName, count: itemCount });
      inExport = true;
      currentName = exportMatch[1];
      itemCount = 0;
    }
    if (inExport && line.includes('articul')) itemCount++;
    if (inExport && line.trim() === ']') {
      if (itemCount) results.push({ file: fname, name: currentName, count: itemCount });
      inExport = false;
    }
  });
});

// Print relevant ones sorted by count
const sorted = results
  .filter(r => r.count > 0)
  .filter(r => {
    // Only keep relevant subcategory files
    const all = r.file.replace('.js', '');
    return !/^[0-9]/.test(all);  // Skip numbered ones like 16-канал
  })
  .sort((a, b) => b.count - a.count);

console.log('=== DATA FILES (non-numbered, sorted by size) ===');
const total = sorted.reduce((s, r) => s + r.count, 0);
sorted.forEach(r => console.log(r.file.padEnd(50), '|', String(r.count).padStart(5), r.name));
console.log('Total items:', total);
