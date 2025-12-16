// check_auth.js

let currentUser = null;

/*
    function: checkAuth
    Calls the /me endpoint to check if user can authenticate
*/
async function checkAuth() {
    try {
        const response = await fetch('/api/v1/auth/me', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            currentUser = data.user;
            return currentUser;
        } else {
            currentUser = null;
            return null;
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        currentUser = null;
        return null;
    }
}

/*
    function: initAuth
    Checks user is authenticated, and checks their token every 5 minutes
    Currently has no guest user functionality
*/
async function initAuth() {
    const user = await checkAuth();

    if (!user) {
        // User is NOT authenticated and redirected to login.
        window.location.href = 'index.html';
        return;
    }

    // User is authenticated.
    // Check every 5 minutes if token has expired or not.
    setInterval(async () => {
        const user = await checkAuth();
        if (!user) {
            alert('Your session has expired. Please log in again.');
            window.location.href = 'index.html';
        }
    }, 5 * 60 * 1000); // Check every 5 minutes.
}

// Start checking upon opening main.html.
initAuth();