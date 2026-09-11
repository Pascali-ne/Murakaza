"use client";

import { useEffect, useState } from "react";
import { cms, CmsItem } from "@/lib/api";
import { useLanguage, useLocalizedField } from "@/lib/i18n/LanguageContext";

const FALLBACK_POSTER = "/media/hero-fallback-poster.jpg";

export default function HeroBanner() {
  const { t } = useLanguage();
  const [item, setItem] = useState<CmsItem | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Hero media is CMS-driven: the admin can swap the video source URL
  // without a redeploy. If the CMS call fails or hasn't been
  // configured yet, the component still renders with static copy.
  useEffect(() => {
    cms
      .getByKey("hero.video")
      .then((res) => setItem(res.item))
      .catch(() => setItem(null));
  }, []);

  const title = useLocalizedField(item?.localizedFields, "title") || t("hero.title");
  const subtitle = useLocalizedField(item?.localizedFields, "subtitle") || t("hero.subtitle");
  const videoUrl = item?.mediaUrl;
  const posterUrl = item?.posterUrl || FALLBACK_POSTER;

  return (
    <section className="relative overflow-hidden bg-ubumwe-900">
      <div className="relative h-[560px] w-full md:h-[640px]">
        {videoUrl ? (
          <video
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={posterUrl}
            onLoadedData={() => setLoaded(true)}
          >
            <source src={videoUrl.replace(/\.mp4$/, ".webm")} type="video/webm" />
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : (
          // Poster-only fallback while CMS hasn't provided a video yet.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={posterUrl} alt="" className="absolute inset-0 h-full w-full object-cover" loading="eager" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ubumwe-900/90 via-ubumwe-900/50 to-ubumwe-900/20" />

        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-center px-5">
          <h1 className="max-w-2xl text-4xl font-extrabold leading-tight text-white md:text-5xl">{title}</h1>
          <p className="mt-5 max-w-xl text-base text-white/85 md:text-lg">{subtitle}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#supplies" className="rounded-pill bg-sun-600 px-6 py-3 text-sm font-bold text-ubumwe-900 shadow-floating hover:bg-sun-700">
              {t("hero.ctaPrimary")}
            </a>
            <a href="#courses" className="rounded-pill border border-white/40 px-6 py-3 text-sm font-bold text-white hover:bg-white/10">
              {t("hero.ctaSecondary")}
            </a>
          </div>
        </div>
      </div>

      {/* Floating stat badge, anchored across the hero/content seam */}
      <div className="relative z-10 mx-auto -mt-8 max-w-6xl px-5">
        <div className="inline-flex items-center gap-3 rounded-card bg-white px-5 py-3 shadow-floating">
          <span className="grid h-8 w-8 place-items-center rounded-card bg-imbuto-50 text-imbuto-600">✓</span>
          <span className="text-sm font-semibold text-ubumwe-900">{t("hero.statBadge")}</span>
        </div>
      </div>
    </section>
  );
}
