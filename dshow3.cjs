const fs = require('fs');
const dir = 'src/data/';

function showFile(f) {
  const content = fs.readFileSync(dir + f, 'utf8');
  const lines = content.split('\n');
  let findings = [];

  for (let li = 0; li < Math.min(lines.length, 30); li++) {
    const line = lines[li];
    if (!line.includes('"image"') || !line.includes('svg+xml')) continue;

    // Find 3rd " as opening of value
    let q = 0, valStart = -1;
    for (let j = 0; j < line.length; j++) {
      if (line[j] === '"') { q++; if (q === 3) { valStart = j + 1; break; } }
    }
    if (valStart < 0) continue;

    // Trace for unescaped "
    let k = 0, closing = -1;
    for (let j = valStart; j < line.length; j++) {
      if (line[j] === '\\') {k++; continue;}
      if (line[j] === '"' && k % 2 === 0) { closing = j; break; }
      k = 0;
    }

    if (closing < 0) { findings.push({f, li:li+1, err: 'no closing quote'}); continue; }

    const vc = line.substring(valStart, closing);
    findings.push({f, li:li+1, valStart, closing, vclen: vc.length});

    // Show first 20 chars of vc
    let vcPreview = '';
    for (let i = 0; i < Math.min(vc.length, 20); i++) {
      vcPreview += vc[i];
    }
    findings[findings.length-1].vc_preview = vcPreview;

    // Look for specific \" pattern in vc
    for (let i = 0; i < vc.length-1; i++) {
      if (vc[i] === '\\' && vc[i+1] === '"') {
        findings[findings.length-1].found_at = i;
        break;
      }
    }
    if (!findings[findings.length-1].found_at) findings[findings.length-1].found_at = 'NONE';

    // Val start = position where value content begins.
    // k before closing
    // findings.push({f, li:li+1, valStart, closing, vclen: vc.length, found_at: arr[i]});
    break; // only first matching line
  }

  return findings;
}

const testFiles = [
  'mesh-системы.js', 'ip-telefony.js', 'ip-ats-i-shlyuzy.js',
  'ddr4.js', 'amd.js', '16-канальные-hd-видеорегистраторы.js'
];
for (const f of testFiles) {
  const res = showFile(f);
  res.forEach(r => {
    console.log(`${r.f}: line ${r.li}: valStart=${r.valStart}, closing=${r.closing}, vcLen=${r.vclen}, found_at=${r.found_at}`);
    if (r.vc_preview) console.log(`  First 20: "${r.vc_preview}"`);
  });
}
