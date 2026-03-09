import fs from 'fs';
import path from 'path';

const postsDir = './public/posts';
const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

function decodeHtml(html) {
    return html.replace(/&amp;/g, '&')
               .replace(/&lt;/g, '<')
               .replace(/&gt;/g, '>')
               .replace(/&quot;/g, '"')
               .replace(/&#39;/g, "'")
               .replace(/&nbsp;/g, ' ');
}

files.forEach(file => {
    const filePath = path.join(postsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    const lines = content.split('\n');
    let frontmatter = [];
    let body = [];
    let inFrontmatter = false;
    let frontmatterCount = 0;

    for (let line of lines) {
        if (line.trim() === '---') {
            frontmatterCount++;
            inFrontmatter = frontmatterCount === 1;
            frontmatter.push(line);
            continue;
        }
        if (inFrontmatter) {
            frontmatter.push(line);
        } else {
            body.push(line);
        }
    }

    let newBody = [];
    let currentSection = null;

    for (let line of body) {
        let trimmed = line.trim();
        if (!trimmed) continue;

        // Decode HTML entities
        trimmed = decodeHtml(trimmed);

        // Remove leading/trailing formatting like dots or extra spaces
        trimmed = trimmed.replace(/^\.+|\.+$/g, '').trim();

        // Detect Timestamp
        const timestampMatch = trimmed.match(/^(\d{1,2}:\d{2})\s*(.*)/);
        if (timestampMatch) {
            const ts = timestampMatch[1];
            const rest = timestampMatch[2].trim();
            newBody.push(`\n### ${ts} ${rest ? `- ${rest}` : ''}`);
            continue;
        }

        // Detect Metadata (starts with -)
        if (trimmed.startsWith('-')) {
            const metaMatch = trimmed.match(/^-([^:]+):(.*)/);
            if (metaMatch) {
                const key = metaMatch[1].trim();
                const value = metaMatch[2].trim();
                newBody.push(`- **${key}**: ${value}`);
            } else {
                newBody.push(trimmed);
            }
            continue;
        }

        // Detect Note
        if (trimmed.includes('NOTE') || trimmed.includes('BEFORE YOU COMMENT')) {
            newBody.push(`\n> 📌 **NOTE**: ${trimmed.replace(/📌\*?NOTE\*?:?/, '').replace(/^\*/, '').replace(/\*$/, '').trim()}`);
            continue;
        }

        // Links
        if (trimmed.startsWith('http')) {
            newBody.push(`- **Link**: [${trimmed}](${trimmed})`);
            continue;
        }

        // Other lines
        if (trimmed.startsWith('*') && trimmed.endsWith('*')) {
            newBody.push(`\n_${trimmed.slice(1, -1).trim()}_`);
        } else {
            newBody.push(trimmed);
        }
    }

    const newContent = frontmatter.join('\n') + '\n' + newBody.join('\n');
    fs.writeFileSync(filePath, newContent);
    console.log(`Processed ${file}`);
});
