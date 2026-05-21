const fs = require('fs');
const f = 'src/data/ip-ats-i-shlyuzy.js';
const line = fs.readFileSync(f, 'utf8').split('\n')[12];

// Find the image value
const imgIdx = line.indexOf('"image"');
const colonIdx = line.indexOf(':', imgIdx);
const valQ = line.indexOf('"', colonIdx + 1);
const valStart = valQ + 1;

let k = 0, closingQ = -1;
for (let j = valStart; j < 250; j++) {
  if (line[j] === '\\') {k++; continue;}
  if (line[j] === '"') { if (k%2===0) {closingQ=j; break;} }
  k=0;
}
const vc = line.substring(valStart, closingQ);

console.log('vc length:', vc.length);
console.log('vc[0-2] hex:', vc.charCodeAt(0).toString(16), vc.charCodeAt(1).toString(16), vc.charCodeAt(2).toString(16));

// I know vc starts with "data:image/svg+xml,<svg xmlns='..."
// Position in vc: d(0), a(1), t(2), a(3), :(4), i(5), m(6), a(7), g(8), e(9), /(10), s(11), v(12), g(13), +(14), x(15), m(16), l(17), ,(18), <(19), s(20), v(21), g(22), (23), x(24), m(25), l(26), n(27), s(28), =(29), '(30), h(31)...
// So far confirmed: vc[0]='d', vc[1]='a'

// Now looking for what comes after ...s='http://www.w3.org/2000/svg'
// That's 54 chars: "svg xmlns='http://www.w3.org/2000/svg' "
// svg(0-2), space(3), xmlns(4-8), =(9), '(10), http(11-14), ://(15-17), www(18-20), .(21), w3(22-23), .(24), org(25-27), /(28), 2000(29-32), /(33), svg(34-36), '(37), space(38)
// So the width= starts at vc[39]
// " width=" -> space, w, i, d, t, h, =
// Wait, there's a space before width, so at vc[38]=' ' (space), vc[39]='w'

console.log('vc[38-45]:');
for (let j = 38; j < 46; j++) {
  console.log(`  [${j}]: ${JSON.stringify(vc[j])} U+${vc.charCodeAt(j).toString(16)}`);
}

// vc[43] should be =, vc[44] should be \, vc[45] should be \, vc[46] should be "
// Let me check those positions
for (let j = 40; j < 50; j++) {
  console.log(`  [${j}]: ${JSON.stringify(vc[j])} U+${vc.charCodeAt(j).toString(16)}`);
}

console.log('\nLet me also just count occurrences of [\] in vc:');
let backslashCount = 0;
for (let j = 0; j < vc.length; j++) {
  if (vc[j] === '\\') backslashCount++;
}
console.log('backslashCount:', backslashCount);

console.log('\nIs vc[44] a backslash? vc[44]===\\ :', vc[44] === '\\');
console.log('Is vc[45] a backslash? vc[45]===\\ :', vc[45] === '\\');
console.log('Is vc[46] a quote? vc[46]===" :', vc[46] === '"');
