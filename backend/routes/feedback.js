const express = require("express");
const { feedbackLimiter } = require("../middleware/rateLimit");
const { requireAuth, requireRole, optionalAuth } = require("../middleware/auth");
const {
  listApproved,
  submit,
  listAllForAdmin,
  moderate,
  remove,
} = require("../controllers/feedbackController");

const router = express.Router();

router.get("/", listApproved);
router.post("/", feedbackLimiter, optionalAuth, submit);

router.get("/admin/all", requireAuth, requireRole("ADMIN"), listAllForAdmin);
router.patch("/:id/moderate", requireAuth, requireRole("ADMIN"), moderate);
router.delete("/:id", requireAuth, requireRole("ADMIN"), remove);

module.exports = router;
