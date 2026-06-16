// Quick sanity check for all question generators in index.html.
// Run: node validate.js   (exit 0 = OK, 1 = problems found)
const fs = require('fs');
const html = fs.readFileSync(__dirname + '/index.html', 'utf8');

// Extract the generator block: from `const R=(a,b)` through the one-line `generate()`.
const start = html.indexOf('const R=(a,b)');
const endLine = html.indexOf('function generate(fn,dif)');
const endNL = html.indexOf('\n', endLine);
if (start < 0 || endLine < 0) { console.error('Could not locate generator block in index.html'); process.exit(2); }
const code = html.slice(start, endNL);

let fails = 0;
const loop = `
const fams={};
for(let i=0;i<40000;i++){
  const it=generate(null,0);
  fams[it.fam]=(fams[it.fam]||0)+1;
  if(it.a==null||(typeof it.a==='number'&&!isFinite(it.a))){console.log('BAD answer:',it);globalThis.__fails++;}
  if(typeof it.q!=='string'||it.q.includes('undefined')||it.q.includes('NaN')){console.log('BAD question:',it.q);globalThis.__fails++;}
  if(it.frac&&(!it.sol||String(it.sol).includes('NaN'))){console.log('BAD fraction sol:',it);globalThis.__fails++;}
}
console.log('ran 40000 questions ·', Object.keys(fams).length, 'familias:', Object.keys(fams).sort().join(', '));
`;
globalThis.__fails = 0;
eval(code + loop);
fails = globalThis.__fails;
console.log(fails === 0 ? '✅ ALL OK' : '❌ ' + fails + ' FAILURES');
process.exit(fails ? 1 : 0);
