const fs = require('fs');

const files = [
  {
    path: 'src/data/poe-адаптеры.js',
    transform(c) {
      return c
        .replace(/width="(\d+)"/g, "width='$1'")
        .replace(/height="(\d+)"/g, "height='$1'")
        .replace(/fill="([^"]*)"/g, "fill='$1'")
        .replace(/x="(\d+)"/g, "x='$1'")
        .replace(/y="(\d+)"/g, "y='$1'")
        .replace(/text-anchor="([^"]*)"/g, "text-anchor='$1'")
        .replace(/dominant-baseline="([^"]*)"/g, "dominant-baseline='$1'")
        .replace(/font-family="([^"]*)"/g, "font-family='$1'")
        .replace(/font-size="([^"]*)"/g, "font-size='$1'");
    }
  },
  {
    path: 'src/data/ip-ats-i-shlyuzy.js',
    transform(c) {
      // After Python-stage escaping we have \\  and \\" sequences in the file.
      // Those literally contain: backslash-backslash, then single or double quote
      // Goal: make all SVG attributes use plain single quotes
      return c
        // width=\\'400\\'  → width='400'
        .replace(/width=\\\'(\d+)\\'/g, "width='$1'")
        // height=\\"300\\"  → height='300'   (escaped double-quote form)
        .replace(/height=\\"(\d+)\\"/g, "height='$1'")
        // height=\\'300\\'  → height='300'
        .replace(/height=\\\'(\d+)\\'/g, "height='$1'")
        // fill="%23f1f5f9" width="400"...  (unescaped " that also appear)
        .replace(/fill="([^"]*)"/g, "fill='$1'")
        .replace(/width=\"(\d+)\"/g, "width='$1'")
        .replace(/height=\"(\d+)\"/g, "height='$1'")
        .replace(/x="(\d+)"/g, "x='$1'")
        .replace(/y="(\d+)"/g, "y='$1'")
        .replace(/text-anchor="([^"]*)"/g, "text-anchor='$1'")
        .replace(/dominant-baseline="([^"]*)"/g, "dominant-baseline='$1'");
    }
  },
  {
    path: 'src/data/neupravlyaemye-soho-poe.js',
    transform(c) {
      // width=\\'400\\"  and  width=\\"400\\"
      return c
        .replace(/width=\\?'(\d+)\\?'/g, "width='$1'")
        .replace(/width=\"(\d+)\"/g, "width='$1'")
        .replace(/height=\\?'(\d+)\\?'/g, "height='$1'")
        .replace(/height=\"(\d+)\"/g, "height='$1'")
        .replace(/fill="([^"]*)"/g, "fill='$1'")
        .replace(/x="(\d+)"/g, "x='$1'")
        .replace(/y="(\d+)"/g, "y='$1'")
        .replace(/text-anchor="([^"]*)"/g, "text-anchor='$1'")
        .replace(/dominant-baseline="([^"]*)"/g, "dominant-baseline='$1'");
    }
  }
];

for (const rule of files) {
  let c = fs.readFileSync(rule.path, 'utf8');
  const before = c;
  c = rule.transform(c);
  fs.writeFileSync(rule.path, c, 'utf8');
  console.log(rule.path + ': changed =', before !== c);
}
