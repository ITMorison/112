// fix_all_comprehensive.cjs - Fix ALL unescaped double-quote patterns in SVG image values
const fs = require('fs');
const dir = 'src/data/';
const PREFIX = 'svsg+json,'; // match pattern name

const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
let fixed = 0;
const fixList = [];

for (const f of files) {
  const path = dir + f;
  const content = fs.readFileSync(path, 'utf8');
  if (!content.includes('"image"') || !content.includes('svg+xml,')) continue;

  const lines = content.split('\n');
  let changed = false;
  const newLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.includes('"image"') || !line.includes('svg+xml,')) { newLines.push(line); continue; }

    // Find the image value substring
    const imgIdx = line.indexOf('"image"');
    if (imgIdx < 0) { newLines.push(line); continue; }

    // Find colon after "image:", then opening " of the value, then content
    // Use a simple approach: find all positions of "; then the value opening quote is the
    // third " (positions[2])
    const quotes = [];
    for (let j = 0; j < line.length; j++) {
      if (line[j] === '"') quotes.push(j);
    }

    if (quotes.length < 3) { newLines.push(line); continue; }

    // Position of opening " of the value (third quote = quotes[2])
    const valQ = quotes[2];
    if (valQ < 0) { newLines.push(line); continue; }

    const valStart = valQ + 1;

    // Find the closing " of the value (unescaped)
    let k = 0, closingQ = -1;
    for (let j = valStart; j < line.length; j++) {
      const ch = line[j];
      if (ch === '\\') {k++; continue;}
      if (ch === '"') {
        if (k % 2 === 0) {closingQ = j; break;}
      }
      k = 0;
    }

    if (closingQ < 0) { newLines.push(line); continue; }

    const valContent = line.substring(valStart, closingQ);

    // Check: does the value have broken patterns?
    // Pattern 1: single \ followed by "  → charBackslash + charQuote
    // In the VAR valContent (JS string), this is the two chars: '\' and '"'
    // In JavaScript source code check: valContent.includes('\\"')
    const hasSingleBackslashQuote  = valContent.includes('\\"');
    // Pattern 2: double \\ followed by " → this is harder to detect
    // The PATTERN in the actual file has TWO backslash characters followed by a quote
    // In the var valContent, this is: '\\\\"', in source: '\\\\\\\\"'

    // Actually, let me count occurrences of `\"` differently
    // Count the number of single backslash characters in valContent
    let singleBackslashCount = 0;
    for (let j = 0; j < valContent.length; j++) {
      const ch = valContent[j];
      if (ch === '\\') {
        // Is next char a "?
        if (j + 1 < valContent.length && valContent[j + 1] === '"') {
          singleBackslashCount++;
        } else if (j + 2 < valContent.length && valContent[j+1] === '\\' && valContent[j+2] === '"') {
          // double-backslash-quote pattern: \\" then " → fix to \\'
          // handled separately below
        }
      }
    }

    // Now look for every \$\\ and $\\" pattern
    // Fix approach: walk through valContent and replace any \ followed by " with \ followed by '
    let newVal = '';
    let j = 0;
    let replacements = 0;
    while (j < valContent.length) {
      const ch = valContent[j];
      if (ch === '\\' && j + 1 < valContent.length && valContent[j + 1] === '"') {
        // Replace \" with \'
        newVal += "\\'";
        j += 2;  // skip both \
        replacements++;
      } else {
        newVal += ch;
        j++;
      }
    }

    const before = line.substring(0, valStart);
    const after = line.substring(closingQ);

    if (replacements > 0) {
      newLines.push(before + newVal + after);
      changed = true;
      fixList.push(f + ':' + (i+1) + ' (' + replacements + ' fixes)');
    } else {
      newLines.push(line);
    }
  }

  if (changed) {
    fs.writeFileSync(path, newLines.join('\n'), 'utf8');
    fixed++;
    console.log(`Fixed: ${f}`);
  }
}

console.log(`\n=== FIXED: ${fixed} files ===`);
fixList.slice(0, 20).forEach(f => console.log(f));
