const fs = require('fs');
const vm = require('vm');

function parseWithVM(content) {
  // Capture leading whitespace+comments before export
  const LEADING = /^(\s*(?:\/\/[^\n]*\n)*\s*(?:\/\*[\s\S]*?\*\/\s*\n)*\s*)/;
  const match = content.match(LEADING);
  const prefix = match ? match[1] : '';
  
  // Replace the export statement
  let fixed = content.replace(/^export\s+const\s+[^\s=]+(\s*=\s*)(\[)/, `${prefix}const __data = $2`);
  
  // Also just try simple removal of all export statements
  fixed = fixed.replace(/^export\s+const\s+[^\s=]+\s*=\s*/, 'const __data = ');
  
  // Fix SVG quotes
  fixed = fixed.replace(/="([h<#\/])/g, '=\\"$1');
  
  console.log('Fixed start:', JSON.stringify(fixed.substring(0, 120)));

  try {
    const sandbox = { __data: null };
    vm.createContext(sandbox);
    vm.runInContext(fixed, sandbox);
    return sandbox.__data;
  } catch(e) {
    console.log('Error at run:', e.message.substring(0, 80));
    // Try another approach: just eval the whole thing without export
    let evalContent = content.replace(/^export\s+const\s+[^\s=]+\s*=\s*/, '');
    evalContent = evalContent.replace(/="([h<#\/])/g, '=\\"$1');
    console.log('Eval start:', JSON.stringify(evalContent.substring(0, 80)));
    // Create a script
    const script = new vm.Script(evalContent);
    const ctx = { __data: null };
    vm.createContext(ctx);
    script.runInContext(ctx);
    return ctx.__data;
  }
}

const file = 'src/data/setevye-patch-kordy.js';
const content = fs.readFileSync(file, 'utf8');
try {
  const data = parseWithVM(content);
  console.log('✅ Items:', data.length);
} catch(e) {
  console.log('❌', e.message.substring(0, 100));
}
