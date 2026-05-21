const { execSync } = require('child_process');

const files = [
  'src/data/mesh-системы.js',
  'src/data/ip-telefony.js',
  'src/data/ip-ats-i-shlyuzy.js',
  'src/data/poe-адаптеры.js',
  'src/data/neupravlyaemye-soho-poe.js'
];

// Use npm run to check what's available in this project
// Try running Vite typecheck directly
try {
  execSync('npx vite --version', { cwd: process.cwd(), stdio: 'pipe' });
  console.log('vite available');
} catch(e) {
  console.log('vite not available:', e.message.substring(0,60));
}

// Simple syntax validation: read the file and try to parse with acorn
// (or use node --check directly for type=commonjs)
for (const f of files) {
  // node --check works for both CJS and ESM in Node 18+
  try {
    execSync(`node --check "${f}"`, { cwd: process.cwd(), stdio: 'pipe' });
    console.log(f + ': SYNTAX OK');
  } catch(e) {
    console.log(f + ': SYNTAX FAIL -', e.message.substring(0,200).replace(/\n/g, ' '));
  }
}
