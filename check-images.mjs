import imageMap from './src/image-map.json' with { type: "json" };

const fileNames = Object.values(imageMap).flat();
console.log('Total image files:', fileNames.length);

// Search for suspicious/category mismatch filenames
const suspicious = fileNames.filter(f => 
  /pap|бумаг|альбом|скетч|ролл|лент|губк|резин|кадр|картина|фото|arrow|icon|blank|hold|tmp/i.test(String(f))
);
console.log('Suspicious filenames:', suspicious.length);
suspicious.forEach(f => console.log(f));

// Show sample images to understand the file naming convention
console.log('\nSample images (first 30):');
fileNames.slice(0, 30).forEach(f => console.log(f));
