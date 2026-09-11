const { z } = require("zod");
const prisma = require("../config/db");

const submitSchema = z.object({
  authorName: z.string().min(1).max(80),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(1).max(1000),
});

// Very small sanitizer to strip HTML tags from free-text input before
// it's stored — defense in depth alongside output-side escaping on
// the frontend. Not a substitute for a proper library like DOMPurify
// if rich text is ever allowed here.
function stripHtml(input) {
  return input.replace(/<[^>]*>?/gm, "").trim();
}

// GET /api/feedback — public, approved + not hidden only.
async function listApproved(req, res, next) {
  try {
    const feedback = await prisma.feedback.findMany({
      where: { isApproved: true, isHidden: false },
      orderBy: { createdAt: "desc" },
      select: { id: true, authorName: true, rating: true, comment: true, createdAt: true },
    });
    res.json({ feedback });
  } catch (err) {
    next(err);
  }
}

// POST /api/feedback — public (guest or authenticated). New feedback
// is unapproved by default and only appears after admin moderation.
async function submit(req, res, next) {
  try {
    const parsed = submitSchema.parse(req.body);
    const feedback = await prisma.feedback.create({
      data: {
        userId: req.user ? req.user.id : null,
        authorName: stripHtml(parsed.authorName),
        rating: parsed.rating,
        comment: stripHtml(parsed.comment),
        isApproved: false,
      },
    });

    res.status(201).json({
      feedback,
      message: "Thanks! Your feedback will appear once it's been reviewed.",
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/feedback/admin/all — ADMIN only, everything including hidden/pending.
async function listAllForAdmin(req, res, next) {
  try {
    const feedback = await prisma.feedback.findMany({ orderBy: { createdAt: "desc" } });
    res.json({ feedback });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/feedback/:id/moderate — ADMIN only: { isApproved?, isHidden? }
async function moderate(req, res, next) {
  try {
    const schema = z.object({ isApproved: z.boolean().optional(), isHidden: z.boolean().optional() });
    const data = schema.parse(req.body);

    const feedback = await prisma.feedback.update({
      where: { id: req.params.id },
      data,
    });

    res.json({ feedback });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Feedback not found." });
    }
    next(err);
  }
}

// DELETE /api/feedback/:id — ADMIN only.
async function remove(req, res, next) {
  try {
    await prisma.feedback.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Feedback not found." });
    }
    next(err);
  }
}

module.exports = { listApproved, submit, listAllForAdmin, moderate, remove };
