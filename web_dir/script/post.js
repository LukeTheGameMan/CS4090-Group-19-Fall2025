// post.js

let currentUser = null;
let currentPostId = null;
let postVoted = false;
const votedComments = new Set();

/*
    function: getPostIdFromUrl
    Get post_id from URL query parameters
*/
function getPostIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('post_id');
}

/*
    function: checkAuthStatus
    Make sure user is authenticated for most of the tasks in this file
*/
async function checkAuthStatus() {
    try {
        const response = await fetch('/api/v1/auth/me', { credentials: 'include' });
        if (response.ok) {
            const data = await response.json();
            currentUser = data.user;
            return true;
        }
    } catch (error) {
        console.log('User not logged in');
    }
    currentUser = null;
    return false;
}

/*
    function: loadPost
    Get post data from postId and pass to displayPost
*/
async function loadPost(postId) {
    const container = document.getElementById('post-container');

    if (!postId) {
        container.innerHTML = '<div class="error">No post ID provided.</div>';
        return null;
    }

    try {
        const response = await fetch(`/api/v1/post/getpost?post_id=${postId}`, {
            credentials: 'include'
        });

        const data = await response.json();

        if (response.ok && data.success) {
            displayPost(data.post);
            return data.post;
        } else {
            container.innerHTML = `<div class="error">${data.error || 'Post not found'}</div>`;
            return null;
        }
    } catch (error) {
        console.error('Error loading post:', error);
        container.innerHTML = '<div class="error">Failed to load post. Please try again.</div>';
        return null;
    }
}

