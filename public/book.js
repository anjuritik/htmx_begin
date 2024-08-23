// books.js
function getBooks() {
    // Hardcoded array of books
    const books = [
        { title: 'To Kill a Mockingbird', author: 'Harper Lee', year: 1960 },
        { title: '1984', author: 'George Orwell', year: 1949 },
        { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', year: 1925 },
        { title: 'Moby Dick', author: 'Herman Melville', year: 1851 },
        { title: 'War and Peace', author: 'Leo Tolstoy', year: 1869 },
        { title: 'Pride and Prejudice', author: 'Jane Austen', year: 1813 },
        { title: 'The Catcher in the Rye', author: 'J.D. Salinger', year: 1951 },
        { title: 'Brave New World', author: 'Aldous Huxley', year: 1932 },
        { title: 'The Hobbit', author: 'J.R.R. Tolkien', year: 1937 }
    ];

    // Generate HTML for books
    let html = `
        <style>
            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
                font-family: Arial, sans-serif;
                background-color: #fff;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            th, td {
                padding: 10px;
                border: 1px solid #ddd;
                text-align: left;
            }
            th {
                background-color: #f0f0f0;
                font-weight: bold;
            }
            tr:nth-child(even) {
                background-color: #f9f9f9;
            }
            tr:hover {
                background-color: #f1f1f1;
            }
            .container {
                max-width: 800px;
                margin: auto;
                padding: 20px;
                background: #f4f4f4;
                border-radius: 8px;
            }
            button {
                margin-bottom: 20px;
                padding: 10px 20px;
                font-size: 16px;
                background-color: #007bff;
                color: #fff;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }
            button:hover {
                background-color: #0056b3;
            }
        </style>
        <div class="container">
            <button id="loadBooks">Load Books</button>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Year</th>
                    </tr>
                </thead>
                <tbody>
    `;

    // Create the HTML for the books
    books.forEach(book => {
        html += `
            <tr>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.year}</td>
            </tr>
        `;
    });

    html += `
                </tbody>
            </table>
        </div>
    `;
    return html;
}

module.exports = { getBooks };