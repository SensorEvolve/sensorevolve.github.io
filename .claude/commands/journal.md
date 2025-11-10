---
description: Generate today's journal entry from git activity
---

Please create today's journal entry by analyzing my work:

1. **Review Today's Activity:**
   - Look at all git commits made today (use `git log --since="today 00:00" --pretty=format:"%h - %s (%ar)" --author="$(git config user.name)"`)
   - Review the changes made today (use `git diff --stat HEAD@{1.day.ago}..HEAD` and examine key file changes)
   - Check the current branch and any work in progress

2. **Generate Journal Entry:**
   Create a markdown file at `blog/posts/journal/YYYY-MM-DD.md` with:

   **Header:**
   - Title: "Journal - [Date]"
   - Date: Today's date
   - Category: journal

   **Content sections:**
   - **Summary**: 2-3 sentences describing what I worked on today
   - **What I Did**: Bullet points of concrete tasks completed (based on commits and file changes)
   - **Technical Notes**: Any important discoveries, solutions to problems, or things learned
   - **Files Modified**: Key files that were changed
   - **Next Steps**: Any obvious next tasks or TODOs (if apparent from the work)

3. **Format:**
   Use clean markdown formatting with proper headers. Keep it concise but informative.

4. **Important:**
   - Be specific about technical details
   - Highlight any challenges solved or new approaches used
   - Note any configuration changes, new dependencies, or architectural decisions
   - If there were bug fixes, note what the bug was
   - Extract actual technical insights, not generic statements

After creating the entry:
1. Run `node blog/update-index.js` to update the blog posts index
2. Show me the path where the journal was saved
3. Give me a brief preview of what you wrote
4. Confirm the blog index was updated successfully
