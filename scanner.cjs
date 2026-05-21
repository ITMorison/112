// Last approach: just replace ALL `\"` inside SVG data URIs
// The replacement: in any line that has image/svg+xml with `\\" width=\\"`,
// replace the pattern `\\" ` (2 backslash + double quote) with `\\\'`
// in ONLY the width/height/fill/x/y/dominant/font-family/font-size attributes
// This ensures valid JS without breaking the value content

// Actually, simplest: just use JavaScript's built-in string replacement
// Find the VALID pattern `,height=\\"` and replace with `,height=\\`, but that
// requires checking too many patterns.

// Let me just read the file bytes and at the position where it looks like
// `width=\` `"` replace with `width=\` `'`

// Simpler: for ONLY the three erroring files, just read them and print the full line,
// then use a multi-pattern string replace for ALL identified broken patterns.

const fs = require('fs');
const dir = 'src/data/';

const FILES_TO_FIX = [
  // These 6 from the Vite error output
  'mesh-системы.js',
  'ip-telefony.js',
  'ip-ats-i-shlyuzy.js',
  'идентификаторов узлов',
  'образцы запросов коммерческих узлов',
];

// Actually let me just identify ALL files to fix by scanning
const allFiles = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
let matches = allFiles.filter(f => {
  const raw = fs.readFileSync(dir + f, 'utf8');
  return raw.includes('"image"') && raw.includes('svg+xml,');
});

console.log('Files with SVG images:', matches.length);
console.log('Checking first 5:');

matches.slice(0, 5).forEach(f => {
  const raw = fs.readFileSync(dir + f, 'utf8');
  let lc = raw.split('\n').filter(l => l.includes('image') && l.includes('svg+xml,'));

  // Get first image line
  const first = lc[0] || '';
  // Check for border bytes around position k
  const imgIdx = (first || '').indexOf('"image"');
  const ci = (first || '').indexOf(':', imgIdx < 0 ? 0 : imgIdx);
  const vq = (first || '').indexOf('"', ci < 0 ? 0 : ci + 1);
  console.log(`  ${f}: imgQ=${vq}`);
});

console.log('Checking a few known problematic files:');
['ip-ats-i-shlyuzy.js', 'ddr4.js', 'amd.js'].forEach(f => {
  const raw = fs.readFileSync(dir + f, 'utf8');
  const lines = raw.split('\n');
  // Find first SVG line
  const line = lines[li] || lines[0];
  console.log(`  Testing line format for ${f}:`, JSON.stringify(line.substring(0, 70)));
});
