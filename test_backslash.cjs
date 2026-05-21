// Test what the sequence \\'120\\' resolves to in JS string
const s1 = "width=\\'400\\'";
console.log('s1 (using \\'):', JSON.stringify(s1), 'length:', s1.length);
for (let i = 0; i < s1.length; i++) {
  console.log(`  [${i}] '${s1[i]}' code=${s1.charCodeAt(i)}`);
}

const s2 = "width=\\'400\\'";
console.log('\ns2 (using \\\'):', JSON.stringify(s2), 'length:', s2.length);
for (let i = 0; i < s2.length; i++) {
  console.log(`  [${i}] '${s2[i]}' code=${s2.charCodeAt(i)}`);
}
