// make_post.js

/*
    function: makePost
    Create new post with user-inputed title and content
*/
async function makePost(event) {
    event.preventDefault();
    const form = document.getElementById("make_post");
    const formInputs = new FormData(form)
    const dataObject = Object.fromEntries(formInputs.entries());
    const jsonData = JSON.stringify(dataObject);

    try {
        const response = await fetch('/api/v1/post/createpost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonData
        });

        const data = await response.json();

        if (!response.ok) { document.getElementById("failMsg").textContent = data.error; return; }

        // Redirect to home page once post is successfully created.
        window.location.href = "main.html";

    } catch (error) {
        console.error(error);
        document.getElementById("failMsg").textContent = "Network error. Please try again.";
    }
}