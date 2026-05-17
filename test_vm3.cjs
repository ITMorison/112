const fs = require('fs');
const vm = require('vm');

function parseWithVM(content) {
  // 1. Remove // comments at start of lines
  let fixed = content.replace(/^(?:\s*\/\/.*\n?)+/gm, '');
  
  // 2. Replace ="http etc with =\"http
  fixed = fixed.replace(/="([h<#\/])/g, '=\\"$1');
  
  // 3. Replace export const XX = [ with const __data = [
  fixed = fixed.replace(/^export\s+const\s+[^\s=]+\s*=\s*/, 'const __data = ');
  
  // Debug: check if export is gone
  console.log('First 80 chars of fixed:', JSON.stringify(fixed.substring(0, 80)));
  
  // 4. Run in VM
  const sandbox = { __data: null };
  vm.createContext(sandbox);
  vm.runInContext(fixed, sandbox);
  
  return sandbox.__data;
}

const file = 'src/data/setevye-patch-kordy.js';
const content = fs.readFileSync(file, 'utf8');
console.log('Original first 80:', JSON.stringify(content.substring(0, 80)));
try {
  const data = parseWithVM(content);
  console.log('✅ Items:', data.length);
} catch(e) {
  console.log('❌ Error:', e.message.substring(0, 100));
}
