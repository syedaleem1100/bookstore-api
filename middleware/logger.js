// Logs the HTTP method, requested endpoint, and the date/time of every request
const requestLogger = (req, res, next) => {
  const now = new Date().toLocaleString();
  console.log(`[${now}] ${req.method} ${req.originalUrl}`);
  next();
};

module.exports = requestLogger;
