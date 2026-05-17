const fs = require('fs');
const vm = require('vm');

function parseWithVM(content) {
  const exportIdx = content.indexOf('export const');
  if (exportIdx === -1) return null;
  const fromExport = content.substring(exportIdx);
  
  // Replace export const XX = [ with const __data = [
  const body = fromExport.replace(/^export\s+const\s+[^\s=]+(\s*=\s*)(\[)/, 'const __data = $2');
  
  // Fix SVG quotes
  const fixed = body.replace(/="([h<#\/])/g, '=\\"$1');
  
  console.log('Fixed body first 120:', JSON.stringify(fixed.substring(0, 120)));
  console.log('... last 60:', JSON.stringify(fixed.substring(fixed.length - 60)));

  // Use runInNewContext which handles sandbox properly
  try {
    const result = vm.runInNewContext(fixed);
    if (result) {
      console.log('✅ Got result directly:', Array.isArray(result) ? result.length + ' items' : typeof result);
      return result;
    }
  } catch(e) {
    console.log('❌ vm error:', e.message.substring(0, 100));
    return null;
  }
  
  return null;
}

const file = 'src/data/setevye-patch-kordy.js';
const content = fs.readFileSync(file, 'utf8');
const data = parseWithVM(content);
console.log('Final result:', data?.length || 0, 'items');
