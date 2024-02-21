document.getElementById('tokenForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent form submission
    try {
        console.log("The form is working!")
        // const response = await fetch('/generate-token', {
        //     method: 'POST',
        //     // Optionally, you can include any data needed for token generation
        //     // body: JSON.stringify({ /* data */ }),
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // });
        // const data = await response.json();
        document.getElementById('tokenDisplay').innerText = `New Token:`;
    } catch (error) {
        console.error('Error generating token:', error);
    }
});