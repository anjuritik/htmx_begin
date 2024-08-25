document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const responseDiv = document.getElementById('response');

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission

        const formData = new FormData(form);

        try {
            const response = await fetch('/contacts', {
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