const { validationResult } = require("express-validator");

/**
 * Runs express-validator's validationResult.
 * Returns 400 with the first error message if validation fails.
 */
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  return next();
};

module.exports = { handleValidation };
