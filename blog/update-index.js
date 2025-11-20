#!/usr/bin/env node

/**
 * Blog Index Updater
 * Scans blog/posts directory and updates posts.json with metadata
 */

const fs = require('fs');
const path = require('path');

const POSTS_DIR = path.join(__dirname, 'posts');
const INDEX_FILE = path.join(__dirname, 'posts.json');

function extractMetadata(filePath, category) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    // Extract title (first h1 or filename)
    let title = path.basename(filePath, '.md')
        .replace(/^\d{4}-\d{2}-\d{2}-/, '')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());

    const titleMatch = content.match(/^#\s+(.+)$/m);
    if (titleMatch) {
        title = titleMatch[1].replace(/^(Journal|Notebook)\s*-\s*/i, '').trim();
    }

    // Extract date from filename (YYYY-MM-DD) or use file modification time
    const dateMatch = path.basename(filePath).match(/^(\d{4}-\d{2}-\d{2})/);
    let date = new Date().toISOString().split('T')[0];
    if (dateMatch) {
        date = dateMatch[1];
    } else {
        const stats = fs.statSync(filePath);
        date = stats.mtime.toISOString().split('T')[0];
    }

    // Extract excerpt (first paragraph after title)
    let excerpt = '';
    let foundTitle = false;
    for (const line of lines) {
        if (line.startsWith('#')) {
            foundTitle = true;
            continue;
        }
        if (foundTitle && line.trim() && !line.startsWith('---') && !line.startsWith('**')) {
            excerpt = line.trim().substring(0, 150);
            if (excerpt.length === 150) excerpt += '...';
            break;
        }
    }

    if (!excerpt) {
        excerpt = 'No description available.';
    }

    const slug = path.basename(filePath, '.md');
    const relativePath = path.relative(path.join(__dirname, '..'), filePath);

    return {
        slug,
        title,
        date,
        category,
        excerpt,
        path: relativePath
    };
}

function scanPosts() {
    const posts = [];
    const categories = ['journal', 'notebook'];

    for (const category of categories) {
        const categoryDir = path.join(POSTS_DIR, category);

        if (!fs.existsSync(categoryDir)) {
            console.log(`Creating directory: ${categoryDir}`);
            fs.mkdirSync(categoryDir, { recursive: true });
            continue;
        }

        const files = fs.readdirSync(categoryDir)
            .filter(file => file.endsWith('.md'));

        for (const file of files) {
            const filePath = path.join(categoryDir, file);
            try {
                const metadata = extractMetadata(filePath, category);
                posts.push(metadata);
                console.log(`✓ Indexed: ${metadata.title}`);
            } catch (error) {
                console.error(`✗ Error processing ${file}:`, error.message);
            }
        }
    }

    // Sort by date (newest first)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    return posts;
}

function updateIndex() {
    console.log('\n📚 Scanning blog posts...\n');

    const posts = scanPosts();

    const index = {
        posts,
        lastUpdated: new Date().toISOString()
    };

    fs.writeFileSync(INDEX_FILE, JSON.stringify(index, null, 2));

    console.log(`\n✅ Index updated successfully!`);
    console.log(`   Total posts: ${posts.length}`);
    console.log(`   Journal entries: ${posts.filter(p => p.category === 'journal').length}`);
    console.log(`   Notebook articles: ${posts.filter(p => p.category === 'notebook').length}`);
    console.log(`\nIndex saved to: ${INDEX_FILE}\n`);
}

// Run the updater
if (require.main === module) {
    updateIndex();
}

module.exports = { updateIndex, scanPosts };
