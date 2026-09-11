"use client";

import { useEffect, useState, useRef } from "react";
import { upload, resolveMediaUrl } from "@/lib/api";

interface MediaItem {
  id: string;
  url: string;
  filename?: string;
  mimeType?: string;
  sizeBytes?: number;
  createdAt?: string;
}

export default function MediaManager() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "image" | "video">("all");
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function loadMedia() {
    setLoading(true);
    try {
      const res = await upload.list();
      setItems(res.files || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMedia();
  }, []);

  async function handleFileUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 45 * 1024 * 1024) {
          throw new Error(`"${file.name}" exceeds 45MB limit.`);
        }
        await upload.file(file);
      }
      await loadMedia();
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || "Failed to upload file(s).");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string, name?: string) {
    if (!confirm(`Are you sure you want to delete "${name || id}"?`)) return;
    try {
      await upload.remove(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      if (previewItem?.id === id) setPreviewItem(null);
    } catch (err: unknown) {
      const e = err as Error;
      alert(e.message || "Failed to delete file.");
    }
  }

  function handleCopyUrl(url: string, id: string) {
    const full = resolveMediaUrl(url);
    navigator.clipboard.writeText(full);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function formatBytes(bytes?: number) {
    if (!bytes) return "0 B";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  const totalBytes = items.reduce((acc, curr) => acc + (curr.sizeBytes || 0), 0);
  const imagesCount = items.filter((i) => i.mimeType?.startsWith("image/")).length;
  const videosCount = items.filter((i) => i.mimeType?.startsWith("video/") || i.id.includes(".mp4")).length;

  const filteredItems = items.filter((item) => {
    const isVid = item.mimeType?.startsWith("video/") || item.id.includes(".mp4");
    const isImg = item.mimeType?.startsWith("image/") || !isVid;

    if (filterType === "video" && !isVid) return false;
    if (filterType === "image" && !isImg) return false;

    if (search) {
      const q = search.toLowerCase();
      return (
        (item.filename && item.filename.toLowerCase().includes(q)) ||
        item.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="mt-6 space-y-6">
      {/* Header & Stats Banner */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-ubumwe-100 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-2xl">📦</span>
            <span className="rounded-full bg-ubumwe-50 px-2.5 py-0.5 text-xs font-bold text-ubumwe-900">
              Total Assets
            </span>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-ubumwe-900">{items.length}</p>
          <p className="text-xs text-ink/50 mt-0.5">Stored permanently in Neon Cloud DB</p>
        </div>

        <div className="rounded-2xl border border-ubumwe-100 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-2xl">🖼️</span>
            <span className="rounded-full bg-imbuto-50 px-2.5 py-0.5 text-xs font-bold text-imbuto-700">
              Images & Materials
            </span>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-ubumwe-900">{imagesCount}</p>
          <p className="text-xs text-ink/50 mt-0.5">Product photos, posters & badges</p>
        </div>

        <div className="rounded-2xl border border-ubumwe-100 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-2xl">🎬</span>
            <span className="rounded-full bg-sun-100 px-2.5 py-0.5 text-xs font-bold text-sun-800">
              Hero Videos
            </span>
          </div>
          <p className="mt-3 text-2xl font-extrabold text-ubumwe-900">{videosCount}</p>
          <p className="text-xs text-ink/50 mt-0.5">Total storage: {formatBytes(totalBytes)}</p>
        </div>
      </div>

      {/* Upload Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFileUpload(e.dataTransfer.files);
        }}
        className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-ubumwe-200 bg-white p-8 text-center transition-all hover:border-ubumwe hover:bg-ubumwe-50/20 shadow-soft"
      >
        {uploading ? (
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 animate-spin rounded-full border-3 border-ubumwe-900 border-t-transparent" />
            <p className="mt-3 text-sm font-bold text-ubumwe-900">Uploading & Storing Media...</p>
            <p className="text-xs text-ink/50">Writing binary data to database</p>
          </div>
        ) : (
          <>
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-ubumwe-50 text-2xl text-ubumwe-900 group-hover:scale-110 transition-transform">
              ☁️
            </div>
            <h3 className="mt-3 text-base font-bold text-ubumwe-900">
              Upload Files from your Computer
            </h3>
            <p className="mt-1 text-xs text-ink/60">
              Drag and drop product images (JPG, PNG, WebP) or hero videos (MP4, WebM) here, or click to browse.
            </p>
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-pill bg-ubumwe-900 px-4 py-2 text-xs font-bold text-white shadow-soft group-hover:bg-ubumwe-700 transition-colors">
              <span>Select Files</span>
            </span>
          </>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={(e) => handleFileUpload(e.target.files)}
        className="hidden"
      />

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
          ⚠️ {error}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-ubumwe-100 bg-white p-4 shadow-soft">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterType("all")}
            className={`rounded-pill px-3.5 py-1.5 text-xs font-bold transition-colors ${
              filterType === "all"
                ? "bg-ubumwe-900 text-white"
                : "bg-mist text-ink/70 hover:bg-ubumwe-50"
            }`}
          >
            All ({items.length})
          </button>
          <button
            onClick={() => setFilterType("image")}
            className={`rounded-pill px-3.5 py-1.5 text-xs font-bold transition-colors ${
              filterType === "image"
                ? "bg-ubumwe-900 text-white"
                : "bg-mist text-ink/70 hover:bg-ubumwe-50"
            }`}
          >
            Images ({imagesCount})
          </button>
          <button
            onClick={() => setFilterType("video")}
            className={`rounded-pill px-3.5 py-1.5 text-xs font-bold transition-colors ${
              filterType === "video"
                ? "bg-ubumwe-900 text-white"
                : "bg-mist text-ink/70 hover:bg-ubumwe-50"
            }`}
          >
            Videos ({videosCount})
          </button>
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by filename or ID..."
          className="w-72 rounded-xl border border-ubumwe-100 px-3.5 py-2 text-xs text-ink focus:border-ubumwe focus:outline-none"
        />
      </div>

      {/* Media Grid */}
      <div className="rounded-2xl border border-ubumwe-100 bg-white p-6 shadow-soft">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-ubumwe-900 border-t-transparent" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center text-center">
            <span className="text-3xl">📂</span>
            <p className="mt-2 text-sm font-bold text-ubumwe-900">No media assets found</p>
            <p className="text-xs text-ink/50">Upload images or videos above to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filteredItems.map((item) => {
              const isVid = item.mimeType?.startsWith("video/") || item.id.includes(".mp4");
              const resolved = resolveMediaUrl(item.url);

              return (
                <div
                  key={item.id}
                  className="group relative flex flex-col overflow-hidden rounded-xl border border-ubumwe-100 bg-white transition-all hover:border-ubumwe-300 hover:shadow-soft"
                >
                  {/* Thumbnail Container */}
                  <div
                    onClick={() => setPreviewItem(item)}
                    className="relative aspect-square w-full cursor-pointer overflow-hidden bg-black/5"
                  >
                    {isVid ? (
                      <div className="relative flex h-full w-full items-center justify-center bg-slate-900 text-white">
                        <span className="text-3xl">🎬</span>
                        <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-bold">
                          VIDEO
                        </span>
                      </div>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={resolved}
                        alt={item.filename || ""}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}

                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                      <span className="rounded-pill bg-white px-3 py-1 text-[10px] font-bold text-ubumwe-900 shadow">
                        🔍 Click to View
                      </span>
                    </div>
                  </div>

                  {/* Asset Details */}
                  <div className="p-3">
                    <p className="line-clamp-1 text-xs font-bold text-ubumwe-900" title={item.filename || item.id}>
                      {item.filename || item.id}
                    </p>
                    <div className="mt-1 flex items-center justify-between text-[10px] text-ink/50">
                      <span>{formatBytes(item.sizeBytes)}</span>
                      <span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ""}</span>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="mt-2.5 flex items-center gap-1.5 border-t border-ubumwe-50 pt-2">
                      <button
                        onClick={() => handleCopyUrl(item.url, item.id)}
                        className="flex-1 rounded-lg bg-ubumwe-50 py-1 text-[10px] font-bold text-ubumwe-900 hover:bg-ubumwe-100 transition-colors"
                      >
                        {copiedId === item.id ? "✓ Copied!" : "Copy Link"}
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.filename)}
                        title="Delete asset"
                        className="grid h-6 w-6 place-items-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-xs"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox / Video Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-floating">
            <div className="flex items-center justify-between border-b border-ubumwe-100 px-6 py-4">
              <div>
                <h3 className="text-sm font-bold text-ubumwe-900">
                  {previewItem.filename || previewItem.id}
                </h3>
                <p className="text-[11px] text-ink/50">
                  Size: {formatBytes(previewItem.sizeBytes)} • {previewItem.mimeType}
                </p>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className="grid h-8 w-8 place-items-center rounded-full bg-mist text-ink/60 hover:bg-ubumwe-100"
              >
                ✕
              </button>
            </div>

            <div className="flex max-h-[60vh] items-center justify-center bg-black p-4">
              {previewItem.mimeType?.startsWith("video/") || previewItem.id.includes(".mp4") ? (
                <video
                  src={resolveMediaUrl(previewItem.url)}
                  controls
                  autoPlay
                  className="max-h-[55vh] max-w-full rounded-lg"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={resolveMediaUrl(previewItem.url)}
                  alt=""
                  className="max-h-[55vh] max-w-full rounded-lg object-contain"
                />
              )}
            </div>

            <div className="flex items-center justify-between border-t border-ubumwe-100 px-6 py-4">
              <button
                onClick={() => handleCopyUrl(previewItem.url, previewItem.id)}
                className="rounded-pill bg-ubumwe-900 px-4 py-1.5 text-xs font-bold text-white hover:bg-ubumwe-700"
              >
                {copiedId === previewItem.id ? "✓ Copied URL!" : "Copy Asset URL"}
              </button>
              <button
                onClick={() => handleDelete(previewItem.id, previewItem.filename)}
                className="rounded-pill bg-red-50 px-4 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100"
              >
                Delete File
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
