// ESM test - does Vite/Node handle this file?
import { readFileSync } from 'fs';
import { resolve, join } from 'path';
import { pathToFileURL } from 'url';

// Test reading as ESM
try {
  const m = await import('./src/data/neupravlyaemye-stoechnye.js');
  const key = Object.keys(m)[0];
  console.log('ESM import OK, key:', key, 'items:', m[key].length);
} catch(e) {
  console.log('ESM import error:', e.message);
}

// Test reading as CJS with require
try {
  const cjsPath = join('src', 'data', 'neupravlyaemye-stoechnye.js');
  const m = await import(pathToFileURL(join(__dirname, cjsPath)).href);
  console.log('pathToFileURL import OK, items:', Object.values(m)[0]?.length);
} catch(e) {
  console.log('pathToFileURL error:', e.message);
}
