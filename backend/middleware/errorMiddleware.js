/* eslint-disable no-unused-vars */
function errorMiddleware(err, req, res, next) {
  // Validation / casting errors
  if (err && err.name === 'ValidationError') {
    const details = Object.values(err.errors || {}).map((e) => e.message);
    return res.status(400).json({ message: 'Validation Error', details });
  }

  if (err && err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID' });
  }

  // Custom known errors
  if (err && err.statusCode) {
    return res.status(err.statusCode).json({ message: err.message, details: err.details });
  }

  console.error(err);
  return res.status(500).json({ message: 'Internal Server Error' });
}

module.exports = errorMiddleware;

