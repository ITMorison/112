import { createRequire } from 'module';
const require = createRequire('src/data/16-канальные-ip-видеокамеры.js');

// Test with dynamic import 
try {
  const m = await import('./src/data/16-канальные-hd-видеорегистраторы.js');
  console.log('OK:', Object.keys(m)[0]);
} catch(e) {
  console.log('Error:', e.message.substring(0, 150));
}
