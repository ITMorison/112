const fs = require('fs');

// The 5 files that need fixing, with the construct for their outer string delimiter
// and the SVG inner content
const files = [
  {
    path: 'src/data/mesh-системы.js',
    // outer: " (JS uses double quotes)
    // inner: ' (SVG uses single quotes) — already correct, but verify
    checkOnly: true
  },
  {
    path: 'src/data/ip-telefony.js',
    checkOnly: true
  },
  {
    path: 'src/data/ip-ats-i-shlyuzy.js',
    // outer: " 
    // inner currently has width=\"400\" height=\"300\" — needs fix
    svgInnerFix(s) {
      return s
        .replace(/width=\\"(\d+)\\"/g, "width='$1'")
        .replace(/height=\\"(\d+)\\"/g, "height='$1'")
        .replace(/fill=\\"([^"]*)\\"/g, "fill='$1'")
        .replace(/ x=\\"(\d+)\\"/g, " x='$1'")
        .replace(/ y=\\"(\d+)\\"/g, " y='$1'")
        .replace(/text-anchor=\\"([^"]*)\\"/g, "text-anchor='$1'")
        .replace(/dominant-baseline=\\"([^"]*)\\"/g, "dominant-baseline='$1'")
        .replace(/font-family=\\"([^"]*)\\"/g, "font-family='$1'")
        .replace(/font-size=\\"(\d+)\\"/g, "font-size='$1'");
    }
  },
  {
    path: 'src/data/poe-адаптеры.js',
    // outer: "
    // inner currently has width="400" height="300"
    svgInnerFix(s) {
      return s
        .replace(/width="(\d+)"/g, "width='$1'")
        .replace(/height="(\d+)"/g, "height='$1'")
        .replace(/fill="([^"]*)"/g, "fill='$1'")
        .replace(/ x="(\d+)"/g, " x='$1'")
        .replace(/ y="(\d+)"/g, " y='$1'")
        .replace(/text-anchor="([^"]*)"/g, "text-anchor='$1'")
        .replace(/dominant-baseline="([^"]*)"/g, "dominant-baseline='$1'")
        .replace(/font-family="([^"]*)"/g, "font-family='$1'")
        .replace(/font-size="(\d+)"/g, "font-size='$1'");
    }
  },
  {
    path: 'src/data/neupravlyaemye-soho-poe.js',
    // outer: "
    // inner currently has \\\'400\\" and \\"400\\" and width=\"400\"
    svgInnerFix(s) {
      return s
        .replace(/width=\\\'(\d+)\\\"/g, "width='$1'")
        .replace(/height=\\\'(\d+)\\\"/g, "height='$1'")
        .replace(/width=\\"(\d+)\\"/g, "width='$1'")
        .replace(/height=\\"(\d+)\\"/g, "height='$1'")
        .replace(/fill=\\"([^"]*)\\"/g, "fill='$1'")
        .replace(/ x=\\"(\d+)\\"/g, " x='$1'")
        .replace(/ y=\\"(\d+)\\"/g, " y='$1'")
        .replace(/text-anchor=\\"([^"]*)\\"/g, "text-anchor='$1'")
        .replace(/dominant-baseline=\\"([^"]*)\\"/g, "dominant-baseline='$1'")
        .replace(/font-family=\\"([^"]*)\\"/g, "font-family='$1'")
        .replace(/font-size=\\"(\d+)\\"/g, "font-size='$1'");
    }
  }
];

for (const rule of files) {
  if (rule.checkOnly) continue;
  
  let c = fs.readFileSync(rule.path, 'utf8');
  
  // Replace each "image": "data:image/svg+xml,..." blob
  const NEW = c.replace(
    /"image":\s*"data:image\/svg\+xml,([^"]+)"/g,
    (full, svg) => {
      const fixed = rule.svgInnerFix(svg);
      return `"image": "data:image/svg+xml,${fixed}"`;
    }
  );
  
  fs.writeFileSync(rule.path, NEW, 'utf8');
  console.log(rule.path + ': fixed');
}

// ═══════════════════════════════════════════════════════════════════
// NOW everything should be: outer ", inner '
// Verify
console.log('\n=== VERIFICATION ===');
FILES.forEach(r => {
  const c = fs.readFileSync(r.path, 'utf8');
  const idx = c.indexOf('data:image/svg+xml,');
  if (idx < 0) return;
  const a = c.indexOf('"', idx);
  const b = c.indexOf('"', a + 1);
  const svg = c.substring(a + 1, b);
  const hasBad = svg.includes('"');
  console.log(r.path + (hasBad ? '  BAD' : '  OK') + JSON.stringify(svg.substring(0,80)));
});
