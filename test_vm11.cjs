const fs = require('fs');
const vm = require('vm');

function parseWithVM(content) {
  const exportIdx = content.indexOf('export const');
  if (exportIdx === -1) return null;
  const fromExport = content.substring(exportIdx);
  const body = fromExport.replace(/^export\s+const\s+[^\s=]+(\s*=\s*)(\[)/, 'const __data = $2');
  const fixed = body.replace(/="([h<#\/])/g, '=\\"$1');
  
  // Append return statement
  const script = fixed + '\nreturn __data;';
  
  console.log('Script (first 100):', JSON.stringify(script.substring(0, 100)));
  
  try {
    const result = vm.runInNewContext(script);
    console.log('Result:', Array.isArray(result) ? result.length + ' items' : result);
    return result;
  } catch(e) {
    console.log('❌', e.message.substring(0, 120));
    return null;
  }
}

const file = 'src/data/setevye-patch-kordy.js';
const content = fs.readFileSync(file, 'utf8');
const data = parseWithVM(content);
console.log('Got', data?.length, 'items');
