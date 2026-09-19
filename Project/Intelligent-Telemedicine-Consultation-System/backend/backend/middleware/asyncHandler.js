/**
 * Wraps async route handlers so you don't need try/catch in every controller.
 * Any thrown error is automatically passed to Express's error handler.
 *
 * Usage in routes:
 *   router.post("/book", asyncHandler(bookAppointment));
 */

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;