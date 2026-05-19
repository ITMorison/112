const fs = require('fs');
const path2 = 'src/data';

// List all JS files
const files = fs.readdirSync(path2);
const issues = [];

files.forEach(f => {
  if (!f.endsWith('.js')) return;
  const content = fs.readFileSync(path2 + '/' + f, 'utf-8');
  const exports = content.match(/export\s+const\s+(\w[\w_]*)s?\s*=\s*\[/g);
  if (!exports) {
    issues.push(f + ': no array export found');
    return;
  }
  exports.forEach(exp => {
    const name = exp.replace(/export\s+const\s+/, '').replace(/\s*=\s*\[$/, '').replace(/s$/, '').replace(/С$/, '');
    // Count items by opening brace count per array
    const afterExport = content.substring(content.indexOf(exp) + exp.length);
    const arrayContent = afterExport.substring(0, afterExport.indexOf('\n]'));
    const itemCount = (arrayContent.match(/"articul"/g) || []).length;
    console.log(fname(f) + ' | ' + name + ' | items: ' + itemCount);
  });
});

function fname(f) {
  // shorten long names
  return f.replace(/\.js$/, '');
}
