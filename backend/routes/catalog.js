const express = require("express");
const {
  getCatalog,
  getCatalogItem,
  createCatalogItem,
  updateCatalogItem,
  deleteCatalogItem,
} = require("../controllers/catalogController");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

// Public routes
router.get("/", getCatalog);
router.get("/:id", getCatalogItem);

// Protected Admin management routes
router.post("/", requireAuth, requireRole("ADMIN"), createCatalogItem);
router.put("/:id", requireAuth, requireRole("ADMIN"), updateCatalogItem);
router.delete("/:id", requireAuth, requireRole("ADMIN"), deleteCatalogItem);

module.exports = router;
