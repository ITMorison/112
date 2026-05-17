const fs = require('fs');
const vm = require('vm');
const content = fs.readFileSync('src/data/16-канальные-hd-видеорегистраторы.js', 'utf8');

// Test 1: vm.runInContext with original content
try {
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(content, sandbox);
  console.log('vm OK, items:', sandbox['16_КАНАЛЬНЫЕ_HD_ВИДЕОРЕГИСТРАТОРЫ'].length);
} catch(e) {
  console.log('vm error:', e.message.substring(0, 100));
}

// Test 2: eval of the full content
try {
  const evalResult = eval(content);
  console.log('eval OK');
} catch(e) {
  console.log('eval error:', e.message.substring(0, 100));
}

// Test 3: new Function with full content
try {
  const f = new Function(content);
  f();
  console.log('Function OK');
} catch(e) {
  console.log('Function error:', e.message.substring(0, 100));
}
