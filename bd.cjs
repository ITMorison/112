const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = "postgresql://neondb_owner:npg_ibA5nXxpJo0c@ep-still-smoke-adkurg9z.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require";
const dataFolder = path.join(__dirname, 'src', 'data');

/**
 * Convert the broken array content into valid JSON.
 * 
 * The files have a specific breakage pattern:
 *   "title": "data:image/svg+xml,<svg xmlns="http://...">
 * 
 * Here `=`+`"` together (like in `xmlns="`) terminates the outer JS string early,
 * causing a parse error. We need to find these cases and insert an escape `\"`.
 * 
 * Strategy:
 * 1. Track string context (quote-delimited)
 * 2. Replace ALL `="` sequences with `=\"` inside strings
 *    (since `="` is the specific way the break occurs: assignment of string that
 *     itself starts with `"`)
 * 
 * More general: any bare " that appears after `=` inside a string breaks it.
 * So: replace `="` with `=\"` when inside a string context.
 */

function convertBrokenJSArray(arrContent) {
  let i = 0;
  const out = [];
  let inStr = false, strDelim = '';
  let inLineComment = false, inBlockComment = false;

  while (i < arrContent.length) {
    const ch = arrContent[i];

    // Comments
    if (inBlockComment) {
      if (ch === '*' && arrContent[i+1] === '/') { out.push('  '); i += 2; inBlockComment = false; continue; }
      out.push(' '); i++; continue;
    }
    if (inLineComment) {
      if (ch === '\n') { inLineComment = false; out.push('\n'); }
      else { out.push(' '); }
      i++; continue;
    }
    if (!inStr) {
      if (ch === '/' && arrContent[i+1] === '/') { inLineComment = true; i += 2; continue; }
      if (ch === '/' && arrContent[i+1] === '*') { inBlockComment = true; i += 2; continue; }
    }

    // Inside a string
    if (inStr) {
      if (ch === '=' && arrContent[i+1] === '"') {
        // `="` appears — this is the specific breakage pattern!
        // Replace with `=\"` so the string stays open
        out.push('=\\"');
        i += 2;
        continue;
      }
      if (ch === '\\' && arrContent[i+1]) {
        out.push(ch); i++; out.push(arrContent[i]); i++;
        continue;
      }
      if (ch === strDelim) {
        inStr = false;
        out.push(ch);
        i++;
        continue;
      }
      out.push(ch); i++;
      continue;
    }

    // Start of string
    if (ch === '"' || ch === "'") {
      inStr = true; strDelim = ch; out.push(ch); i++; continue;
    }
    if (ch === ':') { out.push(ch); i++; continue; }
    if (/[\n\r,\s]/.test(ch)) { out.push(ch); i++; continue; }
    if (ch === ',') {
      if (arrContent[i+1] === ']' || arrContent[i+1] === '}') { i++; continue; }
      out.push(ch); i++; continue;
    }
    out.push(ch); i++;
  }

  return out.join('');
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
            
            // Find array: look for '= [' then find '['
            const eqIdx = content.indexOf('= [');
            const startIdx = content.indexOf('[', eqIdx >= 0 ? eqIdx : 0);
            if (startIdx === -1) { failedFiles++; continue; }

            const arrContent = content.substring(startIdx);
            
            // Convert broken JS array → valid JSON array
            const jsonStr = convertBrokenJSArray(arrContent);

            let products;
            try {
                JSON.parse(jsonStr); // validate
                products = JSON.parse(jsonStr);
            } catch(e) {
                console.log(`❌ ${file}:`, e.message.substring(0, 100) + '...');
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
