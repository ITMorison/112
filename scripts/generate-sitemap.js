import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load products
const products = JSON.parse(fs.readFileSync(path.join(rootDir, 'src', 'new-products.json'), 'utf-8'));

// Base URL — change to your domain
const BASE_URL = 'https://server-net.kz';

// Static pages
const staticPages = [
  '/',
  '/catalog',
  '/contacts',
  '/delivery',
  '/payment'
];

// Generate product URLs
const productUrls = products.map(p => `/${p.articul}`).filter((v, i, a) => a.indexOf(v) === i);

// Combine all URLs
const allUrls = [...staticPages, ...productUrls];

// Generate XML
const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
const urlEntries = allUrls.map(url => `  <url>
    <loc>${BASE_URL}${url}</loc>
    <priority>${url === '/' ? '1.0' : '0.6'}</priority>
    <changefreq>${url === '/' ? 'daily' : 'weekly'}</changefreq>
  </url>`).join('\n');
const xmlFooter = `
</urlset>`;

const sitemap = xmlHeader + urlEntries + xmlFooter;

// Write to public/
fs.writeFileSync(path.join(rootDir, 'public', 'sitemap.xml'), sitemap, 'utf-8');

console.log(`✅ Sitemap generated with ${allUrls.length} URLs`);
console.log(`   Saved to: public/sitemap.xml`);
console.log(`   Include in robots.txt or submit to Google Search Console`);
