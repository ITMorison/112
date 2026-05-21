// bulk_fix.cjs - Replace n backslash-quote sequences within SVG values with single quotes
const fs = require('fs');
const dir = 'src/data/';

const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
let fixed = 0;

for (const f of files) {
  const path = dir + f;
  let content = fs.readFileSync(path, 'utf8');
  const orig = content;

  // Only target files that have image + svg+xml
  if (!content.includes('"image"') || !content.includes('svg+xml,') || !content.includes('\\"')) continue;

  // Find every line/section with an image field. For each,
  // replace the inner \" (atribue quotes in SVG) with \'  (single-quoted SVG attrs)

  // Strategy: line by line
  const lines = content.split('\n');
  let changed = false;

  for (let i = 0; i < Math.min(lines.length, 2000); i++) {
    const line = lines[i];
    if (!line.includes('"image"') || !line.includes('svg+xml,')) continue;

    // The simplest reliable detection: count the total " chars on this line
    const qCount = (line.match(/"/g) || []).length;
    if (qCount < 4) continue;  // need at least 4 quotes for the field structure

    // Find the text between the 2nd and 3rd double quotes
    // "image": "VALUE"
    //   ^1   ^2         ^3 (closing of VALUE)
    const positions = [];
    for (let j = 0; j < line.length; j++) {
      if (line[j] === '"') positions.push(j);
    }

    if (positions.length < 3) continue;

    // positions[0] = start of "image"
    // positions[1] = end of "image"
    // positions[2] = start of value
    const valStart = positions[2] + 1;
    // Find positions[3] which closes the value (unescaped)
    let k = 0, closingPos = -1;
    for (let j = valStart; j < line.length; j++) {
      if (line[j] === '\\') {k++; continue;}
      if (line[j] === '"') {
        if (k % 2 === 0) {closingPos = j; break;}
      }
      k = 0;
    }

    if (closingPos < 0) continue;

    const valContent = line.substring(valStart, closingPos);

    // Replace all \" in the value with \'
    // We assert the value contains svg+xml
    if (!valContent.includes('svg+xml')) continue;
    if (!valContent.includes('\\\\"')) continue; // should contain \" pattern

    // Replace `\"` with `\'';
    // The file has the sequence: backslash, backslash-double-quote
    // Wait, looking at the raw bytes dump: pos 79=\\ pos 80=""
    // That's `\"` in the file. Let me do two character replace.
    // Strategy: the value content has the pattern `\\"` in the REPLACEMENT environment?
    // No, the file has raw `\` and raw `"` — that's 2 chars.

    // The file shows: \\"  => two chars: \, \ followed by ", with pattern \"
    // MEANING: the backslash count check fails because "
    // is preceded by odd # of backslashes (=1)

    // Actually: file has \\ " as raw bytes = ONE backslash + ONE quote
    // C pattern: backslash-quote means escaped quote in JS?
    // No in JS: the \" produces ' in the string but "
    // wait...

    // The simplest fix is to replace \\" in value content with \\'
    // Since the file has the raw sequence \) then \"...
    // Wait. In the file, it's literally:
    // position 79: backslash
    // position 80: double quote

    // So in the valContent string (already extracted from line.substring):
    // valContent[pos-ContentStart] = "\\" (two chars: \ ")
    // JS will interpret "\\" as a backslash followed by a double quote
    // but in the raw string (no JS escaping has been applied), it's just two chars

    // To replace all instances of single-backslash + double-quote with
    // single-backslash + single-quote:
    // valContent.replace('\\"', "\\'")

    // Wait, in JS: '\\"' means: the two characters \ and " in the string.
    // When we do valContent.replace('\\"', "\\'"), 
    // "\\'" means: the two characters \ and ' — but which '?

    // Ugh, escaping hell. Let me just use a different replacement strategy.
    // Replace one at a time by scanning characters.

    let newVal = '';
    let skip = false;
    for (let j = 0; j < valContent.length; j++) {
      if (skip) { skip = false; continue; }
      const ch = valContent[j];
      if (ch === '\\' && j + 1 < valContent.length && valContent[j+1] === '"') {
        // Replace \" with \'
        newVal += "\\'";
        skip = true; // skip the "
      } else {
        newVal += ch;
      }
    }

    const after = line.substring(closingPos);
    lines[i] = line.substring(0, valStart) + newVal + after;
    changed = true;
    fixed++;
  }

  if (changed) {
    fs.writeFileSync(path, lines.join('\n'), 'utf8');
    console.log(`Fixed: ${f}`);
  }
}

console.log(`\nDone. Total fixed attempts: ${fixed}`);
