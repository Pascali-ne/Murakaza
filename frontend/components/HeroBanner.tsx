"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { cms, catalog, CmsItem, CatalogItem } from "@/lib/api";
import { useLanguage, useLocalizedField } from "@/lib/i18n/LanguageContext";
import { useCart } from "@/context/CartContext";
import { CATALOG_ITEMS } from "@/lib/catalogData";

const FALLBACK_POSTER = "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&auto=format&fit=crop&q=80";
const FALLBACK_VIDEO = "https://assets.mixkit.co/videos/preview/mixkit-students-walking-in-a-university-campus-43187-large.mp4";

export default function HeroBanner() {
  const { t, language } = useLanguage();
  const { addItem } = useCart();
  const [cmsItem, setCmsItem] = useState<CmsItem | null>(null);
  const [materials, setMaterials] = useState<CatalogItem[]>([]);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [addedId, setAddedId] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // 1. Fetch CMS Hero Settings (video, poster, text)
  useEffect(() => {
    cms
      .getByKey("hero.video")
      .then((res) => setCmsItem(res.item))
      .catch(() => setCmsItem(null));
  }, []);

  // 2. Fetch Catalog School & Office Supplies for the sliding animation
  useEffect(() => {
    catalog
      .list({ type: "SUPPLY" })
      .then((res) => {
        if (res.supplies && res.supplies.length > 0) {
          setMaterials(res.supplies);
        } else {
          setMaterials(CATALOG_ITEMS.filter((i) => i.type === "SUPPLY"));
        }
      })
      .catch(() => {
        setMaterials(CATALOG_ITEMS.filter((i) => i.type === "SUPPLY"));
      });
  }, []);

  const title = useLocalizedField(cmsItem?.localizedFields, "title") || t("hero.title");
  const subtitle = useLocalizedField(cmsItem?.localizedFields, "subtitle") || t("hero.subtitle");
  const slidingTitle =
    useLocalizedField(cmsItem?.localizedFields, "slidingTitle") ||
    (language === "rw"
      ? "Ibikoresho by'ishuri n'ibiro biri muri poromosiyo"
      : "Featured School Supplies & Office Equipment");

  const videoUrl = cmsItem?.mediaUrl || FALLBACK_VIDEO;
  const posterUrl = cmsItem?.posterUrl || FALLBACK_POSTER;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleQuickAdd = (e: React.MouseEvent, item: CatalogItem) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(item, 1);
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  // Duplicate items array to achieve a seamless, infinite marquee loop
  const slidingList = materials.length > 0 ? [...materials, ...materials] : [];

  return (
    <section className="relative overflow-hidden bg-ubumwe-900 text-white">
      {/* --- HERO VIDEO & INTRO SECTION --- */}
      <div className="relative min-h-[580px] w-full pb-16 pt-12 md:min-h-[660px] md:pt-20">
        {/* Background Video with Gradient Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {videoUrl ? (
            <video
              ref={videoRef}
              className={`h-full w-full object-cover transition-opacity duration-1000 ${
                videoLoaded ? "opacity-45" : "opacity-0"
              }`}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={posterUrl}
              onLoadedData={() => setVideoLoaded(true)}
            >
              <source src={videoUrl} type="video/mp4" />
            </video>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={posterUrl} alt="" className="h-full w-full object-cover opacity-40" />
          )}

          {/* Cinematic lighting gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-ubumwe-900 via-ubumwe-900/70 to-ubumwe-900/40" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-ubumwe-600/30 via-transparent to-transparent" />
        </div>

        {/* Hero Content & CTA */}
        <div className="relative z-10 mx-auto flex max-w-6xl flex-col px-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Live Status Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-sun-600/30 bg-sun-600/10 px-3.5 py-1.5 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sun-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-sun-500"></span>
              </span>
              <span className="text-xs font-semibold tracking-wide text-sun-300">
                {language === "rw" ? "Ubufatanye na REB • Kigali & Uturere twose" : "REB Aligned • Fast Rwanda-wide Delivery"}
              </span>
            </div>

            {/* Video Controls Pill */}
            {videoUrl && (
              <div className="flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-3 py-1 text-xs backdrop-blur-md">
                <button
                  onClick={togglePlay}
                  className="flex items-center gap-1.5 transition-colors hover:text-sun-400"
                  title={isPlaying ? "Pause Video" : "Play Video"}
                >
                  <span>{isPlaying ? "⏸" : "▶"}</span>
                  <span className="hidden sm:inline">{isPlaying ? "Pause" : "Play"}</span>
                </button>
                <span className="text-white/30">|</span>
                <button
                  onClick={toggleMute}
                  className="flex items-center gap-1 transition-colors hover:text-sun-400"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  <span>{isMuted ? "🔇" : "🔊"}</span>
                </button>
              </div>
            )}
          </div>

          <div className="mt-8 max-w-3xl">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg lg:text-xl">
              {subtitle}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#supplies"
                className="inline-flex items-center justify-center gap-2 rounded-pill bg-sun-600 px-7 py-3.5 text-sm font-bold text-ubumwe-900 shadow-floating transition-all hover:scale-105 hover:bg-sun-700 active:scale-95"
              >
                <span>🎒</span>
                <span>{t("hero.ctaPrimary")}</span>
              </a>
              <a
                href="#courses"
                className="inline-flex items-center justify-center gap-2 rounded-pill border border-white/30 bg-white/5 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all hover:border-white hover:bg-white/10"
              >
                <span>🎓</span>
                <span>{t("hero.ctaSecondary")}</span>
              </a>
            </div>
          </div>
        </div>

        {/* --- ANIMATED VIDEO SLIDING TOOLS CAROUSEL (MARQUEE) --- */}
        <div className="relative z-10 mt-12 w-full">
          <div className="mx-auto mb-4 flex max-w-6xl items-center justify-between px-5">
            <div className="flex items-center gap-2">
              <span className="text-lg text-sun-400">⚡</span>
              <h2 className="text-sm font-bold uppercase tracking-wider text-white/90 sm:text-base">
                {slidingTitle}
              </h2>
            </div>
            <span className="text-xs text-white/60">
              {language === "rw" ? "Kanda ku gikoresho urebe birambuye" : "Hover to pause • Click to inspect"}
            </span>
          </div>

          {/* Marquee Track Container with gradient fade edges */}
          <div className="relative w-full overflow-hidden py-3">
            {/* Left & Right gradient edge fades */}
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-ubumwe-900 to-transparent sm:w-28" />
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-ubumwe-900 to-transparent sm:w-28" />

            {/* Sliding Marquee Rail */}
            <div className="animate-slide-marquee flex gap-4 pl-4">
              {slidingList.map((tool, idx) => {
                const langKey = (language === "rw" ? "rw" : "en") as "en" | "rw";
                const itemTitle = tool.title?.[langKey] || tool.title?.en || "";
                const isJustAdded = addedId === tool.id;

                return (
                  <Link
                    key={`${tool.id}-${idx}`}
                    href={`/products/${tool.id}`}
                    className="group relative flex h-72 w-56 shrink-0 flex-col overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-3 shadow-soft backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-sun-400/80 hover:bg-white/20 hover:shadow-floating"
                  >
                    {/* Badge */}
                    <div className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-ubumwe-900/85 px-2.5 py-0.5 text-[10px] font-bold tracking-wide text-sun-300 backdrop-blur-sm">
                      <span>✓</span>
                      <span>{tool.badge || "Essential"}</span>
                    </div>

                    {/* Image Container */}
                    <div className="relative h-36 w-full overflow-hidden rounded-xl bg-white/5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={tool.image}
                        alt={itemTitle}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>

                    {/* Content */}
                    <div className="mt-2.5 flex flex-1 flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-sun-300">
                          {tool.category}
                        </span>
                        <h3 className="line-clamp-2 text-xs font-bold leading-snug text-white group-hover:text-sun-300">
                          {itemTitle}
                        </h3>
                      </div>

                      {/* Pricing & Quick Add */}
                      <div className="mt-2 flex items-center justify-between pt-2 border-t border-white/10">
                        <div>
                          <p className="text-xs font-extrabold text-white">
                            {tool.priceRwf.toLocaleString()} <span className="text-[10px] text-white/70">RWF</span>
                          </p>
                          <p className="text-[10px] text-imbuto-300 font-medium">
                            {language === "rw" ? "Biri mu bubiko" : "In Stock"}
                          </p>
                        </div>

                        <button
                          onClick={(e) => handleQuickAdd(e, tool)}
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                            isJustAdded
                              ? "bg-imbuto-600 text-white scale-110"
                              : "bg-sun-600 text-ubumwe-900 hover:bg-sun-500 hover:scale-110"
                          }`}
                          title="Quick Add to Cart"
                        >
                          {isJustAdded ? "✓" : "+"}
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Trust Indicators Seam */}
      <div className="relative z-10 border-t border-white/10 bg-ubumwe-900/90 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-around gap-4 px-5 text-xs font-medium text-white/80 sm:text-sm">
          <div className="flex items-center gap-2">
            <span className="text-sun-400">📱</span>
            <span>{language === "rw" ? "Kwishyura na MoMo & Airtel Money" : "Instant MTN MoMo & Airtel Checkout"}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-imbuto-400">🚚</span>
            <span>{language === "rw" ? "Kugezwaho umunsi umwe i Kigali" : "Same-Day Delivery in Kigali"}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sun-400">🎓</span>
            <span>{language === "rw" ? "Integanyanyigisho yemejwe na REB" : "REB Aligned Curriculum & Exams"}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
