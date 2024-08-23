// books.js
function getBooks() {
    // Sample book data
    const books = [
        { title: 'To Kill a Mockingbird', author: 'Harper Lee', year: 1960 },
        { title: '1984', author: 'George Orwell', year: 1949 },
        { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', year: 1925 },
        // Add more books if needed
    ];

    // Generate HTML for books
    let html = `
        <style>
            .book-container {
                display: flex;
                flex-wrap: wrap;
                gap: 20px;
                padding: 20px;
            }
            .book-item {
                flex: 1;
                min-width: 200px;
                border: 1px solid #ddd;
                padding: 10px;
                border-radius: 5px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }
            .book-item h3 {
                margin: 0 0 10px;
                color: #007BFF;
            }
            .book-item p {
                margin: 0;
            }
            h2 {
                text-align: center;
                color: #333;
                margin-bottom: 20px;
            }
        </style>
        <h2>Book List</h2>
        <div class="book-container">
    `;
    
    books.forEach(book => {
        html += `
            <div class="book-item">
                <h3>${book.title}</h3>
                <p><strong>Author:</strong> ${book.author}</p>
                <p><strong>Year:</strong> ${book.year}</p>
            </div>
        `;
    });

    html += '</div>';
    return html;
}

module.exports = { getBooks };