// ultra_simple_fix.cjs
// For each "image" field with svg+xml content that has \" as text attributes:
// Replace ALL occurrences of \\" with \\'
// This is the SIMPLEST fix: any \\" in the SVG attribute (within the image value)
// gets replaced with \\' (still 3 chars, but now a single-quote instead of a double-quote)

const fs = require('fs');
const dir = 'src/data/';

let cnt = 0;
const all = fs.readdirSync(dir).filter(f => f.endsWith('.js'));

for (const f of all) {
  const raw = fs.readFileSync(dir + f, 'utf8');
  if (!raw.includes('"image"') || !raw.includes('svg+xml,') || !raw.includes('\\"')) continue;

  let result = raw;
  // For each occurrence of \" in the raw file
  // (where \" = literal backslash followed by double-quote), replace with \'

  // Strategy: Count ALL backslash-double-quote pairs in the value content
  // If any exist, fix ALL at once using a regex
  // Simple regex: matches `\"` and replaces with `\'`

  let prev = result;
  let iterations = 0;
  while (true) {
    let next = '';
    let changed = false;
    for (let i = 0; i < result.length; i++) {
      if (i < result.length - 1 && result[i] === '\\' && result[i + 1] === '"') {
        // Replace with `\` + `'`
        next += '\\\'';
        i++;
        changed = true;
        iterations++;
      } else {
        next += result[i];
      }
    }
    result = next;
    if (!changed) break;
  }

  if (iterations > 0) {
    fs.writeFileSync(dir + f, result, 'utf8');
    cnt++;
    console.log(f + ': ' + iterations + ' replacements');
  }
}

console.log('Done! Fixed ' + cnt + ' files.');
