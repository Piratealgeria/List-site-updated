import fs from 'fs';
import path from 'path';

const postsDir = './public/posts';

try {
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

  for (const file of files) {
    const filePath = path.join(postsDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Separate frontmatter
    // We use a more robust regex for frontmatter
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    if (!match) {
        console.log(`Skipping ${file}: No frontmatter found`);
        continue;
    }
    
    const frontmatter = match[1];
    const body = match[2];
    
    // Process body
    const lines = body.split(/\r?\n/);
    const newLines: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      newLines.push(line);
      
      // If this line is not empty, and the next line is not empty, add an empty line
      // We also check if the current line is not already followed by an empty line
      if (line.trim() !== '' && i < lines.length - 1 && lines[i+1].trim() !== '') {
        newLines.push('');
      }
    }
    
    const newContent = `---\n${frontmatter}\n---\n${newLines.join('\n')}`;
    fs.writeFileSync(filePath, newContent);
    console.log(`Updated ${file}`);
  }
  console.log('Finished processing all posts.');
} catch (error) {
  console.error('Error processing posts:', error);
  process.exit(1);
}
