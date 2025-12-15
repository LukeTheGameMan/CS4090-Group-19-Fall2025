// post.js

/*
    function: getPostIdFromUrl
    Get post_id from URL query parameters
*/
function getPostIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('post_id');
}

/*
    function: loadPost
    Get post data from postId and pass to displayPost
*/
async function loadPost(postId) {
    const container = document.getElementById('post-container');

    if (!postId) {
        container.innerHTML = '<div class="error">No post ID provided.</div>';
        return;
    }

    try {
        const response = await fetch(`/api/v1/post/getpost?post_id=${postId}`, {
            credentials: 'include'
        });

        const data = await response.json();

        if (response.ok && data.success) {
            displayPost(data.post);
        } else {
            container.innerHTML = `<div class="error">${data.error || 'Post not found'}</div>`;
        }
    } catch (error) {
        console.error('Error loading post:', error);
        container.innerHTML = '<div class="error">Failed to load post. Please try again.</div>';
    }
}

/*
    function: displayPost
    Display post information on page
*/
function displayPost(post) {
    const container = document.getElementById('post-container');

    container.innerHTML = `
        <div class="post-container">
            <div class="post-header">
                <h1 class="post-title">${escapeHtml(post.title)}</h1>
                <div class="post-meta">
                    Posted by <span class="post-author">${escapeHtml(post.username)}</span>
                </div>
            </div>
            
            <div class="post-content">${escapeHtml(post.content)}</div>
            
            <div class="post-stats">
                <div class="stat">
                    <span>&#128077;</span>
                    <span>${post.likes_count} likes</span>
                </div>
                <div class="stat">
                    <span>&#128078;</span>
                    <span>${post.dislikes_count} dislikes</span>
                </div>
                <div class="stat">
                    <span>&#128172;</span>
                    <span>${post.comments_count} comments</span>
                </div>
            </div>
        </div>
    `;

    // Update page title
    document.title = post.title;
}

/*
    function: escapeHtml
    Turn input text into pure HTML text to prevent malicious strings.
*/
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Load the post when opened.
const postId = getPostIdFromUrl();
loadPost(postId);