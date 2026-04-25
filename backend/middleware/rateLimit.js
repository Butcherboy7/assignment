const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: { message: "Too many login attempts. Try again in 15 minutes." },
    standardHeaders: true,  // Return rate limit info in RateLimit-* headers
    legacyHeaders: false,   // Disable X-RateLimit-* headers
});

module.exports = { loginLimiter };
