const fs = require('fs');
const path2 = 'src/data';
const files = fs.readdirSync(path2).filter(f => f.endsWith('.js'));

// Read each file, extract all exported arrays with item count
// and look for the key subcategories
results = [];
files.forEach(fname => {
  const fullPath = path2 + '/' + fname;
  const content = fs.readFileSync(fullPath, 'utf-8');
  
  // Find all exported arrays
  const exportLines = content.split('\n').filter(l => l.includes('export const'));
  exportLines.forEach(line => {
    const m = line.match(/export\s+const\s+(\w[\w_]*)s?\s*=/);
    if (!m) return;
    let baseName = m[1];
    // Try to normalize name
    let normalizedName = baseName.toLowerCase()
      .replace(/_/g, '-')
      .replace(/[0-9]/g, '')
      .replace(/[^\w-]/g, '')
      .replace(/^-+|-+$/g, '')
      .replace(/^[-]+|[-]+$/g, '');
    
    // Count items by counting "articul" occurrences in the array
    const startIdx = content.indexOf('export const ' + baseName + ' = [');
    if (startIdx === -1) return;
    const after = content.substring(startIdx);
    const endIdx = after.indexOf('\n]');
    const arrContent = endIdx === -1 ? after : after.substring(0, endIdx);
    const count = (arrContent.match(/"articul"/g) || []).length;
    
    results.push({ fname, exportName: m[1], exportNameRelaxed: normalizedName, count });
  });
});

// List everything with count>0
results.filter(r => r.count > 0).forEach(r => {
  console.log(r.fname.replace('.js',''), '|', r.exportName, '| items:', r.count);
});
