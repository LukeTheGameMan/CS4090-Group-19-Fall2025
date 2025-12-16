// see_posts.js

let currentPage = 1;
let currentQuery = '';
let currentFilter = 'recent';

/*
    function: displayPosts
    Gives a paginated view of posts, where each page shows 10 posts
    Based on user query, filter (most recent or most liked), and page number
*/
async function displayPosts(query = '', filter = 'recent', page = 1) {
    // Update current state
    currentPage = page;
    currentQuery = query;
    currentFilter = filter;

    const container = document.getElementById('posts-container');
    container.innerHTML = '<div class="loading">Loading...</div>';

    try {
        const params = new URLSearchParams({
            filter,
            page: page.toString()
        });
        if (query) params.append('query', query);

        const response = await fetch(`/api/v1/post/viewposts?${params}`);
        const data = await response.json();

        if (data.success && data.posts.length > 0) {
            container.innerHTML = data.posts.map(post => `
                <div class="post-card">
                    <h3><a href="/post.html?post_id=${post.post_id}">${escapeHtml(post.title)}</a></h3>
                    <p>by ${escapeHtml(post.username)}</p>
                    <div>&#128077; ${post.likes_count}&#9;&#128078; ${post.dislikes_count}&#9;&#128172; ${post.comments_count}</div>
                </div>
            `).join('');
            // &#128077; - thumbs up emoji.
            // &#128078; - thumbs down emoji.
            // &#128172; - speech bubble emoji.

            // Update pagination buttons
            updatePaginationButtons(data.posts.length);
        } else {
            container.innerHTML = '<p>No posts found.</p>';
            updatePaginationButtons(0);
        }
    } catch (error) {
        container.innerHTML = '<p class="error">Failed to load posts.</p>';
        console.error(error);
    }
}

/*
    function: updatePaginationButtons
    Updates displayed page number and page buttons
*/
function updatePaginationButtons(postsCount) {
    const prevButton = document.getElementById('previous-page');
    const nextButton = document.getElementById('next-page');
    const pageInfo = document.getElementById('page-info');

    // Disable previous button on page 1
    prevButton.disabled = currentPage === 1;

    // Disable next button if we got fewer than 10 posts (last page)
    nextButton.disabled = postsCount < 10;

    // Show current page
    if (pageInfo) {
        pageInfo.textContent = `Page ${currentPage}`;
    }
}

// Initial load
displayPosts();

// Search functionality
document.getElementById('search-button').addEventListener('click', () => {
    const query = document.getElementById('search-input').value;
    displayPosts(query, currentFilter, 1); // Reset to page 1 on new search
});

// Filter buttons
document.getElementById('filter-recent')?.addEventListener('click', () => {
    displayPosts(currentQuery, 'recent', 1); // Reset to page 1 on filter change
});

document.getElementById('filter-liked')?.addEventListener('click', () => {
    displayPosts(currentQuery, 'liked', 1); // Reset to page 1 on filter change
});

// Pagination buttons
document.getElementById('next-page').addEventListener('click', () => {
    displayPosts(currentQuery, currentFilter, currentPage + 1);
});

document.getElementById('previous-page').addEventListener('click', () => {
    if (currentPage > 1) {
        displayPosts(currentQuery, currentFilter, currentPage - 1);
    }
});

/*
    function: escapeHtml
    Turn input text into pure HTML text to prevent malicious strings.
*/
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}