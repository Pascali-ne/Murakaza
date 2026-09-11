const prisma = require("../config/db");
const crypto = require("crypto");

// POST /api/upload — Admin uploads a file (image or video)
async function uploadFile(req, res) {
  try {
    const { filename, mimeType, data } = req.body;
    if (!data) {
      return res.status(400).json({ error: "Missing file data." });
    }

    // Generate clean unique filename
    const ext = filename ? filename.split(".").pop().toLowerCase() : "bin";
    const fileId = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}.${ext}`;
    const key = `upload.${fileId}`;

    // Clean data URI prefix if present
    let base64Content = data;
    let detectedMime = mimeType || "application/octet-stream";
    if (data.startsWith("data:")) {
      const parts = data.split(",");
      const match = parts[0].match(/:(.*?);/);
      if (match) detectedMime = match[1];
      base64Content = parts[1];
    }

    // Determine CMS type
    let cmsType = "THUMBNAIL";
    if (detectedMime.startsWith("video/")) cmsType = "HERO_VIDEO";
    else if (detectedMime.startsWith("image/")) cmsType = "BANNER_IMAGE";

    // Store in Neon PostgreSQL ContentCMS
    const record = await prisma.contentCMS.create({
      data: {
        key,
        type: cmsType,
        mediaUrl: `/api/upload/${fileId}`,
        posterUrl: null,
        isPublished: true,
        localizedFields: {
          filename: filename || fileId,
          mimeType: detectedMime,
          sizeBytes: Buffer.byteLength(base64Content, "base64"),
          base64: base64Content,
          uploadedAt: new Date().toISOString(),
        },
        updatedBy: req.user?.id,
      },
    });

    const host = req.get("host");
    const protocol = req.headers["x-forwarded-proto"] || req.protocol;
    const publicUrl = `/api/upload/${fileId}`;
    const fullUrl = `${protocol}://${host}${publicUrl}`;

    res.status(201).json({
      id: fileId,
      url: publicUrl,
      fullUrl,
      filename: filename || fileId,
      mimeType: detectedMime,
      sizeBytes: record.localizedFields.sizeBytes,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Failed to upload file." });
  }
}

// GET /api/upload/:id — Serve the raw uploaded binary file with Range support for video
async function getUploadedFile(req, res) {
  try {
    const { id } = req.params;
    const key = `upload.${id}`;

    const record = await prisma.contentCMS.findUnique({
      where: { key },
    });

    if (!record || !record.localizedFields || !record.localizedFields.base64) {
      return res.status(404).json({ error: "File not found." });
    }

    const mimeType = record.localizedFields.mimeType || "application/octet-stream";
    const fileBuffer = Buffer.from(record.localizedFields.base64, "base64");
    const total = fileBuffer.length;
    const range = req.headers.range;

    // Enable cross-origin resource sharing for embedded videos and images
    res.set("Access-Control-Allow-Origin", "*");

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const partialStart = parts[0];
      const partialEnd = parts[1];

      const start = parseInt(partialStart, 10);
      const end = partialEnd ? parseInt(partialEnd, 10) : total - 1;
      const chunksize = end - start + 1;

      res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${total}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": mimeType,
      });
      return res.end(fileBuffer.slice(start, end + 1));
    } else {
      res.writeHead(200, {
        "Content-Length": total,
        "Content-Type": mimeType,
        "Accept-Ranges": "bytes",
        "Cache-Control": "public, max-age=31536000, immutable",
      });
      return res.end(fileBuffer);
    }
  } catch (err) {
    console.error("Fetch upload error:", err);
    res.status(500).json({ error: "Failed to retrieve file." });
  }
}

// GET /api/upload — List uploaded files for media library
async function listUploadedFiles(req, res) {
  try {
    const records = await prisma.contentCMS.findMany({
      where: { key: { startsWith: "upload." } },
      orderBy: { createdAt: "desc" },
      take: 60,
    });

    const files = records.map((r) => ({
      id: r.key.replace("upload.", ""),
      url: r.mediaUrl,
      filename: r.localizedFields?.filename,
      mimeType: r.localizedFields?.mimeType,
      sizeBytes: r.localizedFields?.sizeBytes,
      createdAt: r.createdAt,
    }));

    res.json({ files });
  } catch (err) {
    console.error("List uploads error:", err);
    res.status(500).json({ error: "Failed to list uploads." });
  }
}

// DELETE /api/upload/:id — Delete uploaded file
async function deleteUploadedFile(req, res) {
  try {
    const { id } = req.params;
    const key = `upload.${id}`;

    await prisma.contentCMS.deleteMany({
      where: { key },
    });

    res.json({ message: "File deleted successfully.", id });
  } catch (err) {
    console.error("Delete upload error:", err);
    res.status(500).json({ error: "Failed to delete file." });
  }
}

module.exports = {
  uploadFile,
  getUploadedFile,
  listUploadedFiles,
  deleteUploadedFile,
};
