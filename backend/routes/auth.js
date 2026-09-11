const express = require("express");
const { authLimiter } = require("../middleware/rateLimit");
const { requireAuth } = require("../middleware/auth");
const { register, login, refresh, me } = require("../controllers/authController");

const router = express.Router();

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/refresh", authLimiter, refresh);
router.get("/me", requireAuth, me);

module.exports = router;
