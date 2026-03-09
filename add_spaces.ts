import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';

const postsDir = path.join(process.cwd(), 'public', 'posts');

function processFile(filePath: string) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const { data, content: body } = matter(content);
    
    // Process body: split into lines, trim them, filter out empty ones, and join with double newlines
    const lines = body.split('\n');
    const cleanedLines = lines
        .map(line => line.trim())
        .filter(line => line.length > 0);
    
    const newBody = cleanedLines.join('\n\n');
    
    // Reconstruct the file with frontmatter
    const newContent = matter.stringify(newBody, data);
    
    fs.writeFileSync(filePath, newContent);
    console.log(`Processed ${filePath}`);
}

const files = fs.readdirSync(postsDir);
files.forEach(file => {
    if (file.endsWith('.md')) {
        processFile(path.join(postsDir, file));
    }
});
