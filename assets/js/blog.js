/**
 * Blog & Journal System
 * Loads and displays markdown posts from the blog directory
 */

class BlogSystem {
    constructor() {
        this.posts = [];
        this.currentFilter = 'all';
        this.modal = document.getElementById('post-modal');
        this.init();
    }

    async init() {
        await this.loadPosts();
        this.setupEventListeners();
        this.renderPosts();
    }

    async loadPosts() {
        try {
            // Try to load posts index
            const response = await fetch('blog/posts.json');
            if (response.ok) {
                const data = await response.json();
                this.posts = data.posts || [];
            }
        } catch (error) {
            console.log('No posts index found, scanning directories...');
            // If no index, try to scan directories
            await this.scanDirectories();
        }
    }

    async scanDirectories() {
        // Attempt to load markdown files from known locations
        const categories = ['journal', 'notebook'];

        for (const category of categories) {
            try {
                // This is a fallback - in production you'd have a posts.json index
                const response = await fetch(`blog/posts/${category}/`);
                if (response.ok) {
                    // Parse directory listing if available
                    // Note: This requires server directory listing enabled
                }
            } catch (error) {
                console.log(`Could not scan ${category} directory`);
            }
        }
    }

    setupEventListeners() {
        // Filter buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.renderPosts();
            });
        });

        // Modal close
        const closeBtn = document.querySelector('.modal-close');
        const overlay = document.querySelector('.modal-overlay');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }
        if (overlay) {
            overlay.addEventListener('click', () => this.closeModal());
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }

    renderPosts() {
        const container = document.getElementById('posts-container');
        const emptyState = document.getElementById('empty-state');

        // Filter posts
        const filteredPosts = this.currentFilter === 'all'
            ? this.posts
            : this.posts.filter(post => post.category === this.currentFilter);

        // Show empty state if no posts
        if (filteredPosts.length === 0) {
            container.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';

        // Sort posts by date (newest first)
        filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Render post cards
        container.innerHTML = filteredPosts.map(post => this.createPostCard(post)).join('');

        // Add click listeners to post cards
        container.querySelectorAll('.post-card').forEach(card => {
            card.addEventListener('click', () => {
                const slug = card.dataset.slug;
                const post = this.posts.find(p => p.slug === slug);
                this.openPost(post);
            });
        });
    }

    createPostCard(post) {
        const date = new Date(post.date);
        const formattedDate = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `
            <article class="post-card" data-slug="${post.slug}">
                <span class="post-category ${post.category}">
                    ${post.category}
                </span>
                <h3 class="post-title">${post.title}</h3>
                <div class="post-date">
                    <i class="fas fa-calendar"></i>
                    ${formattedDate}
                </div>
                <p class="post-excerpt">${post.excerpt}</p>
                <span class="post-read-more">
                    Read more <i class="fas fa-arrow-right"></i>
                </span>
            </article>
        `;
    }

    async openPost(post) {
        if (!post) return;

        try {
            // Load the markdown content
            const response = await fetch(post.path);
            const markdown = await response.text();

            // Parse markdown to HTML
            const htmlContent = marked.parse(markdown);

            // Render in modal
            const modalPost = document.getElementById('modal-post');
            const date = new Date(post.date);
            const formattedDate = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            modalPost.innerHTML = `
                <div class="post-full-header">
                    <h1 class="post-full-title">${post.title}</h1>
                    <div class="post-full-meta">
                        <span class="post-category ${post.category}">${post.category}</span>
                        <span class="post-date">
                            <i class="fas fa-calendar"></i>
                            ${formattedDate}
                        </span>
                    </div>
                </div>
                <div class="post-full-content">
                    ${htmlContent}
                </div>
            `;

            this.modal.classList.add('active');
            document.body.style.overflow = 'hidden';

        } catch (error) {
            console.error('Error loading post:', error);
            alert('Failed to load post content');
        }
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Initialize blog system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.blogSystem = new BlogSystem();
});
