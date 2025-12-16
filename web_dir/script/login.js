// login.js

/*
    function: login
    Verifies and logs in user
*/
async function login(event) {
    event.preventDefault();
    const form = document.getElementById("login");
    const formInputs = new FormData(form)
    const dataObject = Object.fromEntries(formInputs.entries());
    const jsonData = JSON.stringify(dataObject);

    try {
        const response = await fetch('/api/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonData
        });

        const data = await response.json();

        if (!response.ok) { document.getElementById("failMsg").textContent = data.error; return; }

        // Redirect to home page if authenticated.
        window.location.href = "main.html";
    } catch (error) {
        console.error(error);
        document.getElementById("failMsg").textContent = "Network error. Please try again.";
    }
}