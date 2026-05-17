const fs = require('fs');
const vm = require('vm');

function parseWithVM(content) {
  // Remove ALL leading comment lines (// or /* */ at start)
  let fixed = content.replace(/^\s*(?:\/\/[^\n]*\n|\/\*[\s\S]*?\*\/\s*\n)+/, '');
  
  // Fix SVG quotes
  fixed = fixed.replace(/="([h<#\/])/g, '=\\"$1');
  
  // Replace export const XX = [ with const __data = [
  fixed = fixed.replace(/^export\s+const\s+[^\s=]+\s*=\s*(\[)/, 'const __data = $1');
  
  // Show first 80 chars
  console.log('Fixed start:', JSON.stringify(fixed.substring(0, 80)));
  
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
} catch(e) {
  console.log('❌', e.message.substring(0, 100));
}
