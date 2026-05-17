const fs = require('fs');
const vm = require('vm');

function parseWithVM(content) {
  // Remove ALL leading whitespace and comments before the export
  // Use string replacement for the leading part
  let clean = content.replace(/^\s+/, ''); // trim leading whitespace
  clean = clean.replace(/^export\s+const\s+[^\s=]+\s*=\s*(\[)/, 'const __data = $1');
  
  // Fix SVG quotes
  clean = clean.replace(/="([h<#\/])/g, '=\\"$1');
  
  console.log('First 80 after fixes:', JSON.stringify(clean.substring(0, 80)));

  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(clean, sandbox);
  return sandbox.__data;
}

const file = 'src/data/setevye-patch-kordy.js';
const content = fs.readFileSync(file, 'utf8');
try {
  const data = parseWithVM(content);
  console.log('✅ Items:', data.length);
  console.log('First item:', data[0]?.title);
} catch(e) {
  console.log('❌', e.message.substring(0, 100));
  console.log('First 80 unchanged:', JSON.stringify(content.substring(0, 80)));
}
