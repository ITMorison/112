// Direct line 13 fixation — no regex, single-target
const fs = require('fs');
const fixLine13In = (p) => {
  const lines = fs.readFileSync(p, 'utf8').split('\n');
  const line = lines[12];
  if (!line) return false;
  console.log(`\n${p} line13 BEFORE:`, JSON.stringify(line.substring(0, 100)));

  // Replace only line 13, fixing all " inside SVG data URL to '
  // Strategy: find "image": "...svg..." and clean the inner SVG
  
  // Find the SVG blob
  const idx = line.indexOf("data:image/svg+xml,");
  if (idx < 0) return false;

  // Find outer string delimiter (the quote right before data:...)
  const before = line.substring(0, idx);
  const outerOpenPos = before.lastIndexOf('"');
  if (outerOpenPos < 0) return false;
  const outerOpen = line[outerOpenPos]; // should be " or '

  // Always target fixing for " outer delimiter case (all 5 target files use ")
  const outerClose = '"';

  // Find the after part: from </svg> to end
  // Find what closes the string: next " or ' after </svg>
  const svgIdx = line.indexOf('</svg>', idx);
  if (svgIdx < 0) return false;

  // Find closing quote position
  let j;
  for (j = svgIdx + 6; j < line.length; j++) {
    if (line[j] === '"') break;
  }
  if (j >= line.length) return false;

  // The JS outer string WITHOUT the closing "
  const jsString = line.substring(outerOpenPos, j);
  // The inner SVG content (without outer delims)
  const prefix = "data:image/svg+xml,";
  const svgStartPos = jsString.indexOf(prefix) + prefix.length;
  const svgInner = jsString.substring(svgStartPos);

  const FIXED = svgInner.replace(/'/g, '"').replace(/"/g, "'");

  const newLine = line.substring(0, outerOpenPos + prefix.length) + FIXED + line.substring(j);

  lines[12] = newLine;
  fs.writeFileSync(p, lines.join('\n'), 'utf8');
  console.log(`${p} line13 AFTER:`, JSON.stringify(lines[12].substring(0, 100)));
  return true;
};

const FILES = [
  'src/data/mesh-системы.js',
  'src/data/ip-telefony.js',
  'src/data/ip-ats-i-shlyuzy.js',
  'src/data/poe-адаптеры.js',
  'src/data/neupravlyaemye-soho-poe.js',
  'src/data/upravlyaemye-soho-poe.js',
];

FILES.forEach(p => fixLine13In(p));
