"use client";

import { useEffect, useState } from "react";
import { catalog, CatalogItem } from "@/lib/api";
import { useCart } from "@/lib/CartContext";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function CourseGrid() {
  const { locale, t } = useLanguage();
  const { addToCart } = useCart();
  const [courses, setCourses] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    catalog
      .list({ type: "COURSE" })
      .then((res) => {
        setCourses(res.courses || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section id="courses" className="mx-auto max-w-6xl px-5 py-16">
      <div className="rounded-card bg-imbuto-50/70 border border-imbuto-100 p-8 md:p-12">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-imbuto-700">
            {locale === "rw" ? "Amasomo y'Inzobere" : "Guided Rwandan Curriculum"}
          </span>
          <h2 className="mt-1 text-2xl font-bold text-ubumwe-900 md:text-3xl">
            {t("courses.title")}
          </h2>
          <p className="mt-2 max-w-prose text-ink/70">
            {t("courses.description")}
          </p>
        </div>

        {loading ? (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {[1, 2].map((n) => (
              <div key={n} className="h-64 animate-pulse rounded-card bg-white" />
            ))}
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {courses.map((course) => (
              <div
                key={course.id}
                className="flex flex-col sm:flex-row overflow-hidden rounded-card bg-white border border-imbuto-100 shadow-soft hover:shadow-floating transition-shadow"
              >
                <div className="relative h-48 sm:h-auto sm:w-48 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={course.image}
                    alt={course.title[locale] || course.title.en}
                    className="h-full w-full object-cover"
                  />
                  {course.level && (
                    <span className="absolute left-3 top-3 rounded-pill bg-imbuto-600 px-2 py-0.5 text-xs font-bold text-white shadow-soft">
                      {course.level}
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between text-xs text-ink/60 mb-1">
                    <span>⏱ {course.duration}</span>
                    <span className="text-sun-600 font-bold">★ {course.rating}</span>
                  </div>

                  <h3 className="font-bold text-ubumwe-900 leading-snug">
                    {course.title[locale] || course.title.en}
                  </h3>
                  <p className="mt-1 text-xs text-ink/50 font-medium">
                    👨‍🏫 {course.instructor}
                  </p>
                  <p className="mt-2 text-xs text-ink/70 line-clamp-2 flex-1">
                    {course.description[locale] || course.description.en}
                  </p>

                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-ubumwe-50">
                    <span className="font-display text-base font-extrabold text-imbuto-700">
                      {course.priceRwf.toLocaleString()} RWF
                    </span>
                    <button
                      onClick={() => addToCart(course)}
                      className="rounded-pill bg-ubumwe px-4 py-2 text-xs font-bold text-white hover:bg-ubumwe-900 active:scale-95 transition-all"
                    >
                      {locale === "rw" ? "Iyandikishe ubu" : "Enroll Now"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
