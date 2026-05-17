import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = './output_prices';

function parseTabFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/).filter(l => l.trim());
  
  if (lines.length < 2) return { products: [], meta: {} };

  // Detect delimiter: tab-separated (most files)
  const sampleLine = lines[0];
  const isTabDelimited = sampleLine.includes('\t');
  const delimiter = isTabDelimited ? '\t' : '\t'; // all are tab-delimited

  const rows = lines.map(line => line.split(delimiter));

  // Find header row: look for row with "Артикул" or "Наименование"
  let headerRowIndex = -1;
  for (let i = 0; i < Math.min(10, rows.length); i++) {
    const row = rows[i];
    const joined = row.join(' ').toLowerCase();
    if (joined.includes('артикул') && (joined.includes('наименование') || joined.includes('описание'))) {
      headerRowIndex = i;
      break;
    }
  }
  if (headerRowIndex === -1) {
    // Try alternative: row with many columns might be header
    for (let i = 0; i < Math.min(5, rows.length); i++) {
      if (rows[i].length >= 4) {
        headerRowIndex = i;
        break;
      }
    }
  }
  if (headerRowIndex === -1 && rows.length > 0) headerRowIndex = 0;

  const headers = rows[headerRowIndex].map((h, idx) => ({
    index: idx,
    raw: h.trim(),
    clean: h.trim().replace(/\s+/g, ' ').toLowerCase()
  }));

  // Identify columns
  const articulCol = headers.findIndex(h => h.clean.includes('артикул'));
  const nameCol = headers.findIndex(h => 
    h.clean.includes('наименование') || 
    h.clean.includes('описание') || 
    h.clean.includes('товар')
  );
  
  // Price columns: prefer "ррц", "цена сайт", "розница", "дилер"
  const priceCandidates = headers
    .map((h, idx) => ({ ...h, idx }))
    .filter(h => 
      h.clean.includes('ррц') || 
      h.clean.includes('цена') || 
      h.clean.includes('розница') || 
      h.clean.includes('дилер') ||
      h.clean.includes('опт')
    );

  // Choose main price: prefer "цена сайт" or "розница" or first price column
  let mainPriceIdx = priceCandidates.find(p => p.clean.includes('цена сайт') || p.clean.includes('розница'))?.idx
    ?? priceCandidates[0]?.idx
    ?? -1;

  // Category detection: look for rows that are ALL non-numeric and non-price like, short text
  const categoryKeywords = ['радиостанции', 'телефоны', 'кабели', 'коммутаторы', 'гарнитуры', 'адаптеры', 'модули', 'муфты', 'кроссы', 'шнуры', 'патчкорды', 'камеры', 'регистраторы', 'панели', 'серверы', 'сети', 'оптика'];

  const products = [];
  const categories = new Set();

  // Data rows start after header
  for (let i = headerRowIndex + 1; i < rows.length; i++) {
    const row = rows[i];
    
    // Skip empty rows
    if (row.every(cell => !cell.trim())) continue;

    // Detect category row: single non-empty cell with text matching category keywords
    const nonEmptyCells = row.filter(cell => cell.trim());
    if (nonEmptyCells.length === 1 && typeof nonEmptyCells[0] === 'string') {
      const text = nonEmptyCells[0].trim();
      const isNumericLike = /^[\d\s.,]+$/.test(text);
      if (!isNumericLike && text.length < 80) {
        // check if it's product-like or category-like
        const looksLikeCategory = categoryKeywords.some(kw => text.toLowerCase().includes(kw));
        if (looksLikeCategory) {
          categories.add(text);
          continue; // skip category rows from products
        }
      }
    }

    const articul = articulCol >= 0 ? (row[articulCol] || '').trim() : '';
    const name = nameCol >= 0 ? (row[nameCol] || '').trim() : '';
    
    // Skip rows without name
    if (!name) continue;

    // Find best price: take first numeric price column
    let price = 0;
    for (const pc of priceCandidates) {
      const val = (row[pc.idx] || '').toString().trim();
      const num = parseFloat(val.replace(/[^\d.,]/g, '').replace(',', '.'));
      if (!isNaN(num) && num > 0) {
        price = num;
        break;
      }
    }

    // Extract other fields if available
    const brand = typeof row[2] === 'string' ? row[2].trim() : '';
    const urlIdx = headers.findIndex(h => h.clean.includes('url'));
    const statusIdx = headers.findIndex(h => h.clean.includes('status'));

    products.push({
      articul,
      name,
      price,
      brand: brand && !brand.toLowerCase().includes('артикул') && !brand.toLowerCase().includes('unnamed') ? brand : '',
      url: urlIdx >= 0 ? row[urlIdx]?.trim() || '' : '',
      status: statusIdx >= 0 ? row[statusIdx]?.trim() || '' : '',
      raw: row
    });
  }

  return { products, meta: { headerRowIndex, headers, priceCandidates, categories: Array.from(categories) } };
}

