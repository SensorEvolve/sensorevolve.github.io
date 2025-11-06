# Git Commands for 10TH Portfolio

## Current Setup
- **Repository:** SensorEvolve/website
- **Branch:** claude/create-10th-portfolio-site-011CUrSh661eg2RpGW91gS6B
- **Folder:** 10TH/

---

## 📋 Essential Git Commands

### Check Status
```bash
# See what files have changed
git status

# See current branch
git branch
```

### Making Changes
```bash
# 1. After editing files, check what changed
git status

# 2. Stage your changes
git add 10TH/              # Add entire folder
# OR
git add 10TH/index.html    # Add specific file

# 3. Commit with a message
git commit -m "Updated project images and content"

# 4. Push to GitHub
git push
```

### Viewing Changes
```bash
# See what you've changed (before committing)
git diff 10TH/

# See commit history
git log --oneline

# See last commit details
git log -1
```

### Pulling Latest Changes
```bash
# If working from another machine, pull latest
git pull origin claude/create-10th-portfolio-site-011CUrSh661eg2RpGW91gS6B
```

### Creating a Pull Request
```bash
# After pushing, visit this URL to create PR:
https://github.com/SensorEvolve/website/pull/new/claude/create-10th-portfolio-site-011CUrSh661eg2RpGW91gS6B
```

---

## 🔄 Typical Workflow

### Daily Workflow
```bash
# 1. Make sure you're on the right branch
git branch
# Should show: * claude/create-10th-portfolio-site-011CUrSh661eg2RpGW91gS6B

# 2. Edit your files in 10TH/
# (Use your favorite editor)

# 3. Check what changed
git status

# 4. Add and commit
git add 10TH/
git commit -m "Describe what you changed"

# 5. Push to GitHub
git push
```

### Example: Adding Project Images
```bash
# 1. Copy images to folder
cp ~/Downloads/project1.jpg 10TH/assets/images/

# 2. Update index.html to reference the image
# (Edit the file)

# 3. Stage changes
git add 10TH/assets/images/project1.jpg
git add 10TH/index.html

# 4. Commit
git commit -m "Added project 1 screenshot"

# 5. Push
git push
```

### Example: Updating Multiple Files
```bash
# After editing several files:
git add 10TH/index.html
git add 10TH/assets/css/style.css
git add 10TH/README.md

# Or add all at once:
git add 10TH/

# Commit with descriptive message
git commit -m "Updated contact info and brand colors"

# Push
git push
```

---

## 🆘 Troubleshooting

### If you're not sure what branch you're on:
```bash
git branch
# The current branch has an asterisk (*)
```

### If you need to switch branches:
```bash
# Go to your 10TH branch
git checkout claude/create-10th-portfolio-site-011CUrSh661eg2RpGW91gS6B
```

### If git push fails:
```bash
# Make sure you're up to date first
git pull

# Then try pushing again
git push
```

### If you made a mistake in the last commit:
```bash
# Undo the last commit but keep your changes
git reset --soft HEAD~1

# Then re-commit with the correct message
git commit -m "Correct message here"
git push
```

### Discard all local changes (careful!):
```bash
# This will PERMANENTLY delete your local changes
git checkout -- 10TH/

# Or reset everything to match GitHub
git reset --hard origin/claude/create-10th-portfolio-site-011CUrSh661eg2RpGW91gS6B
```

---

## 📦 Cloning on Another Machine

### First Time Setup
```bash
# 1. Clone the repo
git clone https://github.com/SensorEvolve/website.git

# 2. Enter the directory
cd website

# 3. Checkout your branch
git checkout claude/create-10th-portfolio-site-011CUrSh661eg2RpGW91gS6B

# 4. Now you can work with 10TH/
cd 10TH
```

### Keeping Multiple Machines in Sync
```bash
# On Machine A: After making changes
git add .
git commit -m "Updated content"
git push

# On Machine B: Get the latest changes
git pull
```

---

## 🎯 Quick Reference

| Task | Command |
|------|---------|
| Check status | `git status` |
| Stage all changes | `git add 10TH/` |
| Commit | `git commit -m "message"` |
| Push to GitHub | `git push` |
| Pull from GitHub | `git pull` |
| View history | `git log --oneline` |
| See differences | `git diff` |
| Current branch | `git branch` |

---

## 🔗 Useful Links

- **GitHub Repository:** https://github.com/SensorEvolve/website
- **Your Branch:** https://github.com/SensorEvolve/website/tree/claude/create-10th-portfolio-site-011CUrSh661eg2RpGW91gS6B
- **Create Pull Request:** https://github.com/SensorEvolve/website/pull/new/claude/create-10th-portfolio-site-011CUrSh661eg2RpGW91gS6B

---

## 💡 Tips

1. **Commit often** - Small, frequent commits are better than large ones
2. **Write clear commit messages** - Describe WHAT you changed and WHY
3. **Pull before push** - Always pull latest changes before pushing
4. **Check status regularly** - Use `git status` to see what's changed
5. **Test before committing** - Make sure the site works before committing

---

**Need help?** Just ask! I can help with any git operations.
