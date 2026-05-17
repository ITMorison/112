const { Client } = require('pg');
const express = require('express');
const cors = require('cors');

const PORT = 3001;
const connectionString = "postgresql://neondb_owner:npg_ibA5nXxpJo0c@ep-still-smoke-adkurg9z.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require";

const app = express();
app.use(cors());
app.use(express.json());

const client = new Client({ connectionString });

async function ensureConnected() {
    if (client._connection) return;
    try { await client.connect(); console.log('✅ PostgreSQL connected'); }
    catch (e) { console.error('❌ DB connection failed:', e.message); }
}

// Cache products in memory for 60 seconds
let productsCache = null;
let cacheTime = 0;
const CACHE_TTL = 60000;

async function getAllProducts() {
    const now = Date.now();
    if (productsCache && (now - cacheTime < CACHE_TTL)) {
        return productsCache;
    }

    await ensureConnected();
    try {
        const result = await client.query(`
            SELECT 
                id,
                title,
                price,
                stock,
                category,
                specs,
                created_at,
                updated_at
            FROM products
            ORDER BY id
        `);
        productsCache = result.rows;
        cacheTime = now;
        console.log(`📦 Products cache refreshed: ${result.rows.length} items`);
        return productsCache;
    } catch (err) {
        console.error('❌ Error fetching products:', err.message);
        return productsCache || [];
    }
}

// GET /api/products — all products with optional category/search filter
app.get('/api/products', async (req, res) => {
    try {
        await ensureConnected();
        const { category, search, subcategory, limit, offset } = req.query;
        
        let query = `
            SELECT 
                id,
                title,
                price,
                stock,
                category,
                specs,
                created_at,
                updated_at
            FROM products
            WHERE 1=1
        `;
        const params = [];

        if (category) {
            params.push(category);
            query += ` AND category = $${params.length}`;
        }
        if (subcategory) {
            params.push(subcategory);
            // subcategory is embedded in specs JSON
            query += ` AND specs->>'subcategory' = $${params.length}`;
        }
        if (search) {
            params.push(`%${search}%`);
            query += ` AND (title ILIKE $${params.length} OR specs->>'title' ILIKE $${params.length})`;
        }

        query += ` ORDER BY id`;

        if (limit) {
            params.push(parseInt(limit));
            query += ` LIMIT $${params.length}`;
        }
        if (offset) {
            params.push(parseInt(offset));
            query += ` OFFSET $${params.length}`;
        }

        const result = await client.query(query, params);
        const countResult = await client.query('SELECT COUNT(*) as total FROM products');

        res.json({
            ok: true,
            products: result.rows,
            total: parseInt(countResult.rows[0].total),
            loaded: result.rows.length,
            fromDB: true
        });
    } catch (err) {
        console.error('❌ /api/products error:', err.message);
        res.status(500).json({ ok: false, error: err.message });
    }
});

// GET /api/products/:id — single product
app.get('/api/products/:id', async (req, res) => {
    try {
        await ensureConnected();
        const { id } = req.params;
        const result = await client.query(`
            SELECT * FROM products WHERE id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ ok: false, error: 'Product not found' });
        }
        res.json({ ok: true, product: result.rows[0] });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// GET /api/categories — distinct categories from DB
app.get('/api/categories', async (req, res) => {
    try {
        await ensureConnected();
        const result = await client.query(`
            SELECT DISTINCT category, COUNT(*) as count
            FROM products
            GROUP BY category
            ORDER BY category
        `);
        res.json({ ok: true, categories: result.rows });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// GET /api/stats — DB statistics
app.get('/api/stats', async (req, res) => {
    try {
        await ensureConnected();
        const [total, categories, lowStock] = await Promise.all([
            client.query('SELECT COUNT(*) as cnt FROM products'),
            client.query('SELECT COUNT(DISTINCT category) as cnt FROM products'),
            client.query('SELECT COUNT(*) as cnt FROM products WHERE stock < 10')
        ]);
        res.json({
            ok: true,
            stats: {
                totalProducts: parseInt(total.rows[0].cnt),
                categories: parseInt(categories.rows[0].cnt),
                lowStock: parseInt(lowStock.rows[0].cnt)
            }
        });
    } catch (err) {
        res.status(500).json({ ok: false, error: err.message });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ ok: true, source: 'neon-postgresql', timestamp: new Date().toISOString() });
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down...');
    try { await client.end(); console.log('✅ DB connection closed'); } catch(e) {}
    process.exit(0);
});

app.listen(PORT, () => {
    console.log(`🚀 API server running on http://localhost:${PORT}`);
    console.log(`   GET /api/products    — all products`);
    console.log(`   GET /api/products/:id — single product`);
    console.log(`   GET /api/categories  — categories`);
    console.log(`   GET /api/stats       — statistics`);
    console.log(`   GET /api/health      — health check`);
});
