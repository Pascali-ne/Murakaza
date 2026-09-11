"use client";

import { FormEvent, useEffect, useState } from "react";
import { feedback as feedbackApi, FeedbackItem } from "@/lib/api";
import { useLanguage } from "@/lib/i18n/LanguageContext";

type Status = "idle" | "submitting" | "success" | "error";

export default function FeedbackForm() {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [approved, setApproved] = useState<FeedbackItem[]>([]);

  useEffect(() => {
    feedbackApi
      .listApproved()
      .then((res) => setApproved(res.feedback))
      .catch(() => setApproved([]));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      await feedbackApi.submit({ authorName: name.trim(), rating, comment: comment.trim() });
      setStatus("success");
      setName("");
      setComment("");
      setRating(5);
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : t("feedback.errorMessage"));
    }
  }

  return (
    <section id="feedback" className="mx-auto max-w-6xl px-5 py-16">
      <h2 className="text-2xl font-bold text-ubumwe-900 md:text-3xl">{t("feedback.title")}</h2>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {/* Approved reviews */}
        <div className="grid gap-4">
          {approved.length === 0 && <p className="text-sm text-ink/60">—</p>}
          {approved.map((item) => (
            <article key={item.id} className="rounded-card bg-ubumwe-50 p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-ubumwe-900">{item.authorName}</p>
                <StarRow rating={item.rating} />
              </div>
              <p className="mt-2 text-sm text-ink/80">{item.comment}</p>
            </article>
          ))}
        </div>

        {/* Submission form */}
        <form onSubmit={handleSubmit} className="rounded-card bg-white p-6 shadow-soft">
          <h3 className="font-display text-lg font-bold text-ubumwe-900">{t("feedback.formTitle")}</h3>

          <label className="mt-4 block text-sm font-medium text-ink/80">
            {t("feedback.nameLabel")}
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={80}
              className="mt-1 w-full rounded-card border border-ubumwe-100 px-4 py-2 text-sm focus-visible:outline-sun-600"
            />
          </label>

          <fieldset className="mt-4">
            <legend className="text-sm font-medium text-ink/80">{t("feedback.ratingLabel")}</legend>
            <div className="mt-1 flex gap-1">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  type="button"
                  key={value}
                  aria-label={`${value} star`}
                  aria-pressed={rating === value}
                  onClick={() => setRating(value)}
                  className={`text-2xl leading-none ${value <= rating ? "text-sun-600" : "text-ubumwe-100"}`}
                >
                  ★
                </button>
              ))}
            </div>
          </fieldset>

          <label className="mt-4 block text-sm font-medium text-ink/80">
            {t("feedback.commentLabel")}
            <textarea
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={1000}
              rows={4}
              placeholder={t("feedback.commentPlaceholder")}
              className="mt-1 w-full rounded-card border border-ubumwe-100 px-4 py-2 text-sm focus-visible:outline-sun-600"
            />
          </label>

          <button
            type="submit"
            disabled={status === "submitting"}
            className="mt-5 w-full rounded-pill bg-sun-600 px-6 py-3 text-sm font-bold text-ubumwe-900 shadow-soft hover:bg-sun-700 disabled:opacity-60"
          >
            {status === "submitting" ? t("feedback.submitting") : t("feedback.submit")}
          </button>

          {status === "success" && <p className="mt-3 text-sm text-imbuto-600">{t("feedback.successMessage")}</p>}
          {status === "error" && <p className="mt-3 text-sm text-red-600">{errorMessage}</p>}
        </form>
      </div>
    </section>
  );
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div aria-label={`${rating} out of 5 stars`} className="text-sun-600">
      {"★".repeat(rating)}
      <span className="text-ubumwe-100">{"★".repeat(5 - rating)}</span>
    </div>
  );
}
