// app/components/ContactUs.tsx
"use client";

import React, { useState } from "react";
import AnimatedBlurText from "@/components/AnimatedBlurText";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  contactNumber: string;
  query: string;
};

export default function ContactUs() {
  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    query: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "sent">("idle");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    // Replace this with your API call / email service
    console.log("[ContactUs] submit payload:", form);

    // tiny fake delay for UX
    await new Promise((r) => setTimeout(r, 400));
    setStatus("sent");

    // optional: clear form
    setForm({ firstName: "", lastName: "", email: "", contactNumber: "", query: "" });

    setTimeout(() => setStatus("idle"), 1800);
  };

  return (
    <section className="w-full bg-black text-white">
      <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
        {/* Eyebrow */}
        <div className="flex items-center gap-3 text-white/80">
          <span className="h-px w-10 bg-white/70" />
          <span className="text-xs font-semibold tracking-[0.22em] uppercase">
            Contact
          </span>
        </div>

        {/* Keep your animated text exactly */}
        <h2
          className="
            mt-6
            font-['Inter',ui-sans-serif,system-ui]
            text-4xl sm:text-5xl md:text-6xl
            leading-[1.05]
            tracking-tight
            font-medium
          "
        >
          <AnimatedBlurText
            lines={["We’d Love to Hear From You Get", "in "]}
            liteText="Touch with Us Today!"
          />
        </h2>

        <p className="mt-5 max-w-2xl text-[16px] leading-6 text-white/60">
          Share a few details and we’ll get back to you. No spam, no fluff.
        </p>

        {/* Clean form card */}
        <div className="mt-10">
          <div
            className="
              rounded-2xl
              bg-[#0e0e12]
              ring-1 ring-white/10
              shadow-[0_28px_120px_rgba(0,0,0,0.65)]
              overflow-hidden
            "
          >
            <form onSubmit={onSubmit} className="p-6 sm:p-8">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* First Name */}
                <label className="flex flex-col gap-2">
                  <span className="text-sm text-white/80">First Name</span>
                  <input
                    required
                    value={form.firstName}
                    onChange={(e) => setForm((p) => ({ ...p, firstName: e.target.value }))}
                    placeholder="Jane"
                    className="
                      h-11 rounded-xl
                      bg-black/70
                      px-4
                      text-[15px] text-white/90 placeholder:text-white/35
                      ring-1 ring-white/10
                      outline-none
                      focus:ring-white/25
                      transition
                    "
                  />
                </label>

                {/* Last Name */}
                <label className="flex flex-col gap-2">
                  <span className="text-sm text-white/80">Last Name</span>
                  <input
                    required
                    value={form.lastName}
                    onChange={(e) => setForm((p) => ({ ...p, lastName: e.target.value }))}
                    placeholder="Smith"
                    className="
                      h-11 rounded-xl
                      bg-black/70
                      px-4
                      text-[15px] text-white/90 placeholder:text-white/35
                      ring-1 ring-white/10
                      outline-none
                      focus:ring-white/25
                      transition
                    "
                  />
                </label>

                {/* Email */}
                <label className="flex flex-col gap-2 sm:col-span-2">
                  <span className="text-sm text-white/80">Email</span>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    placeholder="jane@company.com"
                    className="
                      h-11 rounded-xl
                      bg-black/70
                      px-4
                      text-[15px] text-white/90 placeholder:text-white/35
                      ring-1 ring-white/10
                      outline-none
                      focus:ring-white/25
                      transition
                    "
                  />
                </label>

                {/* Contact Number */}
                <label className="flex flex-col gap-2 sm:col-span-2">
                  <span className="text-sm text-white/80">Contact Number</span>
                  <input
                    required
                    type="tel"
                    value={form.contactNumber}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, contactNumber: e.target.value }))
                    }
                    placeholder="+91 9876543210"
                    className="
                      h-11 rounded-xl
                      bg-black/70
                      px-4
                      text-[15px] text-white/90 placeholder:text-white/35
                      ring-1 ring-white/10
                      outline-none
                      focus:ring-white/25
                      transition
                    "
                  />
                </label>

                {/* Query */}
                <label className="flex flex-col gap-2 sm:col-span-2">
                  <span className="text-sm text-white/80">Your Message</span>
                  <textarea
                    required
                    value={form.query}
                    onChange={(e) => setForm((p) => ({ ...p, query: e.target.value }))}
                    placeholder="Tell us what you need help with..."
                    rows={6}
                    className="
                      rounded-xl
                      bg-black/70
                      px-4 py-3
                      text-[15px] text-white/90 placeholder:text-white/35
                      ring-1 ring-white/10
                      outline-none
                      focus:ring-white/25
                      transition
                      resize-y
                    "
                  />
                </label>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-white/50">
                  By submitting, you agree to be contacted back regarding your query.
                </div>

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className={[
                    "h-11",
                    "rounded-full",
                    "px-6",
                    "font-semibold",
                    "text-[15px]",
                    "bg-white text-black",
                    "ring-1 ring-white/10",
                    "shadow-[0_18px_70px_rgba(0,0,0,0.55)]",
                    "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    "hover:scale-[1.01] active:scale-[0.98]",
                    "disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100",
                  ].join(" ")}
                >
                  {status === "submitting"
                    ? "Sending..."
                    : status === "sent"
                    ? "Sent"
                    : "Submit"}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-6 text-sm text-white/55">
            Prefer email?{" "}
            <a
              className="text-white/85 underline underline-offset-4 hover:text-white"
              href="mailto:info@aicron.com"
            >
              info@aicron.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
