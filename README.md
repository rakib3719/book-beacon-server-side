# Book Beacon Server

[Live Link](https://book-beacon-188a6.web.app/)  
[Client Side Repo](https://github.com/rakib3719/book-beacon-client-side)

## Project Overview

This is the server-side code for **Book Beacon**, a single-page React application for an online bookshop. The server is built with Express.js and MongoDB, and it provides endpoints for managing and retrieving book data. This project uses modern technologies such as environment variables for configuration, CORS for cross-origin resource sharing, and MongoDB for database operations.

### Key Features

- **Book Management**: Supports operations for fetching, filtering, and updating book information.
- **Filtering and Sorting**: Allows clients to filter books by category, publication, price range, and search terms. Books can be sorted by price or publication date.
- **Environment Configuration**: Uses environment variables to manage sensitive data like database credentials.

## Setup Instructions

To get this project up and running locally, follow these steps:

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v14 or later)
- **npm** (v6 or later)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/rakib3719/book-beacon-server-side
   cd book-beacon-server-side
   npm install

2. **Setup Environment Variables::**

Create a .env file in the root of the project and add your MongoDB credentials:

- USER= your_mongodb_username
- PASSWORD= your_mongodb_password

3. **Start the Development Server:**

- npm start
- Open http://localhost:5000 in your browser or use tools like Postman to test the endpoints.

4. **Usage**

- Count Books: Use the /countBooks endpoint to get the number of - books matching specific criteria.
- Fetch Books: Use the /books endpoint to retrieve a list of books with optional filters and sorting.

4. **Technologies Used**

- Express.js: For building the server and handling requests.
- MongoDB: For database management.
- dotenv: For managing environment variables.
- CORS: For enabling cross-origin requests.



