const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = "postgresql://neondb_owner:npg_ibA5nXxpJo0c@ep-still-smoke-adkurg9z.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require";
const dataFolder = path.join(__dirname, 'src', 'data');

/**
 * Universal parser for JS array literals with broken quotes.
 * Strategy:
 * 1. Extract the = [...] assignment
 * 2. Replace export with const __data =
 * 3. Escape all ="..." patterns with =\"...\" (handles SVG data URIs)
 * 4. Execute via Function constructor
 */
function parseDataFile(content) {
  const exportIdx = content.indexOf('export const');
  if (exportIdx === -1) return null;
  
  // Get everything from export onwards
  const body = content.substring(exportIdx);
  
  // Replace 'export const XX = [' with 'const __data = ['
  const replaced = body.replace(/^export\s+const\s+[^\s=]+\s*=\s*/, 'const __data = ');
  
  // Escape all ="value" patterns (SVG attributes inside string values)
  const fixed = replaced.replace(/="([^"]*)"/g, '=\\"$1\\"');
  
  return fixed;
}

async function migrate() {
    const client = new Client({ connectionString });
    try {
        await client.connect();
        console.log("✅ Соединение с Neon установлено!");

        const files = fs.readdirSync(dataFolder).filter(file => file.endsWith('.js'));
        console.log(`📂 Найдено файлов: ${files.length}`);

        let totalLoaded = 0;
        let failedFiles = 0;

        for (const file of files) {
            const filePath = path.join(dataFolder, file);
            const content = fs.readFileSync(filePath, 'utf8');
            
            const scriptBody = parseDataFile(content);
            if (!scriptBody) {
                console.log(`⚠️ ${file}: export не найден`);
                failedFiles++;
                continue;
            }

            let products;
            try {
                const fn = new Function(scriptBody + '\nreturn __data;');
                products = fn();
                if (!Array.isArray(products)) throw new Error('не массив');
            } catch(e) {
                console.log(`❌ ${file}:`, e.message.substring(0, 80));
                failedFiles++;
                continue;
            }

            if (products.length === 0) {
              console.log(`ℹ️ ${file}: 0 товаров`);
              continue;
            }

            console.log(`🚀 Загрузка ${products.length} из ${file}...`);

            for (const item of products) {
                const query = `
                    INSERT INTO products (title, price, stock, category, specs)
                    VALUES ($1, $2, $3, $4, $5)
                    ON CONFLICT DO NOTHING
                `;
                const price = parseFloat(String(item.price || 0).replace(/[^0-9.]/g, '')) || 0;
                const stock = parseInt(String(item.stock || 0).replace(/[^0-9]/g, '')) || 0;
                await client.query(query, [
                    item.title || "Без названия", price, stock,
                    file.replace('.js', ''), JSON.stringify(item)
                ]);
            }
            totalLoaded += products.length;
        }
        console.log(`\n✅ Всего загружено: ${totalLoaded} товаров`);
        console.log(`❌ Не удалось: ${failedFiles} файлов`);
    } catch (err) {
        console.error("Ошибка:", err);
    } finally {
        await client.end();
    }
}

migrate();
