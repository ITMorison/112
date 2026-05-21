// test_regex.cjs
const raw = `width=\\"400\\" height=\\"300\\"`;
console.log('raw string has', raw.length, 'chars (expected 2 * 9 = 18 for \\\" pairs?)');
console.log('raw:', JSON.stringify(raw));

// Parse the file content
// The file has these raw bytes: w, i, d, t, h, =, \, ", 4, 0, 0, \, "
// That's: `width=\"` (8 chars: width=, then \, then ")
// followed by: `400` 
// followed by: `\"` (2 chars: \, ")
// followed by: ` height=\\"` (12 chars) 

// When we read the file with readFileSync, the value variable contains these raw bytes
// valContent = `width=\"400\" height=\"300\" ...` — but as raw chars (no escaping applied)

// We want to replace the pattern of backslash + quote within the value
// So we look for a \ followed by " character
// Replace each such pair with \ followed by '

const result = raw.replace(/\\"/g, "\\'");
console.log('result:', JSON.stringify(result));
console.log('result chars:', Array.from(result).map(c => c.charCodeAt(0).toString(16)).join(' '));

// Now verify: is the replacement correct?
// \ " → \ '  (backslash followed by single quote)
// The single-quote should NOT terminate the JS string, and should be a valid SVG attribute value

const finalJs = `var x = "${result}";`;
console.log('\nTest JS:\n', finalJs);
try {
  new Function(finalJs);
  console.log('VALID JS!');
} catch (e) {
  console.log('INVALID:', e.message);
}