/*
    function: displayPost
    Display post information on page
*/
function displayPost(post) {
    const container = document.getElementById('post-container');

    // Vote buttons HTML (only show if user is logged in)
    const voteButtonsHtml = currentUser ? `
        <div class="vote-buttons">
            <button class="vote-btn" id="like-post-btn">
                👍 Like
            </button>
            <button class="vote-btn" id="dislike-post-btn">
                👎 Dislike
            </button>
        </div>
    ` : '<div class="vote-buttons"><a href="index.html">Log in to vote</a></div>';

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
                    <span>👍</span>
                    <span id="post-likes-count">${post.likes_count}</span> likes
                </div>
                <div class="stat">
                    <span>👎</span>
                    <span id="post-dislikes-count">${post.dislikes_count}</span> dislikes
                </div>
                <div class="stat">
                    <span>💬</span>
                    <span id="comments-count">${post.comments_count}</span> comments
                </div>
                ${voteButtonsHtml}
            </div>
            <div id="vote-message"></div>
        </div>
    `;

    document.title = post.title;

    // Add event listeners using event delegation on the container
    if (currentUser) {
        // Remove any existing listeners first
        const newContainer = container.cloneNode(true);
        container.parentNode.replaceChild(newContainer, container);

        // Add single event listener to container
        newContainer.addEventListener('click', function (e) {
            const target = e.target;

            if (target.id === 'like-post-btn') {
                e.preventDefault();
                voteOnPost(1);
            } else if (target.id === 'dislike-post-btn') {
                e.preventDefault();
                voteOnPost(0);
            }
        });
    }
}

/*
    function: voteOnPost
    Lets user like or dislike on a post
*/
async function voteOnPost(like) {
    if (!currentUser) {
        alert('Please log in to vote');
        window.location.href = 'index.html';
        return;
    }

    if (postVoted) {
        showVoteMessage('You have already voted on this post', 'error');
        return;
    }

    const likeBtn = document.getElementById('like-post-btn');
    const dislikeBtn = document.getElementById('dislike-post-btn');

    // Disable buttons immediately
    if (likeBtn) likeBtn.disabled = true;
    if (dislikeBtn) dislikeBtn.disabled = true;

    try {
        const response = await fetch('/api/v1/post/votepost', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                post_id: parseInt(currentPostId),
                like: like
            })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            postVoted = true;

            // Update UI
            if (like === 1) {
                if (likeBtn) likeBtn.classList.add('liked');
                showVoteMessage('Post liked!', 'success');
                // Increment like count
                const likesCountEl = document.getElementById('post-likes-count');
                if (likesCountEl) {
                    const currentCount = parseInt(likesCountEl.textContent);
                    likesCountEl.textContent = currentCount + 1;
                }
            } else {
                if (dislikeBtn) dislikeBtn.classList.add('disliked');
                showVoteMessage('Post disliked!', 'success');
                // Increment dislike count
                const dislikesCountEl = document.getElementById('post-dislikes-count');
                if (dislikesCountEl) {
                    const currentCount = parseInt(dislikesCountEl.textContent);
                    dislikesCountEl.textContent = currentCount + 1;
                }
            }
        } else {
            showVoteMessage(data.error || 'Failed to vote', 'error');

            // If already voted, mark as voted
            if (response.status === 409) {
                postVoted = true;
            } else {
                // Re-enable buttons if not a duplicate vote
                if (likeBtn) likeBtn.disabled = false;
                if (dislikeBtn) dislikeBtn.disabled = false;
            }
        }
    } catch (error) {
        console.error('Error voting on post:', error);
        showVoteMessage('Failed to vote. Please try again.', 'error');
        if (likeBtn) likeBtn.disabled = false;
        if (dislikeBtn) dislikeBtn.disabled = false;
    }
}

/*
    function: showVoteMessage
    Shows message based on whether or not user was able to like or dislike
*/
function showVoteMessage(message, type) {
    const messageDiv = document.getElementById('vote-message');
    if (messageDiv) {
        messageDiv.innerHTML = `<p class="${type} vote-message">${escapeHtml(message)}</p>`;

        setTimeout(() => {
            messageDiv.innerHTML = '';
        }, 3000);
    }
}

/*
    function: showCommentForm
    Shows the form for making comments after authenticating user
*/
function showCommentForm() {
    const formContainer = document.getElementById('comment-form-container');

    if (currentUser) {
        formContainer.innerHTML = `
            <div class="comment-form">
                <textarea id="comment-input" placeholder="Write a comment..."></textarea>
                <button id="submit-comment">Post Comment</button>
                <div id="comment-message"></div>
            </div>
        `;
        const submitBtn = document.getElementById('submit-comment');
        if (submitBtn) {
            submitBtn.addEventListener('click', submitComment);
        }
    } else {
        formContainer.innerHTML = `
            <div class="login-prompt">
                <a href="index.html">Log in</a> to post a comment
            </div>
        `;
    }
}

/*
    function: submitComment
    Creates new comment
*/
async function submitComment() {
    const input = document.getElementById('comment-input');
    const button = document.getElementById('submit-comment');
    const messageDiv = document.getElementById('comment-message');

    const content = input.value.trim();

    if (!content) {
        messageDiv.innerHTML = '<p class="error">Please enter a comment.</p>';
        return;
    }

    button.disabled = true;
    button.textContent = 'Posting...';
    messageDiv.innerHTML = '';

    try {
        const response = await fetch('/api/v1/comment/createcomment', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                post_id: parseInt(currentPostId),
                content: content
            })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            messageDiv.innerHTML = '<p class="success">Comment posted!</p>';
            input.value = '';

            // Reload comments
            await loadComments(currentPostId);

            setTimeout(() => {
                messageDiv.innerHTML = '';
            }, 2000);
        } else {
            messageDiv.innerHTML = `<p class="error">Error: ${data.error}</p>`;

            if (data.error === 'Unauthorized' || data.error === 'Invalid token') {
                setTimeout(() => {
                    window.location.href = '/login.html';
                }, 2000);
            }
        }
    } catch (error) {
        console.error('Error posting comment:', error);
        messageDiv.innerHTML = '<p class="error">Failed to post comment. Please try again.</p>';
    } finally {
        button.disabled = false;
        button.textContent = 'Post Comment';
    }
}

/*
    function: loadComments
    Retrieves current list of comments attached to a given post by postID
*/
async function loadComments(postId) {
    const commentsContainer = document.getElementById('comments-list');
    commentsContainer.innerHTML = '<div class="loading">Loading comments...</div>';

    try {
        const response = await fetch(`/api/v1/comment/viewcomments?post_id=${postId}`, {
            credentials: 'include'
        });

        const data = await response.json();

        if (response.ok && data.success) {
            displayComments(data.comments);
        } else {
            commentsContainer.innerHTML = `<div class="error">${data.error || 'Failed to load comments'}</div>`;
        }
    } catch (error) {
        console.error('Error loading comments:', error);
        commentsContainer.innerHTML = '<div class="error">Failed to load comments. Please try again.</div>';
    }
}

/*
    function: displayComments
    Shows current comments on a post
*/
function displayComments(comments) {
    const commentsContainer = document.getElementById('comments-list');

    if (comments.length === 0) {
        commentsContainer.innerHTML = '<div class="no-comments">No comments yet. Be the first to comment!</div>';
        return;
    }

    const voteButtonsHtml = (commentId) => currentUser ? `
        <div class="comment-vote-buttons">
            <button class="comment-vote-btn" data-comment-id="${commentId}" data-vote="1">👍</button>
            <button class="comment-vote-btn" data-comment-id="${commentId}" data-vote="0">👎</button>
        </div>
    ` : '';

    commentsContainer.innerHTML = comments.map(comment => `
        <div class="comment-card">
            <div class="comment-header">
                <div class="comment-author">${escapeHtml(comment.username || 'Anonymous')}</div>
                <div class="comment-votes">
                    <span>👍 <span class="comment-likes-count" data-comment-id="${comment.comment_id}">${comment.likes_count || 0}</span></span>
                    <span>👎 <span class="comment-dislikes-count" data-comment-id="${comment.comment_id}">${comment.dislikes_count || 0}</span></span>
                </div>
            </div>
            <div class="comment-content">${escapeHtml(comment.content)}</div>
            ${voteButtonsHtml(comment.comment_id)}
            <div class="comment-vote-message" data-comment-id="${comment.comment_id}"></div>
        </div>
    `).join('');

    // Use event delegation for comment votes
    if (currentUser) {
        commentsContainer.addEventListener('click', function (e) {
            if (e.target.classList.contains('comment-vote-btn')) {
                const commentId = parseInt(e.target.dataset.commentId);
                const vote = parseInt(e.target.dataset.vote);
                voteOnComment(commentId, vote);
            }
        });
    }
}

/*
    function: voteOnComment
    Lets user give comments a like or dislike
*/
async function voteOnComment(commentId, like) {
    if (!currentUser) {
        alert('Please log in to vote');
        window.location.href = 'index.html';
        return;
    }

    if (votedComments.has(commentId)) {
        showCommentVoteMessage(commentId, 'You have already voted on this comment', 'error');
        return;
    }

    // Get all buttons for this comment
    const buttons = document.querySelectorAll(`.comment-vote-btn[data-comment-id="${commentId}"]`);

    // Disable buttons
    buttons.forEach(btn => btn.disabled = true);

    try {
        const response = await fetch('/api/v1/comment/votecomment', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                comment_id: commentId,
                like: like
            })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            votedComments.add(commentId);

            // Find the correct button and update
            buttons.forEach(btn => {
                if (parseInt(btn.dataset.vote) === like) {
                    btn.classList.add(like === 1 ? 'liked' : 'disliked');
                }
            });

            // Update count
            if (like === 1) {
                showCommentVoteMessage(commentId, 'Comment liked!', 'success');
                const likesCountEl = document.querySelector(`.comment-likes-count[data-comment-id="${commentId}"]`);
                if (likesCountEl) {
                    const currentCount = parseInt(likesCountEl.textContent);
                    likesCountEl.textContent = currentCount + 1;
                }
            } else {
                showCommentVoteMessage(commentId, 'Comment disliked!', 'success');
                const dislikesCountEl = document.querySelector(`.comment-dislikes-count[data-comment-id="${commentId}"]`);
                if (dislikesCountEl) {
                    const currentCount = parseInt(dislikesCountEl.textContent);
                    dislikesCountEl.textContent = currentCount + 1;
                }
            }
        } else {
            showCommentVoteMessage(commentId, data.error || 'Failed to vote', 'error');

            // If already voted, mark as voted
            if (response.status === 409) {
                votedComments.add(commentId);
            } else {
                // Re-enable buttons if not a duplicate vote
                buttons.forEach(btn => btn.disabled = false);
            }
        }
    } catch (error) {
        console.error('Error voting on comment:', error);
        showCommentVoteMessage(commentId, 'Failed to vote. Please try again.', 'error');
        buttons.forEach(btn => btn.disabled = false);
    }
}

/*
    function: showCommentVoteMessage
    Shows message based on whether or not user was able to like or dislike
*/
function showCommentVoteMessage(commentId, message, type) {
    const messageDiv = document.querySelector(`.comment-vote-message[data-comment-id="${commentId}"]`);
    if (messageDiv) {
        messageDiv.innerHTML = `<p class="${type} vote-message">${escapeHtml(message)}</p>`;

        setTimeout(() => {
            messageDiv.innerHTML = '';
        }, 3000);
    }
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

/*
    function: init
    Loads the current appearance of the post and its comments
*/
async function init() {
    currentPostId = getPostIdFromUrl();

    if (!currentPostId) {
        document.getElementById('post-container').innerHTML = '<div class="error">No post ID provided.</div>';
        return;
    }

    // Check auth FIRST
    await checkAuthStatus();

    // Then load everything
    await loadPost(currentPostId);
    await loadComments(currentPostId);
    showCommentForm();
}

// Start upon page opening
init();