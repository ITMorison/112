#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🔍 Pre-Deploy Validation — ServerNet\n');

let errors = 0;
let warnings = 0;

// 1. Check critical files exist
console.log('📁 Checking critical files...');
const requiredFiles = [
  'src/App.jsx',
  'src/main.jsx',
  'src/data.js',
  'src/components/HomePage.jsx',
  'src/components/CatalogPage.jsx',
  'src/components/ProductCard.jsx',
  'src/components/Header.jsx',
  'src/components/Footer.jsx',
  'src/components/AdminDashboard.jsx',
  'index.html',
  'package.json',
  'vite.config.js'
];

requiredFiles.forEach(file => {
  const fullPath = path.join(rootDir, file);
  if (fs.existsSync(fullPath)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} — MISSING`);
    errors++;
  }
});

// 2. Check for unused imports in HeroSection (should have no useState/Chevron)
console.log('\n🔧 Checking HeroSection cleanup...');
const heroPath = path.join(rootDir, 'src/components/HeroSection.jsx');
const heroContent = fs.readFileSync(heroPath, 'utf-8');
if (heroContent.includes('useState')) {
  console.log('  ⚠️  HeroSection still uses useState — may have leftover slider code');
  warnings++;
} else {
  console.log('  ✅ HeroSection: no useState (slider removed)');
}
if (heroContent.includes('ChevronLeft') || heroContent.includes('ChevronRight')) {
  console.log('  ⚠️  HeroSection still imports Chevron icons');
  warnings++;
} else {
  console.log('  ✅ HeroSection: no Chevron imports');
}

// 3. Check images
console.log('\n🖼️  Checking images...');
const publicDir = path.join(rootDir, 'public');
const photoDir = path.join(publicDir, 'photo');

if (fs.existsSync(photoDir)) {
  const categories = fs.readdirSync(photoDir).filter(f => fs.statSync(path.join(photoDir, f)).isDirectory());
  console.log(`  ✅ /photo/ directories: ${categories.join(', ')}`);
  categories.forEach(cat => {
    const catDir = path.join(photoDir, cat);
    const count = fs.readdirSync(catDir).length;
    console.log(`     - ${cat}: ${count} images`);
  });
} else {
  console.log('  ⚠️  /photo/ directory not found');
  warnings++;
}

// 4. Check scripts exist
console.log('\n📜 Checking utility scripts...');
const scripts = [
  'scripts/organize-images.js',
  'scripts/download-images.js',
  'scripts/generate-sitemap.js'
];
scripts.forEach(script => {
  if (fs.existsSync(path.join(rootDir, script))) {
    console.log(`  ✅ ${script}`);
  } else {
    console.log(`  ❌ ${script} — MISSING`);
    errors++;
  }
});

// 5. Check for slider remnants
console.log('\n🔍 Checking for leftover slider code...');
const sliderPatterns = [
  { pattern: 'useState.*current', file: 'HeroSection.jsx' },
  { pattern: 'ChevronLeft', file: 'HeroSection.jsx' },
  { pattern: 'ChevronRight', file: 'HeroSection.jsx' },
  { pattern: 'group-hover:opacity-100', file: 'HeroSection.jsx' }  // hover reveal controls
];
sliderPatterns.forEach(check => {
  const fpath = path.join(rootDir, 'src/components', check.file);
  if (fs.existsSync(fpath)) {
    const content = fs.readFileSync(fpath, 'utf-8');
    if (content.includes(check.pattern)) {
      console.log(`  ⚠️  Found "${check.pattern}" in ${check.file}`);
      warnings++;
    } else {
      console.log(`  ✅ No "${check.pattern}" in ${check.file}`);
    }
  }
});

// 6. Check meta tags
console.log('\n🌐 Checking SEO meta in index.html...');
const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
const metaChecks = [
  { tag: 'meta name="description"', name: 'Description' },
  { tag: 'meta property="og:', name: 'Open Graph' },
  { tag: 'twitter:card', name: 'Twitter Card' },
  { tag: 'sitemap.xml', name: 'Sitemap reference' }
];
metaChecks.forEach(check => {
  if (indexHtml.includes(check.tag)) {
    console.log(`  ✅ ${check.name} present`);
  } else {
    console.log(`  ⚠️  ${check.name} missing`);
    warnings++;
  }
});

// 7. Bundle size estimate
console.log('\n📦 Dependencies check...');
const pkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8'));
console.log(`  📦 Dependencies: ${Object.keys(pkg.dependencies || {}).length} packages`);
console.log(`  🔧 DevDependencies: ${Object.keys(pkg.devDependencies || {}).length} packages`);

// 8. Build test (optional, slow)
console.log('\n🏗️  Ready to build? Run: npm run build');

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 VALIDATION SUMMARY');
console.log('='.repeat(50));
console.log(`  ❌ Errors:   ${errors}`);
console.log(`  ⚠️  Warnings: ${warnings}`);
console.log(`\n${errors === 0 ? '✅ Ready for production build!' : '❌ Fix errors before deploying.'}`);
console.log('\n💡 Next steps:');
console.log('   1. npm run build');
console.log('   2. npm run preview');
console.log('   3. Deploy to Vercel/Netlify/Railway');

process.exit(errors > 0 ? 1 : 0);
