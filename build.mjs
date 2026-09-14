/* build.mjs — inline styles.css + app.js into one shareable HTML file.
   usage: node build.mjs      →  dist/moldoku.html
   no dependencies, no build step for the reader: just open the file. */

import { copyFileSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const html = readFileSync('index.html', 'utf8');
const css = readFileSync('styles.css', 'utf8');
const js = readFileSync('app.js', 'utf8');

// replacer functions, not strings: the sources contain `$$` and `$&`,
// which a string replacement would eat as capture-group syntax.
const out = html
  .replace('<link rel="stylesheet" href="styles.css">', () => '<style>\n' + css + '\n</style>')
  .replace('<script src="app.js"></script>', () => '<script>\n' + js + '\n</script>');

if (out.includes('styles.css') || out.includes('app.js')) {
  console.error('✕ inlining failed — index.html tags did not match');
  process.exit(1);
}

mkdirSync('dist', { recursive: true });
writeFileSync('dist/moldoku.html', out);
writeFileSync('dist/index.html', out); // same file, for static hosts
copyFileSync('og.png', 'dist/og.png'); // link-preview image

console.log('✔ dist/moldoku.html  ' + (Buffer.byteLength(out) / 1024).toFixed(1) + ' kB');
