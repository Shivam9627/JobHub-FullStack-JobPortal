export const protect = (req, res, next) => {
  // Clerk will handle auth later
  next();
};
