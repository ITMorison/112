const fs = require('fs');
const vm = require('vm');

function parseWithVM(content) {
  // 1. Remove // comments (but not inside strings — VM handles that)
  let fixed = content.replace(/\/\/.*$/gm, '');
  
  // 2. Replace ="http etc with =\"http — escape inner SVG attribute quotes
  fixed = fixed.replace(/="([h<#\/])/g, '=\\"$1');
  
  // 3. Replace export const XX = [ with const __data = [
  fixed = fixed.replace(/^export\s+const\s+[^\s=]+\s*=\s*/, 'const __data = ');
  
  // 4. Run in VM
  const sandbox = { __data: null };
  vm.createContext(sandbox);
  vm.runInContext(fixed, sandbox);
  
  return sandbox.__data;
}

const files = ['neupravlyaemye-stoechnye.js', '16-канальные-hd-видеорегистраторы.js', 'setevye-patch-kordy.js'];
let ok = 0;

files.forEach(f => {
  const content = fs.readFileSync('src/data/' + f, 'utf8');
  try {
    const data = parseWithVM(content);
    console.log('✅', f.padEnd(45), data.length, 'items');
    ok++;
  } catch(e) {
    console.log('❌', f.padEnd(45), e.message.substring(0, 80));
  }
});

console.log(`\n✅ ${ok} files parsed successfully`);
