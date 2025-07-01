// generate-article.js
const fs = require('fs');
const path = require('path');

const title = process.argv[2] || 'Judul Artikel';
const slug = title.toLowerCase().replace(/\s+/g, '-');
const date = new Date().toISOString().split('T')[0];
const content = process.argv[3] || 'Isi artikel di sini...';

const md = `---
title: "${title}"
date: "${date}"
slug: "${slug}"
---

${content}
`;

const dir = path.join(__dirname, 'content', 'blog');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

fs.writeFileSync(path.join(dir, `${slug}.md`), md);
console.log(`Artikel berhasil dibuat: content/blog/${slug}.md`);
