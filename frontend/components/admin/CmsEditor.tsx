"use client";

import { useState } from "react";
import { cms, CmsItem } from "@/lib/api";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const CONTENT_TYPES: CmsItem["type"][] = ["HERO_VIDEO", "BANNER_IMAGE", "THUMBNAIL", "PAGE_COPY", "ANNOUNCEMENT"];

const emptyDraft = (): Partial<CmsItem> => ({
  key: "",
  type: "PAGE_COPY",
  mediaUrl: "",
  posterUrl: "",
  isPublished: true,
  localizedFields: { en: { title: "", subtitle: "" }, rw: { title: "", subtitle: "" } },
});

export default function CmsEditor({ items, onSaved }: { items: CmsItem[]; onSaved: () => void }) {
  const { t } = useLanguage();
  const [draft, setDraft] = useState<Partial<CmsItem>>(emptyDraft());
  const [saving, setSaving] = useState(false);

  function loadForEdit(item: CmsItem) {
    setDraft(item);
  }

  function updateField(lang: "en" | "rw", field: string, value: string) {
    setDraft((prev) => ({
      ...prev,
      localizedFields: {
        en: prev.localizedFields?.en ?? {},
        rw: prev.localizedFields?.rw ?? {},
        [lang]: { ...(prev.localizedFields?.[lang] ?? {}), [field]: value },
      },
    }));
  }

  async function save() {
    setSaving(true);
    try {
      await cms.upsert(draft).catch(() => {});
      setDraft(emptyDraft());
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    await cms.remove(id).catch(() => {});
    onSaved();
  }

  return (
    <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      {/* Existing content list */}
      <div className="grid gap-3">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => loadForEdit(item)}
            className="rounded-card border border-ubumwe-100 bg-white p-4 text-left shadow-soft hover:border-ubumwe"
          >
            <p className="text-sm font-semibold text-ubumwe-900">{item.key}</p>
            <p className="text-xs text-ink/50">{item.type}</p>
          </button>
        ))}
      </div>

      {/* Editor form */}
      <div className="rounded-card bg-white p-6 shadow-soft">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-ink/80">
            {t("admin.content.keyLabel")}
            <input
              value={draft.key ?? ""}
              onChange={(e) => setDraft({ ...draft, key: e.target.value })}
              placeholder="hero.video"
              className="mt-1 w-full rounded-card border border-ubumwe-100 px-3 py-2 text-sm"
            />
          </label>

          <label className="text-sm font-medium text-ink/80">
            {t("admin.content.typeLabel")}
            <select
              value={draft.type}
              onChange={(e) => setDraft({ ...draft, type: e.target.value as CmsItem["type"] })}
              className="mt-1 w-full rounded-card border border-ubumwe-100 px-3 py-2 text-sm"
            >
              {CONTENT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-medium text-ink/80 sm:col-span-2">
            {t("admin.content.mediaUrlLabel")}
            <input
              value={draft.mediaUrl ?? ""}
              onChange={(e) => setDraft({ ...draft, mediaUrl: e.target.value })}
              placeholder="https://cdn.murakaza.rw/hero.mp4"
              className="mt-1 w-full rounded-card border border-ubumwe-100 px-3 py-2 text-sm"
            />
          </label>

          <label className="text-sm font-medium text-ink/80 sm:col-span-2">
            {t("admin.content.posterUrlLabel")}
            <input
              value={draft.posterUrl ?? ""}
              onChange={(e) => setDraft({ ...draft, posterUrl: e.target.value })}
              placeholder="https://cdn.murakaza.rw/hero-poster.jpg"
              className="mt-1 w-full rounded-card border border-ubumwe-100 px-3 py-2 text-sm"
            />
          </label>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-ubumwe-900">{t("admin.content.englishLabel")}</p>
            <input
              value={draft.localizedFields?.en?.title ?? ""}
              onChange={(e) => updateField("en", "title", e.target.value)}
              placeholder="Title"
              className="mt-2 w-full rounded-card border border-ubumwe-100 px-3 py-2 text-sm"
            />
            <textarea
              value={draft.localizedFields?.en?.subtitle ?? ""}
              onChange={(e) => updateField("en", "subtitle", e.target.value)}
              placeholder="Subtitle / body"
              rows={3}
              className="mt-2 w-full rounded-card border border-ubumwe-100 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-ubumwe-900">{t("admin.content.kinyarwandaLabel")}</p>
            <input
              value={draft.localizedFields?.rw?.title ?? ""}
              onChange={(e) => updateField("rw", "title", e.target.value)}
              placeholder="Umutwe"
              className="mt-2 w-full rounded-card border border-ubumwe-100 px-3 py-2 text-sm"
            />
            <textarea
              value={draft.localizedFields?.rw?.subtitle ?? ""}
              onChange={(e) => updateField("rw", "subtitle", e.target.value)}
              placeholder="Ibisobanuro"
              rows={3}
              className="mt-2 w-full rounded-card border border-ubumwe-100 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <label className="mt-4 flex items-center gap-2 text-sm font-medium text-ink/80">
          <input
            type="checkbox"
            checked={draft.isPublished ?? true}
            onChange={(e) => setDraft({ ...draft, isPublished: e.target.checked })}
          />
          {t("admin.content.publishedLabel")}
        </label>

        <div className="mt-6 flex gap-3">
          <button
            onClick={save}
            disabled={saving || !draft.key}
            className="rounded-pill bg-sun-600 px-6 py-2.5 text-sm font-bold text-ubumwe-900 shadow-soft disabled:opacity-50"
          >
            {t("admin.content.save")}
          </button>
          {draft.id && (
            <button
              onClick={() => remove(draft.id as string)}
              className="rounded-pill bg-red-50 px-6 py-2.5 text-sm font-bold text-red-600"
            >
              {t("admin.content.delete")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
