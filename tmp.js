const fs = require("fs");
const products = JSON.parse(fs.readFileSync("./src/price3-products.json", "utf8"));
const other = products.filter(p => p.category === "other" && p.price > 0);
const counts = {};
for (const p of other) counts[p.category_raw] = (counts[p.category_raw]||0) + 1;
console.log("OTHER PRODUCTS COUNT:", other.length);
console.log("TOP RAW VALUES:");
Object.entries(counts).sort((a,b) => b[1] - a[1]).slice(0,15).forEach(([k,v]) => console.log(v + " - " + k));
