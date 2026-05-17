import { useState, useEffect, useCallback } from 'react';
import { CONTACT_INFO, CATEGORIES, CATEGORY_MAP } from '../data';

const CHUNK_SIZE = 2000; // Process 2000 products at a time to avoid stack overflow

// Helper: MD5 hash
function md5Hash(str) {
  if (typeof crypto !== 'undefined' && crypto.createHash) {
    return crypto.createHash('md5').update(String(str)).digest('hex');
  }
  let hash = 0;
  const s = String(str);
  for (let i = 0; i < s.length; i++) {
    const char = s.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(32, '0');
}

// Helper: Extract smart tags
function extractSmartTags(text) {
  const combined = (text || '').toLowerCase();
  const tags = { brand: '', resolution: '', channels: '' };

  const brands = ['hikvision', 'dahua', 'uniview', 'axpro', 'honeywell', 'ajax', 'rcs', 'ritm', 'neptun', 'megafon'];
  for (const brand of brands) {
    if (combined.includes(brand)) {
      tags.brand = brand.charAt(0).toUpperCase() + brand.slice(1);
      break;
    }
  }

  const resMatch = combined.match(/(\d+)(?:\.\d+)?\s*[mм]п/i) || combined.match(/(\d+)\s*mp/i);
  if (resMatch) tags.resolution = resMatch[1] + 'Мп';

  const chanMatch = combined.match(/(\d+)\s*канал/i);
  if (chanMatch) tags.channels = chanMatch[1] + ' канальный';

  return tags;
}

// Process raw product data into enriched product objects
function processProductChunk(rawProducts, startIdx) {
  const result = [];
  const endIdx = Math.min(startIdx + CHUNK_SIZE, rawProducts.length);

  for (let i = startIdx; i < endIdx; i++) {
    const p = rawProducts[i];
    const mapping = CATEGORY_MAP[p.category_raw];
    const cat = mapping ? mapping.category : (p.category || 'other');
    const subcat = mapping ? mapping.subcategory : (p.subcategory || 'other');

    const searchText = (p.name || '') + ' ' + (p.fullName || '');
    const tags = extractSmartTags(searchText);
    const article = p.article || p.code || i;
    const hash = md5Hash(article);

    result.push({
      ...p,
      id: `prod-${p.code || i}-${i}`,
      title: p.name || p.fullName || 'Без названия',
      articul: p.article || String(p.code),
      sku: p.article || String(p.code),
      brand: tags.brand,
      brand_name: tags.brand,
      price: Number(p.price) || 0,
      stock: 10,
      is_available: true,
      category: cat,
      category_raw: p.category_raw,
      image: `/photo/${cat}/${hash}.jpg`,
      image_hash: hash,
      description: p.fullName || p.name || "",
      subcategory: subcat,
      resolution: tags.resolution,
      channels: tags.channels
    });
  }

  return result;
}

// Custom hook for lazy loading products with chunking
export function useLazyProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadedChunks, setLoadedChunks] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let rawData = [];

    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);

        // Fetch raw data
        const response = await fetch('/data/products.json');
        if (!response.ok) throw new Error('Failed to load products data');
        rawData = await response.json();

        // Process in chunks using setTimeout to avoid blocking UI
        const totalChunks = Math.ceil(rawData.length / CHUNK_SIZE);
        const allProducts = [];

        for (let chunk = 0; chunk < totalChunks; chunk++) {
          if (cancelled) break;

          const startIdx = chunk * CHUNK_SIZE;
          const chunkProducts = processProductChunk(rawData, startIdx);
          allProducts.push(...chunkProducts);

          // Update state incrementally
          setProducts([...allProducts]);
          setLoadedChunks(chunk + 1);

          // Yield to event loop
          await new Promise(resolve => setTimeout(resolve, 0));
        }

        if (!cancelled) {
          setProducts(allProducts);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  return { products, loading, error, loadedChunks };
}

// Export for use in components
export { processProductChunk, md5Hash, extractSmartTags, CHUNK_SIZE };
