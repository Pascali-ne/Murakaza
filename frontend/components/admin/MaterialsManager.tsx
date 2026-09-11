"use client";

import { useEffect, useState } from "react";
import { catalog, CatalogItem } from "@/lib/api";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { CATALOG_ITEMS } from "@/lib/catalogData";

const CATEGORIES = [
  "stationery",
  "instruments",
  "backpacks",
  "electronics",
  "office-supplies",
  "art-craft",
  "stem",
  "uniforms",
  "lifestyle",
  "exam-prep",
  "ict",
  "languages"
];

const emptyItem = (): Partial<CatalogItem> => ({
  type: "SUPPLY",
  category: "stationery",
  priceRwf: 5000,
  amountCents: 500000,
  rating: 5.0,
  reviewsCount: 1,
  badge: "New",
  stock: 100,
  image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&auto=format&fit=crop&q=80",
  title: { en: "", rw: "" },
  description: { en: "", rw: "" },
});

export default function MaterialsManager() {
  const { t, language } = useLanguage();
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [editingItem, setEditingItem] = useState<Partial<CatalogItem> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  async function loadItems() {
    setLoading(true);
    try {
      const res = await catalog.list({ type: "ALL" });
      if (res.items && res.items.length > 0) {
        setItems(res.items);
      } else {
        setItems(CATALOG_ITEMS);
      }
    } catch {
      setItems(CATALOG_ITEMS);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  function showMessage(text: string, type: "success" | "error" = "success") {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 3500);
  }

  function handleOpenCreate() {
    setEditingItem(emptyItem());
    setIsNew(true);
  }

  function handleOpenEdit(item: CatalogItem) {
    setEditingItem({ ...item });
    setIsNew(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editingItem) return;
    if (!editingItem.title?.en || !editingItem.priceRwf) {
      showMessage("Please provide English Title and Price in RWF", "error");
      return;
    }

    setSaving(true);
    try {
      if (isNew) {
        await catalog.create(editingItem);
        showMessage("Material created successfully!");
      } else if (editingItem.id) {
        await catalog.update(editingItem.id, editingItem);
        showMessage("Material updated successfully!");
      }
      setEditingItem(null);
      await loadItems();
    } catch (err: unknown) {
      const error = err as Error;
      showMessage(error.message || "Failed to save item.", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      await catalog.remove(id);
      showMessage(`"${name}" removed successfully.`);
      await loadItems();
    } catch (err: unknown) {
      const error = err as Error;
      showMessage(error.message || "Failed to remove item.", "error");
    }
  }

  const filteredItems = items.filter((item) => {
    const titleEn = item.title?.en?.toLowerCase() || "";
    const titleRw = item.title?.rw?.toLowerCase() || "";
    const q = search.toLowerCase();
    const matchesSearch = titleEn.includes(q) || titleRw.includes(q) || item.category?.toLowerCase().includes(q);
    const matchesCat = activeCategory === "all" || item.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="mt-6">
      {/* Header Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-ubumwe-900">
            {language === "rw" ? "Gucunga Ibikoresho n'Amasomo" : "School Materials & Catalog Manager"}
          </h2>
          <p className="mt-1 text-xs text-ink/60">
            {language === "rw"
              ? "Ongera, hindura cyangwa suzuma ibikoresho by'ishuri n'ibiro n'amasomo bigaragara ku rubuga."
              : "Add, edit, change prices, update stock, and control items featured in the hero sliding showcase."}
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 rounded-pill bg-imbuto-600 px-5 py-2.5 text-xs font-bold text-white shadow-soft transition-all hover:bg-imbuto-900"
        >
          <span>＋</span>
          <span>{language === "rw" ? "Ongeraho Igikoresho Gishya" : "Add New Material"}</span>
        </button>
      </div>

      {/* Status Alert */}
      {statusMessage && (
        <div
          className={`mt-4 rounded-card px-4 py-3 text-xs font-semibold ${
            statusMessage.type === "success"
              ? "border border-imbuto-200 bg-imbuto-50 text-imbuto-900"
              : "border border-red-200 bg-red-50 text-red-900"
          }`}
        >
          {statusMessage.text}
        </div>
      )}

      {/* Filters & Search */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === "rw" ? "Shakisha igikoresho..." : "Search materials by title or category..."}
            className="w-full rounded-card border border-ubumwe-100 bg-white px-4 py-2.5 text-xs text-ink placeholder:text-ink/40 focus:border-ubumwe focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setActiveCategory("all")}
            className={`rounded-pill px-3 py-1.5 font-semibold transition-colors ${
              activeCategory === "all" ? "bg-ubumwe-900 text-white" : "bg-white text-ink/70 hover:bg-ubumwe-50"
            }`}
          >
            All ({items.length})
          </button>
          <button
            onClick={() => setActiveCategory("stationery")}
            className={`rounded-pill px-3 py-1.5 font-semibold transition-colors ${
              activeCategory === "stationery" ? "bg-ubumwe-900 text-white" : "bg-white text-ink/70 hover:bg-ubumwe-50"
            }`}
          >
            Stationery
          </button>
          <button
            onClick={() => setActiveCategory("office-supplies")}
            className={`rounded-pill px-3 py-1.5 font-semibold transition-colors ${
              activeCategory === "office-supplies" ? "bg-ubumwe-900 text-white" : "bg-white text-ink/70 hover:bg-ubumwe-50"
            }`}
          >
            Office
          </button>
          <button
            onClick={() => setActiveCategory("stem")}
            className={`rounded-pill px-3 py-1.5 font-semibold transition-colors ${
              activeCategory === "stem" ? "bg-ubumwe-900 text-white" : "bg-white text-ink/70 hover:bg-ubumwe-50"
            }`}
          >
            STEM
          </button>
        </div>
      </div>

      {/* Materials Table */}
      <div className="mt-6 overflow-hidden rounded-card border border-ubumwe-100 bg-white shadow-soft">
        {loading ? (
          <div className="p-8 text-center text-xs text-ink/50">Loading materials catalog...</div>
        ) : filteredItems.length === 0 ? (
          <div className="p-8 text-center text-xs text-ink/50">No materials matched your search.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-ubumwe-100 bg-mist font-semibold text-ubumwe-900">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Type & Category</th>
                  <th className="px-4 py-3">Price (RWF)</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Badge</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ubumwe-50 text-ink/80">
                {filteredItems.map((item) => {
                  const langKey = (language === "rw" ? "rw" : "en") as "en" | "rw";
                  const displayTitle = item.title?.[langKey] || item.title?.en || "";

                  return (
                    <tr key={item.id} className="hover:bg-ubumwe-50/40 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.image}
                            alt=""
                            className="h-10 w-10 shrink-0 rounded-lg object-cover bg-mist border border-ubumwe-100"
                          />
                          <div>
                            <p className="font-bold text-ubumwe-900 line-clamp-1">{displayTitle}</p>
                            <p className="text-[11px] text-ink/50">ID: {item.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-block rounded-full bg-ubumwe-50 px-2 py-0.5 text-[10px] font-bold text-ubumwe-900">
                          {item.type}
                        </span>
                        <p className="text-[11px] text-ink/50 capitalize mt-0.5">{item.category}</p>
                      </td>
                      <td className="px-4 py-3 font-bold text-ubumwe-900">
                        {item.priceRwf?.toLocaleString()} RWF
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block font-semibold ${
                            (item.stock ?? 0) < 20 ? "text-red-600" : "text-imbuto-600"
                          }`}
                        >
                          {item.stock ?? 0} in stock
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {item.badge ? (
                          <span className="rounded-full bg-sun-100 px-2.5 py-0.5 text-[10px] font-bold text-sun-700">
                            {item.badge}
                          </span>
                        ) : (
                          <span className="text-ink/30">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="rounded-pill bg-ubumwe-50 px-3 py-1 text-xs font-semibold text-ubumwe-900 hover:bg-ubumwe-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, displayTitle)}
                            className="rounded-pill bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-100"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-floating">
            <div className="flex items-center justify-between border-b border-ubumwe-100 pb-4">
              <h3 className="text-lg font-bold text-ubumwe-900">
                {isNew ? "Add New School Material / Item" : `Edit Material: ${editingItem.id}`}
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="grid h-8 w-8 place-items-center rounded-full bg-mist text-ink/60 hover:bg-ubumwe-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-5 space-y-4 text-xs">
              {/* English & Kinyarwanda Titles */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-semibold text-ubumwe-900">Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.title?.en || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        title: { ...editingItem.title, en: e.target.value, rw: editingItem.title?.rw || "" },
                      })
                    }
                    placeholder="e.g. Precision Geometry Set"
                    className="mt-1 w-full rounded-lg border border-ubumwe-100 px-3 py-2 text-ink focus:border-ubumwe focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-ubumwe-900">Title (Kinyarwanda)</label>
                  <input
                    type="text"
                    value={editingItem.title?.rw || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        title: { ...editingItem.title, rw: e.target.value, en: editingItem.title?.en || "" },
                      })
                    }
                    placeholder="e.g. Agasanduku k'ibikoresho bya Matematika"
                    className="mt-1 w-full rounded-lg border border-ubumwe-100 px-3 py-2 text-ink focus:border-ubumwe focus:outline-none"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-semibold text-ubumwe-900">Description (English)</label>
                  <textarea
                    rows={2}
                    value={editingItem.description?.en || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        description: {
                          ...editingItem.description,
                          en: e.target.value,
                          rw: editingItem.description?.rw || "",
                        },
                      })
                    }
                    placeholder="Key specifications, grade levels, and features..."
                    className="mt-1 w-full rounded-lg border border-ubumwe-100 px-3 py-2 text-ink focus:border-ubumwe focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-ubumwe-900">Description (Kinyarwanda)</label>
                  <textarea
                    rows={2}
                    value={editingItem.description?.rw || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        description: {
                          ...editingItem.description,
                          rw: e.target.value,
                          en: editingItem.description?.en || "",
                        },
                      })
                    }
                    placeholder="Ibisobanuro mu Kinyarwanda..."
                    className="mt-1 w-full rounded-lg border border-ubumwe-100 px-3 py-2 text-ink focus:border-ubumwe focus:outline-none"
                  />
                </div>
              </div>

              {/* Price, Stock, Category, Type */}
              <div className="grid gap-4 sm:grid-cols-4">
                <div>
                  <label className="block font-semibold text-ubumwe-900">Price (RWF) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={editingItem.priceRwf || 0}
                    onChange={(e) => setEditingItem({ ...editingItem, priceRwf: Number(e.target.value) })}
                    className="mt-1 w-full rounded-lg border border-ubumwe-100 px-3 py-2 text-ink focus:border-ubumwe focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-ubumwe-900">Stock Count</label>
                  <input
                    type="number"
                    min={0}
                    value={editingItem.stock || 0}
                    onChange={(e) => setEditingItem({ ...editingItem, stock: Number(e.target.value) })}
                    className="mt-1 w-full rounded-lg border border-ubumwe-100 px-3 py-2 text-ink focus:border-ubumwe focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-ubumwe-900">Type</label>
                  <select
                    value={editingItem.type || "SUPPLY"}
                    onChange={(e) => setEditingItem({ ...editingItem, type: e.target.value as "SUPPLY" | "COURSE" })}
                    className="mt-1 w-full rounded-lg border border-ubumwe-100 px-3 py-2 text-ink focus:border-ubumwe focus:outline-none"
                  >
                    <option value="SUPPLY">School Supply</option>
                    <option value="COURSE">Course</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-ubumwe-900">Category</label>
                  <select
                    value={editingItem.category || "stationery"}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="mt-1 w-full rounded-lg border border-ubumwe-100 px-3 py-2 text-ink focus:border-ubumwe focus:outline-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Badge & Image URL */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block font-semibold text-ubumwe-900">Badge Label</label>
                  <input
                    type="text"
                    value={editingItem.badge || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, badge: e.target.value })}
                    placeholder="Popular, Essential, Teacher Choice..."
                    className="mt-1 w-full rounded-lg border border-ubumwe-100 px-3 py-2 text-ink focus:border-ubumwe focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-ubumwe-900">Image URL</label>
                  <input
                    type="url"
                    value={editingItem.image || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="mt-1 w-full rounded-lg border border-ubumwe-100 px-3 py-2 text-ink focus:border-ubumwe focus:outline-none"
                  />
                </div>
              </div>

              {/* Image Preview */}
              {editingItem.image && (
                <div className="mt-2 flex items-center gap-3 rounded-xl border border-ubumwe-100 bg-mist p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={editingItem.image} alt="Preview" className="h-16 w-16 rounded-lg object-cover" />
                  <div>
                    <p className="font-semibold text-ubumwe-900">Image Preview</p>
                    <p className="text-[11px] text-ink/50">This photo will display in the catalog and the hero sliding showcase.</p>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-ubumwe-100">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="rounded-pill border border-ubumwe-200 px-5 py-2 font-semibold text-ink/70 hover:bg-mist"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-pill bg-ubumwe-900 px-6 py-2 font-bold text-white shadow-soft hover:bg-ubumwe-600 disabled:opacity-50"
                >
                  {saving ? "Saving..." : isNew ? "Create Material" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
