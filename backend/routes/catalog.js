const express = require("express");
const { getCatalog, getCatalogItem } = require("../controllers/catalogController");

const router = express.Router();

// GET /api/catalog — public catalog listing
router.get("/", getCatalog);

// GET /api/catalog/:id — single item detail
router.get("/:id", getCatalogItem);

module.exports = router;
