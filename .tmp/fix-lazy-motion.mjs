import fs from 'fs';

const files = fs.readFileSync(process.argv[2], 'utf8')
  .split('\n')
  .map(l => l.trim())
  .filter(l => l.startsWith('app/') || l.startsWith('features/') || l.startsWith('shared/'))
  .map(l => l.split(':')[0]);

const uniqueFiles = [...new Set(files)];
let touched = 0;

for (const file of uniqueFiles) {
  if (file.endsWith('shared/providers/motion.tsx')) continue;

  let src = fs.readFileSync(file, 'utf8');
  const before = src;

  // import { motion[, AnimatePresence][, ...] } from 'framer-motion' -> swap motion -> m
  src = src.replace(
    /(import\s*\{[^}]*?)\bmotion\b([^}]*?\}\s*from\s*['"]framer-motion['"])/g,
    (_match, pre, post) => `${pre}m${post}`
  );

  // <motion.div>, </motion.span>, motion.create etc -> m.*
  src = src.replace(/\bmotion\./g, 'm.');

  if (src !== before) {
    fs.writeFileSync(file, src, 'utf8');
    touched++;
    console.log(`Fixed ${file}`);
  }
}

console.log(`\nDone. Touched ${touched} files.`);
