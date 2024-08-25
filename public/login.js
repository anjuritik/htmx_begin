document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const responseDiv = document.getElementById('response');

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission

        const formData = new FormData(form);

        // Debug: Log form data
        for (const [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        try {
            const response = await fetch('/login', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }

            const result = await response.text();
            responseDiv.innerHTML = result; // Update the response div with the server's response
        } catch (error) {
            responseDiv.innerHTML = `<p>Error: ${error.message}</p>`;
        }
    });
});