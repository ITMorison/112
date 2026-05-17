const fs = require('fs');

function parseWithFunc(content) {
  const exportIdx = content.indexOf('export const');
  if (exportIdx === -1) return null;
  const fromExport = content.substring(exportIdx);
  const body = fromExport.replace(/^export\s+const\s+[^\s=]+\s*=\s*/, '');
  const fixed = body.replace(/="([h<#\/])/g, '=\\"$1');
  
  console.log('Fixed body first 80:', JSON.stringify(fixed.substring(0, 80)));
  
  try {
    const fn = new Function(fixed + '\nreturn __data;');
    const data = fn();
    console.log('✅ Items:', data.length);
    return data;
  } catch(e) {
    console.log('❌', e.message.substring(0, 100));
    return null;
  }
}

const files = ['setevye-patch-kordy.js', 'neupravlyaemye-stoechnye.js', '16-канальные-hd-видеорегистраторы.js'];
files.forEach(f => {
  console.log('\n---', f, '---');
  const content = fs.readFileSync('src/data/' + f, 'utf8');
  parseWithFunc(content);
});
