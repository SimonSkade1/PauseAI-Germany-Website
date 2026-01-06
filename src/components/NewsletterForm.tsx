"use client";

import React, { useState, FormEvent } from "react";

const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSet8gf61pTqCYv4Fa1OAKGt6BizTKBaeyTTqIyhdlbaoOf5iw/formResponse";
const GOOGLE_FORM_EMAIL_ENTRY = "entry.1229172991";

export default function NewsletterForm({ variant = "light" }: { variant?: "light" | "dark" | "orange" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    try {
      // Submit to Google Forms using no-cors mode
      await fetch(GOOGLE_FORM_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          [GOOGLE_FORM_EMAIL_ENTRY]: email,
        }),
      });

      // With no-cors we can't read the response, but if no error was thrown, assume success
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <p className={`font-body ${variant === "light" ? "text-pause-black" : variant === "orange" ? "text-black" : "text-white"}`}>
        Danke für deine Anmeldung!
      </p>
    );
  }

  const inputClass = variant === "light" ? "newsletter-input-light" : variant === "orange" ? "newsletter-input-orange" : "newsletter-input";
  const sizeClass = variant === "light" ? "px-4 py-3 text-base" : "px-4 py-2 text-sm";
  const buttonSizeClass = variant === "light" ? "px-6 py-3 text-sm" : "px-4 py-2 text-xs";
  const buttonClass = variant === "orange" ? "bg-black text-white hover:bg-gray-800" : "btn-orange";

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row ${variant === "light" ? "gap-3" : "gap-2"}`}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={variant === "light" ? "Deine E-Mail-Adresse" : "E-Mail-Adresse"}
        className={`${inputClass} flex-1 ${sizeClass} rounded-lg font-body`}
        required
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className={`${buttonClass} ${buttonSizeClass} rounded-lg font-section tracking-wider whitespace-nowrap disabled:opacity-50 transition-colors`}
      >
        {status === "loading" ? "..." : "Abonnieren"}
      </button>
    </form>
  );
}
