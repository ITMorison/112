const fs = require('fs');
const vm = require('vm');

function parseWithVM(content) {
  // 1. Remove comments
  let clean = content.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
  
  // 2. Show what's at start
  console.log('After removing comments, first 60:', JSON.stringify(clean.substring(0, 60)));
  
  // 3. Replace export const XX = [ with const __data = [
  clean = clean.replace(/^export\s+const\s+[^\s=]+\s*=\s*(\[)/, 'const __data = $1');
  
  console.log('After export replace, first 60:', JSON.stringify(clean.substring(0, 60)));
  
  // 4. Run
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
} catch(e) {
  console.log('❌', e.message.substring(0, 100));
}
