# Blog & Journal System

This directory contains the blog and journal system for the 10TH portfolio website.

## Structure

```
blog/
├── posts/
│   ├── journal/        # Daily journal entries
│   │   └── YYYY-MM-DD-title.md
│   └── notebook/       # Technical articles and notes
│       └── article-title.md
├── posts.json          # Auto-generated index
└── update-index.js     # Index generator script
```

## Quick Start

### Creating Journal Entries (Automated)

The easiest way to create a journal entry is using the `/journal` slash command in Claude Code:

```bash
/journal
```

This will:
1. Analyze your git commits from today
2. Review what files you changed
3. Generate a complete journal entry with summary and technical notes
4. Save to `blog/posts/journal/YYYY-MM-DD.md`
5. Update the blog index automatically

### Creating Manual Posts

Create a new markdown file in the appropriate directory:

**Journal Entry:**
```bash
blog/posts/journal/2025-11-10-my-entry.md
```

**Notebook Article:**
```bash
blog/posts/notebook/react-optimization-tips.md
```

**Post Format:**
```markdown
# Title of Your Post

First paragraph becomes the excerpt shown on the blog listing page.

## Section 1
Your content here...

## Section 2
More content...
```

### Updating the Index

After creating or modifying posts, update the index:

```bash
node blog/update-index.js
```

This scans all markdown files and updates `posts.json` with metadata.

## Features

### Journal Posts
- Daily work logs automatically generated from git activity
- Documents what you worked on, technical discoveries, and next steps
- Date-based naming (YYYY-MM-DD format)
- Tagged with cyan "journal" badge

### Notebook Posts
- Longer-form technical articles
- Tutorials, guides, and reference material
- Flexible naming and organization
- Tagged with pink "notebook" badge

### Blog Interface
- **Category Filtering**: Filter by All, Journal, or Notebook
- **Modal Viewer**: Click any post to read in full-screen modal
- **Responsive Design**: Works on desktop and mobile
- **Dark Theme**: Matches portfolio aesthetic
- **Markdown Support**: Full markdown rendering with code blocks, lists, etc.

## Markdown Features

The blog system supports full markdown:

- **Headers**: `# H1`, `## H2`, `### H3`
- **Bold**: `**bold text**`
- **Italic**: `*italic text*`
- **Code**: `` `inline code` ``
- **Code Blocks**:
  ```
  \`\`\`javascript
  code here
  \`\`\`
  ```
- **Links**: `[text](url)`
- **Lists**: Use `-` or `1.` for lists
- **Blockquotes**: `> quote text`

## Tips

1. **Date Format**: Use YYYY-MM-DD prefix for journal entries for automatic date extraction
2. **Excerpts**: The first paragraph after the title is used as the excerpt
3. **Commit Often**: More commits = better automated journal entries
4. **Update Index**: Always run `node blog/update-index.js` after creating posts
5. **Test Locally**: Open `blog.html` in a browser to preview

## Automation

The `/journal` command is configured to:
- Run at the end of your work day
- Analyze git history for the day
- Extract technical insights from code changes
- Generate structured journal entries
- Update the blog index automatically

## Future Enhancements

Potential additions:
- Search functionality
- Tag system for better organization
- RSS feed generation
- Comments system
- Analytics integration
