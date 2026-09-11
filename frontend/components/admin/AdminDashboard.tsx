"use client";

import { useEffect, useState } from "react";
import { cms, feedback as feedbackApi, CmsItem, FeedbackItem, AuthUser } from "@/lib/api";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import CmsEditor from "./CmsEditor";

type Tab = "content" | "feedback";

/**
 * Gate: render this only after confirming `user.role === "ADMIN"`
 * server-side (e.g. in a Next.js server component / middleware that
 * checks the JWT) — this component assumes it has already been
 * authorized and only handles the dashboard UI.
 */
export default function AdminDashboard({ user }: { user: AuthUser }) {
  const { t } = useLanguage();
  const [tab, setTab] = useState<Tab>("content");
  const [items, setItems] = useState<CmsItem[]>([]);
  const [pendingFeedback, setPendingFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fallbackCms: CmsItem[] = [
    {
      id: "cms-001",
      key: "hero.video",
      type: "HERO_VIDEO",
      mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-students-walking-in-a-university-campus-43187-large.mp4",
      posterUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80",
      isPublished: true,
      localizedFields: {
        en: { title: "Everything your student needs, in one welcoming place", subtitle: "Murakaza connects Rwandan families to affordable school supplies and guided courses." },
        rw: { title: "Ibyo umunyeshuri wawe akeneye byose, ahantu hamwe", subtitle: "Murakaza ihuza imiryango y'Abanyarwanda n'ibikoresho by'ishuri bihendutse n'amasomo ayoboye." }
      }
    },
    {
      id: "cms-002",
      key: "announcement.banner",
      type: "ANNOUNCEMENT",
      isPublished: true,
      localizedFields: {
        en: { title: "Term 1 School Reopening Special", subtitle: "Free delivery in Kigali on all exercise book packs over 20,000 RWF." },
        rw: { title: "Poromosiyo yo gutangira igihembwe cya 1", subtitle: "Kugezwaho ibikoresho ku buntu i Kigali ku bitabo birengeje 20,000 RWF." }
      }
    }
  ];

  const fallbackFeedback: FeedbackItem[] = [
    {
      id: "fb-001",
      authorName: "Diane Uwase (Parent, Kigali)",
      rating: 5,
      comment: "The exercise books and geometry set arrived within 24 hours in Kimironko. Payment via MTN MoMo was super smooth.",
      isApproved: true,
      isHidden: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: "fb-002",
      authorName: "Eric Makuza (P6 Student, Musanze)",
      rating: 5,
      comment: "The PLE sprint course helped me understand science questions that were giving me trouble.",
      isApproved: false,
      isHidden: false,
      createdAt: new Date().toISOString(),
    }
  ];

  async function refresh() {
    setLoading(true);
    try {
      const [cmsRes, feedbackRes] = await Promise.all([
        cms.listAllAdmin().catch(() => ({ items: fallbackCms })),
        feedbackApi.listAllAdmin().catch(() => ({ feedback: fallbackFeedback })),
      ]);
      setItems(cmsRes.items?.length ? cmsRes.items : fallbackCms);
      setPendingFeedback(feedbackRes.feedback?.length ? feedbackRes.feedback : fallbackFeedback);
    } catch {
      setItems(fallbackCms);
      setPendingFeedback(fallbackFeedback);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function moderate(id: string, patch: { isApproved?: boolean; isHidden?: boolean }) {
    try {
      await feedbackApi.moderate(id, patch);
    } catch {
      // Local optimistic update
      setPendingFeedback((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
      );
    }
    refresh();
  }

  async function deleteFeedback(id: string) {
    try {
      await feedbackApi.remove(id);
    } catch {
      setPendingFeedback((prev) => prev.filter((item) => item.id !== id));
    }
    refresh();
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ubumwe-900">{t("admin.dashboardTitle")}</h1>
        <span className="rounded-pill bg-imbuto-50 px-3 py-1 text-xs font-semibold text-imbuto-600">{user.fullName}</span>
      </div>

      <div className="mt-6 flex gap-2 border-b border-ubumwe-100">
        {(["content", "feedback"] as Tab[]).map((tabKey) => (
          <button
            key={tabKey}
            onClick={() => setTab(tabKey)}
            className={`px-4 py-2 text-sm font-semibold ${
              tab === tabKey ? "border-b-2 border-ubumwe text-ubumwe" : "text-ink/60"
            }`}
          >
            {tabKey === "content" ? t("admin.tabs.content") : t("admin.tabs.feedback")}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="mt-8 text-sm text-ink/60">…</p>
      ) : tab === "content" ? (
        <CmsEditor items={items} onSaved={refresh} />
      ) : (
        <FeedbackModerationPanel items={pendingFeedback} onModerate={moderate} onDelete={deleteFeedback} />
      )}
    </div>
  );
}

function FeedbackModerationPanel({
  items,
  onModerate,
  onDelete,
}: {
  items: FeedbackItem[];
  onModerate: (id: string, patch: { isApproved?: boolean; isHidden?: boolean }) => void;
  onDelete: (id: string) => void;
}) {
  const { t } = useLanguage();

  return (
    <div className="mt-6 grid gap-4">
      {items.map((item) => (
        <div key={item.id} className="flex items-start justify-between gap-4 rounded-card bg-white p-5 shadow-soft">
          <div>
            <p className="font-semibold text-ubumwe-900">
              {item.authorName} <span className="text-sun-600">{"★".repeat(item.rating)}</span>
            </p>
            <p className="mt-1 text-sm text-ink/80">{item.comment}</p>
            <p className="mt-2 text-xs font-semibold text-ink/50">
              {item.isHidden
                ? t("admin.feedbackModeration.hidden")
                : item.isApproved
                ? t("admin.feedbackModeration.approved")
                : t("admin.feedbackModeration.pending")}
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            {!item.isApproved && (
              <button
                onClick={() => onModerate(item.id, { isApproved: true, isHidden: false })}
                className="rounded-pill bg-imbuto-50 px-3 py-1.5 text-xs font-semibold text-imbuto-600"
              >
                {t("admin.feedbackModeration.approve")}
              </button>
            )}
            {!item.isHidden && (
              <button
                onClick={() => onModerate(item.id, { isHidden: true })}
                className="rounded-pill bg-ubumwe-50 px-3 py-1.5 text-xs font-semibold text-ubumwe"
              >
                {t("admin.feedbackModeration.hide")}
              </button>
            )}
            <button
              onClick={() => onDelete(item.id)}
              className="rounded-pill bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600"
            >
              {t("admin.feedbackModeration.delete")}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
