// Use ESM import to test if the module loads
import('src/data/16-канальные-hd-видеорегистраторы.js').then(m => {
  console.log('Loaded OK! Items:', m['16_КАНАЛЬНЫЕ_HD_ВИДЕОРЕГИСТРАТОРЫ'].length);
  console.log('First image:', m['16_КАНАЛЬНЫЕ_HD_ВИДЕОРЕГИСТРАТОРЫ'][0].image.substring(0, 50));
}).catch(e => console.log('Error:', e.message.substring(0, 150)));
