import fs from 'fs';
import path from 'path';

const postsDir = path.join(process.cwd(), 'public', 'posts');
const files = fs.readdirSync(postsDir);

files.forEach(file => {
  const filePath = path.join(postsDir, file);
  const stats = fs.statSync(filePath);
  
  if (stats.isFile() && (file.endsWith('.md') || file.endsWith('.html'))) {
    let content = fs.readFileSync(filePath, 'utf-8');
    
    if (content.startsWith('---')) {
      const parts = content.split('---');
      if (parts.length >= 3) {
        let frontmatter = parts[1];
        const rest = parts.slice(2).join('---');
        
        // Match title: "something.md" or title: "something.html" or title: something.md
        // We want to remove .md or .html but keep the rest of the title
        frontmatter = frontmatter.replace(/(title:\s*["']?)(.*?)\.(md|html)(["']?\s*(\n|$))/, '$1$2$4');
        
        content = `---${frontmatter}---${rest}`;
        fs.writeFileSync(filePath, content);
        console.log(`Cleaned title in ${file}`);
      }
    }
  }
});
