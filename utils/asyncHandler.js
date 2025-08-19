const asyncHandler = (requestHandler) => {
  // The 'next' parameter was missing here
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };