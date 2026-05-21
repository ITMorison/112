// fix_svgs.cjs - Parse source as JS extract, get true string values, write back properly
const fs = require('fs');
const dir = 'src/data/';

function tryParseAsModule(content) {
  const exports = [];
  try {
    // Wrap in eval to get actual JS string values
    const sandboxed = `(function(){ ${content}; return Array.from(arguments[0]) })`;
    // eval is fine since we control the environment
  } catch(e) {}
  // Just use Function constructor to evaluate
  try {
    const fn = new Function(content + '\nreturn ' + VARS[0]);
  } catch(e) {}
}

// Simpler approach: for each file, scan each line for image fields
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));
let fixed = 0;

for (const f of files) {
  const path = dir + f;
  const content = fs.readFileSync(path, 'utf8');
  if (!content.includes('"image"') || !content.includes('svg+xml,')) continue;

  // Look for the pattern: "image": "data:image/svg+xml,..."  (where value ends with ",)
  // The value is the substring from the opening " of the value to the first unescaped " just before ,\n or ]
  const lines = content.split('\n');
  let changed = false;
  let newLines = lines.slice();

  for (let i = 0; i < Math.min(lines.length, 50); i++) {
    const line = lines[i];
    if (!line.includes('"image"') || !line.includes('svg+xml,')) continue;

    // Find "image" positions
    const imgStart = line.indexOf('"image"');
    if (imgStart < 0) continue;

    // Find next " (end of "image"), then next " after that (start of colon/wsp)
    // Then the value opening "
    const afterImg = line.indexOf('"', imgStart + 8);  // end of "image"
    if (afterImg < 0) continue;

    const colonPos = line.indexOf(':', imgStart);
    if (colonPos < 0) continue;

    // Value opening quote = " after colon
    const valQ = line.indexOf('"', colonPos);
    if (valQ < 0 || valQ + 1 >= line.length) continue;

    const valStart = valQ + 1;  // content starts here

    // The JSON-serialized string value content:
    // to get the REAL content, we need to trace to where the string closes
    // and properly handle escape sequences

    // Instead of complex escape handling, let's use a different approach:
    // Find the substring from valStart to the END, and check if it contains the pattern
    // `width=\"` which is the breaking pattern

    // More reliable: find the first literal `"` that's NOT preceded by another `\`
    // in the context AFTER valStart
    let k = 0;
    let closingQ = -1;
    for (let j = valStart; j < line.length; j++) {
      if (line[j] === '\\') { k++; continue; }
      if (line[j] === '"') {
        if (k % 2 === 0) {
          closingQ = j;
          break;
        }
      }
      k = 0;
    }

    if (closingQ < 0) continue;

    // Extract the value content
    const valContent = line.substring(valStart, closingQ);
    const before = line.substring(0, valStart);
    const after = line.substring(closingQ);

    // Check if the value has the broken pattern
    // A broken pattern: single backslash immediately followed by "
    if (!valContent.includes('\\"')) continue;
    // Make sure this isn't a JSON-in-Content thing
    // The pattern is: some text \, then " then text
    // We want to replace ALL \ " pairs in the SVG with \ ' pairs
    // BUT NOT \\ " pairs (double backslash followed by " — that's already fixed stuff)

    const broken = valContent.match(/\\(?!\\)"/g);
    // Actually, this isn't quite right. Let me just be specific:
    // replace every `\x"` where x is NOT a backslash

    // Actually the cleanest: in value content, replace `${x}\"` where x ≠ \ with same but '
    // In the value, every `\"` needs to become `\''
    const fixedValue = valContent.replace(/\\(?=")/g, "\\'");

    if (fixedValue === valContent) continue;  // no change needed

    newLines[i] = before + fixedValue + after;
    changed = true;
  }

  if (changed) {
    const newContent = newLines.join('\n');
    fs.writeFileSync(path, newContent, 'utf8');
    fixed++;
    console.log(`Fixed: ${f}`);
  }
}

console.log(`\nTotal fixed: ${fixed} / ${files.length} data files`);
