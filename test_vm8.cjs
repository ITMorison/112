const fs = require('fs');
const vm = require('vm');

function parseWithVM(content) {
  // 1. Find where the export statement starts (might not be at very beginning)
  const exportIdx = content.indexOf('export const');
  if (exportIdx === -1) return null;
  
  // 2. Get everything from export onwards
  const fromExport = content.substring(exportIdx);
  
  // 3. Replace the export assignment
  const body = fromExport.replace(/^export\s+const\s+[^\s=]+(\s*=\s*)(\[)/, 'const __data = $2');
  
  // 4. Fix SVG quotes
  const fixed = body.replace(/="([h<#\/])/g, '=\\"$1');
  
  console.log('Fixed body first 80:', JSON.stringify(fixed.substring(0, 80)));

  const sandbox = { __data: null };
  vm.createContext(sandbox);
  vm.runInContext(fixed, sandbox);
  
  return sandbox.__data;
}

const file = 'src/data/setevye-patch-kordy.js';
const content = fs.readFileSync(file, 'utf8');
try {
  const data = parseWithVM(content);
  console.log('✅ Items:', data.length);
  console.log('First title:', data[0]?.title);
} catch(e) {
  console.log('❌', e.message.substring(0, 100));
}
