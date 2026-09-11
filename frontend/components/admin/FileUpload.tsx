"use client";

import { useState, useEffect, useRef } from "react";
import { upload, resolveMediaUrl } from "@/lib/api";

export interface UploadedFileItem {
  id: string;
  url: string;
  filename?: string;
  mimeType?: string;
  sizeBytes?: number;
  createdAt?: string;
}

interface FileUploadProps {
  value?: string | null;
  onChange: (url: string) => void;
  label: string;
  description?: string;
  accept?: "image/*" | "video/*" | "image/*,video/*";
  mediaType?: "image" | "video" | "any";
  required?: boolean;
}

export default function FileUpload({
  value,
  onChange,
  label,
  description,
  accept = "image/*",
  mediaType = "image",
  required = false,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [showManualUrl, setShowManualUrl] = useState(false);
  const [libraryFiles, setLibraryFiles] = useState<UploadedFileItem[]>([]);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [librarySearch, setLibrarySearch] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isVideo =
    mediaType === "video" ||
    (value && (value.includes(".mp4") || value.includes(".webm") || value.includes("video")));

  const currentPreviewUrl = value ? resolveMediaUrl(value) : null;

  async function handleFileSelect(file: File) {
    setError(null);

    // Validate size (max 45MB)
    const maxSizeBytes = 45 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setError(`File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds 45MB limit.`);
      return;
    }

    setUploading(true);
    try {
      const res = await upload.file(file);
      onChange(res.url);
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message || "Failed to upload file. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileSelect(file);
    }
  }

  async function openLibrary() {
    setShowLibrary(true);
    setLibraryLoading(true);
    try {
      const res = await upload.list();
      setLibraryFiles(res.files || []);
    } catch {
      setLibraryFiles([]);
    } finally {
      setLibraryLoading(false);
    }
  }

  async function handleDeleteFromLibrary(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this uploaded file?")) return;
    try {
      await upload.remove(id);
      setLibraryFiles((prev) => prev.filter((f) => f.id !== id));
      if (value && value.includes(id)) {
        onChange("");
      }
    } catch (err: unknown) {
      const e = err as Error;
      alert(e.message || "Failed to delete file.");
    }
  }

  function formatBytes(bytes?: number) {
    if (!bytes) return "";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  const filteredLibrary = libraryFiles.filter((item) => {
    const searchMatch =
      !librarySearch ||
      (item.filename && item.filename.toLowerCase().includes(librarySearch.toLowerCase())) ||
      item.id.toLowerCase().includes(librarySearch.toLowerCase());

    if (mediaType === "video") {
      return searchMatch && (item.mimeType?.startsWith("video/") || item.id.includes(".mp4"));
    }
    if (mediaType === "image") {
      return searchMatch && (item.mimeType?.startsWith("image/") || !item.mimeType?.startsWith("video/"));
    }
    return searchMatch;
  });

  return (
    <div className="space-y-2">
      {/* Label and Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <label className="block text-xs font-bold text-ubumwe-900">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          {description && <p className="text-[11px] text-ink/60">{description}</p>}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={openLibrary}
            className="inline-flex items-center gap-1.5 rounded-pill border border-ubumwe-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-ubumwe-900 shadow-sm hover:bg-ubumwe-50 transition-colors"
          >
            <span>📁</span>
            <span>Choose from Uploaded Items</span>
          </button>

          <button
            type="button"
            onClick={() => setShowManualUrl(!showManualUrl)}
            className="text-[11px] text-ink/50 underline hover:text-ubumwe-900"
          >
            {showManualUrl ? "Hide manual URL" : "Or paste URL"}
          </button>
        </div>
      </div>

      {/* Manual URL input fallback if toggled */}
      {showManualUrl && (
        <div className="rounded-lg border border-dashed border-ubumwe-200 bg-ubumwe-50/40 p-2.5">
          <label className="block text-[10px] font-semibold text-ink/60 uppercase">Direct Asset URL</label>
          <input
            type="url"
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://..."
            className="mt-1 w-full rounded-md border border-ubumwe-200 px-2.5 py-1.5 text-xs text-ink focus:border-ubumwe focus:outline-none"
          />
        </div>
      )}

      {/* Main Upload Dropzone or Current File Preview */}
      {currentPreviewUrl ? (
        <div className="relative overflow-hidden rounded-xl border border-ubumwe-200 bg-white p-3 shadow-sm">
          <div className="flex items-start gap-4">
            {/* Preview Media Box */}
            <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-lg bg-black/5 border border-ubumwe-100">
              {isVideo ? (
                <video
                  src={currentPreviewUrl}
                  controls
                  className="h-full w-full object-cover"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={currentPreviewUrl}
                  alt="Uploaded preview"
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            {/* Info and Change Action */}
            <div className="flex flex-1 flex-col justify-between py-0.5">
              <div>
                <span className="inline-block rounded-full bg-imbuto-50 px-2 py-0.5 text-[10px] font-bold text-imbuto-700">
                  Active Asset
                </span>
                <p className="mt-1 line-clamp-1 text-xs font-semibold text-ubumwe-900 break-all">
                  {value}
                </p>
                <p className="mt-0.5 text-[11px] text-ink/50">
                  {isVideo ? "Video clip ready for hero streaming" : "High-resolution image ready for showcase"}
                </p>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-pill bg-ubumwe-900 px-3 py-1 text-[11px] font-bold text-white hover:bg-ubumwe-700 transition-colors"
                >
                  Upload New File
                </button>
                <button
                  type="button"
                  onClick={() => onChange("")}
                  className="rounded-pill bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-600 hover:bg-red-100 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State Dropzone */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all ${
            isDragOver
              ? "border-ubumwe bg-ubumwe-50/60 scale-[0.99]"
              : "border-ubumwe-200 bg-ubumwe-50/20 hover:border-ubumwe-400 hover:bg-ubumwe-50/40"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center py-2">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-ubumwe-900 border-t-transparent" />
              <p className="mt-2 text-xs font-bold text-ubumwe-900">Uploading to Murakaza Cloud...</p>
              <p className="text-[10px] text-ink/50">Saving permanently to Neon DB</p>
            </div>
          ) : (
            <>
              <div className="grid h-12 w-12 place-items-center rounded-full bg-white shadow-soft group-hover:scale-105 transition-transform">
                <span className="text-xl">{isVideo ? "🎬" : "📸"}</span>
              </div>
              <p className="mt-3 text-xs font-bold text-ubumwe-900">
                Click to browse or drag & drop {isVideo ? "video" : "image"} here
              </p>
              <p className="mt-1 text-[11px] text-ink/50">
                {isVideo
                  ? "MP4, WebM up to 45MB"
                  : "JPG, PNG, WebP, SVG up to 45MB"}
              </p>
              <span className="mt-2 inline-flex items-center gap-1 rounded-pill bg-white px-3 py-1 text-[10px] font-semibold text-ubumwe-900 shadow-sm border border-ubumwe-100">
                <span>Select from Computer</span>
              </span>
            </>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFileSelect(e.target.files[0]);
          }
        }}
        className="hidden"
      />

      {/* Error Display */}
      {error && (
        <p className="text-[11px] font-semibold text-red-600 bg-red-50 rounded-lg p-2 border border-red-100">
          ⚠️ {error}
        </p>
      )}

      {/* ============================================================ */}
      {/* UPLOADED ITEMS MEDIA LIBRARY MODAL */}
      {/* ============================================================ */}
      {showLibrary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="flex h-[80vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-floating overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-ubumwe-100 px-6 py-4">
              <div>
                <h3 className="text-base font-bold text-ubumwe-900">
                  📁 Uploaded Items Library
                </h3>
                <p className="text-xs text-ink/50">
                  Select any previously uploaded asset or upload a new one directly
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowLibrary(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-mist text-ink/60 hover:bg-ubumwe-100"
              >
                ✕
              </button>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ubumwe-50 bg-mist/50 px-6 py-3">
              <input
                type="text"
                value={librarySearch}
                onChange={(e) => setLibrarySearch(e.target.value)}
                placeholder="Search uploaded files..."
                className="w-64 rounded-lg border border-ubumwe-200 bg-white px-3 py-1.5 text-xs text-ink focus:border-ubumwe focus:outline-none"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-pill bg-ubumwe-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-ubumwe-700 shadow-sm"
              >
                <span>➕ Upload New Asset</span>
              </button>
            </div>

            {/* Gallery Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              {libraryLoading ? (
                <div className="flex h-48 items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-ubumwe-900 border-t-transparent" />
                </div>
              ) : filteredLibrary.length === 0 ? (
                <div className="flex h-48 flex-col items-center justify-center text-center">
                  <span className="text-3xl">📭</span>
                  <p className="mt-2 text-xs font-bold text-ubumwe-900">No uploaded files found</p>
                  <p className="text-[11px] text-ink/50">Upload an image or video above to populate this library.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {filteredLibrary.map((item) => {
                    const isItemVideo =
                      item.mimeType?.startsWith("video/") || item.id.includes(".mp4");
                    const isSelected = value === item.url || value?.includes(item.id);

                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          onChange(item.url);
                          setShowLibrary(false);
                        }}
                        className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border p-2 transition-all hover:shadow-soft ${
                          isSelected
                            ? "border-2 border-ubumwe-900 bg-ubumwe-50/50 ring-2 ring-ubumwe-900/20"
                            : "border-ubumwe-100 bg-white hover:border-ubumwe-300"
                        }`}
                      >
                        {/* Thumbnail */}
                        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black/10">
                          {isItemVideo ? (
                            <div className="relative h-full w-full bg-slate-900 flex items-center justify-center text-white">
                              <span className="text-xl">🎬</span>
                              <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1 text-[9px] font-bold">
                                VIDEO
                              </span>
                            </div>
                          ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={resolveMediaUrl(item.url)}
                              alt={item.filename || ""}
                              className="h-full w-full object-cover"
                            />
                          )}

                          {isSelected && (
                            <div className="absolute top-1 right-1 rounded-full bg-ubumwe-900 p-0.5 text-white text-[10px]">
                              ✓
                            </div>
                          )}
                        </div>

                        {/* File Details */}
                        <div className="mt-2 flex-1">
                          <p className="line-clamp-1 text-[11px] font-bold text-ubumwe-900">
                            {item.filename || item.id}
                          </p>
                          <div className="flex items-center justify-between text-[10px] text-ink/50 mt-0.5">
                            <span>{formatBytes(item.sizeBytes)}</span>
                            <span>{item.mimeType?.split("/")[1]?.toUpperCase() || "FILE"}</span>
                          </div>
                        </div>

                        {/* Delete button on hover */}
                        <button
                          type="button"
                          onClick={(e) => handleDeleteFromLibrary(item.id, e)}
                          title="Delete from server"
                          className="absolute top-2 left-2 rounded-full bg-white/90 p-1 text-xs text-red-600 shadow opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-opacity"
                        >
                          🗑️
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-ubumwe-100 bg-mist/30 px-6 py-3">
              <span className="text-xs text-ink/60">
                {filteredLibrary.length} item(s) available in library
              </span>
              <button
                type="button"
                onClick={() => setShowLibrary(false)}
                className="rounded-pill border border-ubumwe-200 bg-white px-4 py-1.5 text-xs font-semibold text-ink/70 hover:bg-mist"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
