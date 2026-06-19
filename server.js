const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const requestLogger = require("./middleware/logger");
const { notFound, errorHandler } = require("./middleware/errorHandler");
const bookRoutes = require("./routes/books");

dotenv.config();

const app = express();

// Built-in middleware to parse JSON request bodies
app.use(bodyParser.json());
app.use(express.json());

// Custom request logger (logs method, endpoint, date/time of each request)
app.use(requestLogger);

// Root route - simple health check
app.get("/", (req, res) => {
  res.status(200).json({ message: "Online Bookstore Management API is running" });
});

// Main API routes
app.use("/api/books", bookRoutes);

// 404 handler for routes that don't exist
app.use(notFound);

// Global error handler (must be the last middleware)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });
