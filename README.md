# Online Bookstore Management API

A RESTful backend API for managing a bookstore's book inventory, built with
Node.js, Express, and MongoDB (Mongoose).

## Tech Stack
- Node.js
- Express.js
- MongoDB / Mongoose
- dotenv
- body-parser

## Project Structure
```
bookstore-api/
├── models/
│   └── Book.js
├── routes/
│   └── books.js
├── middleware/
│   ├── logger.js
│   └── errorHandler.js
├── server.js
├── package.json
├── .env.example
└── Bookstore-API.postman_collection.json
```

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root folder (copy `.env.example`) and set
   your MongoDB connection string:
   ```
   MONGO_URI=mongodb://127.0.0.1:27017/bookstoreDB
   PORT=5000
   ```
   (For MongoDB Atlas, use your cluster's connection string instead.)

3. Start the server:
   ```
   npm start
   ```
   or, for auto-restart during development:
   ```
   npm run dev
   ```

4. The API will run at `http://localhost:5000`

## Book Schema

| Field         | Type    | Required | Default |
|---------------|---------|----------|---------|
| title         | String  | Yes      | -       |
| author        | String  | Yes      | -       |
| genre         | String  | No       | -       |
| price         | Number  | Yes      | -       |
| publishedDate | Date    | No       | -       |
| inStock       | Boolean | No       | true    |

## API Endpoints

| Method | Endpoint          | Description              |
|--------|-------------------|---------------------------|
| GET    | /api/books        | Get all books (supports search & pagination) |
| GET    | /api/books/:id    | Get a single book by ID  |
| POST   | /api/books        | Add a new book            |
| PUT    | /api/books/:id    | Update an existing book   |
| DELETE | /api/books/:id    | Delete a book              |

### Search & Pagination
```
GET /api/books?author=Rowling&genre=Fantasy&page=1&limit=10
```
- `author` and `genre` perform a case-insensitive partial match
- `page` and `limit` control pagination (defaults: page=1, limit=10)

## Status Codes Used
- `200` - Success
- `201` - Resource created
- `400` - Bad request / validation error
- `404` - Resource or route not found
- `500` - Server error

## Middleware
- **Request logger** - logs the HTTP method, endpoint, and timestamp of every incoming request to the console
- **Global error handler** - catches invalid routes, invalid MongoDB IDs, and validation errors, returning consistent JSON error responses

## Testing
A Postman collection (`Bookstore-API.postman_collection.json`) is included
covering all routes. Import it into Postman, set the `baseUrl` and `bookId`
variables, and run each request.

## Sample Requests

**Add a book (POST /api/books)**
```json
{
  "title": "Harry Potter and the Sorcerer's Stone",
  "author": "J.K. Rowling",
  "genre": "Fantasy",
  "price": 14.99,
  "publishedDate": "1997-06-26",
  "inStock": true
}
```

**Update a book (PUT /api/books/:id)**
```json
{
  "price": 12.99,
  "inStock": false
}
```
