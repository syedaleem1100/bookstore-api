// Handles routes that don't exist
const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Catches errors thrown anywhere in the app (including invalid Mongo IDs,
// validation errors, and routes that don't exist) and sends back clean JSON
const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Invalid MongoDB ObjectId format
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 400;
    message = "Invalid book ID format";
  }

  // Mongoose validation errors (missing required fields, etc.)
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  res.status(statusCode).json({
    success: false,
    error: message,
  });
};

module.exports = { notFound, errorHandler };
