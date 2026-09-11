const express = require("express");
const { requireAuth, requireRole } = require("../middleware/auth");
const {
  listPublic,
  getByKey,
  listAllForAdmin,
  upsert,
  remove,
} = require("../controllers/cmsController");

const router = express.Router();

// Public — storefront reads.
router.get("/", listPublic);
router.get("/:key", getByKey);

// Admin — content management.
router.get("/admin/all", requireAuth, requireRole("ADMIN"), listAllForAdmin);
router.post("/", requireAuth, requireRole("ADMIN"), upsert);
router.delete("/:id", requireAuth, requireRole("ADMIN"), remove);

module.exports = router;
