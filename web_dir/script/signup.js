async function signup() {
    const form = document.getElementById("signup");
    const formInputs = new FormData(form)
    const dataObject = Object.fromEntries(formInputs.entries());
    const jsonData = JSON.stringify(dataObject);

    const response = await fetch('/api/v1/user/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: jsonData
    });

    const data = await response.json();
    if (!response.ok) { document.getElementById("failMsg").textContent = data.error; }
    
}