function parseCableFiles(filePath) {
  // Specialized parser for All_Prof-Telecom files with preambles
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split(/\r?\n/).filter(l => l.trim());
  
  // Find first line with "Артикул" header
  let headerRowIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('Артикул')) {
      headerRowIndex = i;
      break;
    }
  }
  if (headerRowIndex === -1) return { products: [], meta: {} };

  const delimiter = '\t';
  const rows = lines.map(line => line.split(delimiter));
  const headers = rows[headerRowIndex].map(h => h.trim().toLowerCase());

  const articulCol = 0;
  const nameCol = headers.findIndex(h => h.includes('наименование'));
  const priceCols = headers
    .map((h, idx) => ({ idx, h }))
    .filter(p => p.h.includes('диллер') || p.h.includes('розница') || p.h.includes('цена'));

  const products = [];
  for (let i = headerRowIndex + 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length < 2) continue;
    const articul = (row[0] || '').trim();
    if (!articul) continue;

    const name = nameCol >= 0 ? (row[nameCol] || '').trim() : '';
    if (!name) continue;

    // Try to parse any price
    let price = 0;
    for (const pc of priceCols) {
      const val = (row[pc.idx] || '').toString().trim();
      const num = parseFloat(val.replace(/[^\d.,]/g, '').replace(',', '.'));
      if (!isNaN(num) && num > 0) {
        price = num;
        break;
      }
    }

    products.push({ articul, name, price, raw: row });
  }

  return { products, meta: { headerRowIndex, headers, priceCols } };
}

// Main scan
const results = {};

function scanFolder(folder) {
  const dirPath = path.join(OUTPUT_DIR, folder);
  if (!fs.existsSync(dirPath)) return;

  const files = fs.readdirSync(dirPath).filter(f => f.toLowerCase().endsWith('.txt'));
  results[folder] = {};

  for (const file of files) {
    const filePath = path.join(dirPath, file);
    try {
      // Use generic parser
      const parsed = parseTabFile(filePath);
      results[folder][file] = {
        products: parsed.products.length,
        meta: parsed.meta,
        sample: parsed.products.slice(0, 2)
      };
      console.log(`✓ ${folder}/${file}: ${parsed.products.length} products`);
    } catch (e) {
      console.error(`✗ ${folder}/${file}: ${e.message}`);
      results[folder][file] = { error: e.message };
    }
  }
}

// Process: root, subfolders
const rootFiles = fs.readdirSync(OUTPUT_DIR).filter(f => f.toLowerCase().endsWith('.txt'));
results['_root'] = {};
for (const file of rootFiles) {
  const filePath = path.join(OUTPUT_DIR, file);
  try {
    const parsed = parseTabFile(filePath);
    results['_root'][file] = {
      products: parsed.products.length,
      meta: parsed.meta,
      sample: parsed.products.slice(0, 2)
    };
    console.log(`✓ _root/${file}: ${parsed.products.length} products`);
  } catch (e) {
    console.error(`✗ _root/${file}: ${e.message}`);
  }
}

const subfolders = fs.readdirSync(OUTPUT_DIR)
  .filter(f => fs.statSync(path.join(OUTPUT_DIR, f)).isDirectory());

for (const folder of subfolders) {
  scanFolder(folder);
}

// Write summary
fs.writeFileSync('./parsed-summary.json', JSON.stringify(results, null, 2));
console.log('\n✅ Full summary written to parsed-summary.json');
