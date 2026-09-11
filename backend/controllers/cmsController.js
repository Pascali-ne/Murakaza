const { z } = require("zod");
const prisma = require("../config/db");

const localizedShape = z.object({
  en: z.record(z.any()),
  rw: z.record(z.any()),
});

const upsertSchema = z.object({
  key: z.string().min(1),
  type: z.enum(["HERO_VIDEO", "BANNER_IMAGE", "THUMBNAIL", "PAGE_COPY", "ANNOUNCEMENT"]),
  mediaUrl: z.string().url().optional().nullable(),
  posterUrl: z.string().url().optional().nullable(),
  localizedFields: localizedShape,
  isPublished: z.boolean().optional(),
});

// GET /api/cms — public, returns only published content.
// Used by the storefront to render hero video, banners, copy, etc.
async function listPublic(req, res, next) {
  try {
    const { type } = req.query;
    const items = await prisma.contentCMS.findMany({
      where: { isPublished: true, ...(type ? { type } : {}) },
      orderBy: { updatedAt: "desc" },
    });
    res.json({ items });
  } catch (err) {
    next(err);
  }
}

// GET /api/cms/:key — public, single item by key (e.g. "hero.video").
async function getByKey(req, res, next) {
  try {
    const item = await prisma.contentCMS.findUnique({ where: { key: req.params.key } });
    if (!item || !item.isPublished) {
      return res.status(404).json({ error: "Content not found." });
    }
    res.json({ item });
  } catch (err) {
    next(err);
  }
}

// GET /api/cms/admin/all — ADMIN only, includes unpublished drafts.
async function listAllForAdmin(req, res, next) {
  try {
    const items = await prisma.contentCMS.findMany({ orderBy: { updatedAt: "desc" } });
    res.json({ items });
  } catch (err) {
    next(err);
  }
}

// POST /api/cms — ADMIN only. Creates or updates by unique `key`,
// so the admin can edit copy/media live without a redeploy.
async function upsert(req, res, next) {
  try {
    const data = upsertSchema.parse(req.body);

    const item = await prisma.contentCMS.upsert({
      where: { key: data.key },
      create: { ...data, updatedBy: req.user.id },
      update: { ...data, updatedBy: req.user.id },
    });

    res.status(200).json({ item });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/cms/:id — ADMIN only.
async function remove(req, res, next) {
  try {
    await prisma.contentCMS.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Content not found." });
    }
    next(err);
  }
}

module.exports = { listPublic, getByKey, listAllForAdmin, upsert, remove };
