const fs = require('fs');
const vm = require('vm');

function parseWithVM(content) {
  const exportIdx = content.indexOf('export const');
  if (exportIdx === -1) return null;
  const fromExport = content.substring(exportIdx);
  const body = fromExport.replace(/^export\s+const\s+[^\s=]+(\s*=\s*)(\[)/, 'const __data = $2');
  const fixed = body.replace(/="([h<#\/])/g, '=\\"$1');

  console.log('Body ends with:', JSON.stringify(fixed.substring(fixed.length - 60)));
  
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(fixed, sandbox);
  
  return sandbox.__data;
}

const file = 'src/data/setevye-patch-kordy.js';
const content = fs.readFileSync(file, 'utf8');
try {
  const data = parseWithVM(content);
  if (data) console.log('✅ Items:', data.length);
  else console.log('❌ data is null');
} catch(e) {
  console.log('❌', e.message.substring(0, 150));
}
