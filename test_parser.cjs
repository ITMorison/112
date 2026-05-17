const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = "postgresql://neondb_owner:npg_ibA5nXxpJo0c@ep-still-smoke-adkurg9z.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require";
const dataFolder = path.join(__dirname, 'src', 'data');

/**
 * Custom parser for array literals where inner " break the outer string.
 * Parses comment-filtered array content, token by token.
 * Returns parsed JS array directly (no JSON conversion needed).
 */
function parseMalformedArray(arrContent) {
  let i = 0;
  const result = [];
  let inStr = false, strDelim = '';
  let inLineComment = false, inBlockComment = false;
  let objectCount = 0; // tracks nested {}
  let currentObj = null;

  // Helper: add character to current string
  while (i < arrContent.length) {
    const ch = arrContent[i];
    const look2 = arrContent.substring(i, i + 2);
    const look3 = arrContent.substring(i, i + 3);

    // --- Handle comments ---
    if (inBlockComment) {
      if (look2 === '*/') { i += 2; inBlockComment = false; continue; }
      i++; continue;
    }
    if (inLineComment) {
      if (ch === '\n') { inLineComment = false; }
      i++; continue;
    }
    if (!inStr) {
      if (look2 === '//') { inLineComment = true; i += 2; continue; }
      if (look2 === '/*') { inBlockComment = true; i += 2; continue; }
    }

    // --- Inside a JS string (the value, like "data:image/svg+xml") ---
    if (inStr) {
      // Escape: \\" then \" should keep context
      if (ch === '\\' && arrContent[i+1]) { i += 2; continue; }
      
      // Bare " after = should close the WRONG string — don't do that
      // Instead: check if after this bare " the next content establishes a new string
      // Pattern: a text character immediately after =  — this is a broken " that stays in the value
      if (ch === strDelim) {
        const after = arrContent.substring(i + 1);
        // Try heuristic: bare " is an actual delimiter iff followed by one of: } , ] \n whitespace
        // OR (<</): if followed by SVG/XHTML/XML structure, treat as internal quote
        const trueEnd = after.match(/^[\s}\],]/);
        const isSvgAttrib = after.match(/^(h(tt|ttps|ttps?)|\/[a-z!>]|[#\w])/i);
        
        if (trueEnd || (!isSvgAttrib && !after.startsWith('http'))) {
          inStr = false;
          i++;
          continue;
        }
        // Else treat as internal quote — just skip it (closing the "inner" string
        // and the JS string continues; this " was part of SVG attribute value)
        i++;
        continue;
      }
      i++;
      continue;
    }

    // --- Start of string value ---
    if (ch === '"' || ch === "'") {
      inStr = true;
      strDelim = ch;
      i++;
      continue;
    }

    // --- Skip structural chars outside strings ---
    if (/[\s,\n\r]/.test(ch)) { i++; continue; }
    if (ch === ':') { i++; continue; }
    if (ch === '[') { i++; continue; }
    if (ch === ']') { i++; break; } // end array

    // --- Start of new object { ---
    if (ch === '{') {
      objectCount++;
      // Skip to the closing } by counting brackets
      let depth = 1;
      i++;
      while (i < arrContent.length && depth > 0) {
        const c2 = arrContent[i];
        // Track strings
        if (c2 === '"' || c2 === "'") {
          // Skip over this string
          i++;
          while (i < arrContent.length) {
            if (arrContent[i] === '\\') { i += 2; continue; }
            if (arrContent[i] === c2) { i++; break; }
            i++;
          }
          continue;
        }
        if (c2 === '[' || c2 === '{') depth++;
        else if (c2 === ']' || c2 === '}') depth--;
        i++;
      }
      continue;
    }

    i++; // skip unknowns
  }

  return 'placeholder';
}

// Test on the problematic file
const fs = require('fs');
const c = fs.readFileSync('src/data/neupravlyaemye-stoechnye.js', 'utf8');
const startIdx = c.indexOf('[');
const arr = c.substring(startIdx);

// Test parse pattern
parseMalformedArray(arr);
console.log('Parser ran without infinite loop');

// More targeted: just try to find if the =http pattern is resolvable
console.log('Has =http pattern:', /="[h#]/.test(arr));
console.log('First =http at:', arr.search(/="[h#]/));
