"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

type BannerEvent = { name: string; date: string; url: string };

function formatEventDate(start_at: string, timezone: string) {
  const startDate = new Date(start_at);
  const tz = timezone || "Europe/Berlin";
  const day = new Intl.DateTimeFormat("de-DE", { day: "numeric", month: "long", timeZone: tz }).format(startDate);
  const hour = new Intl.DateTimeFormat("de-DE", { hour: "numeric", hour12: false, timeZone: tz }).format(startDate);
  return `${day} · ${hour} Uhr`;
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [eventCallout, setEventCallout] = useState<BannerEvent | null>(null);

  useEffect(() => {
    fetch("/api/next-event")
      .then((res) => res.json())
      .then((data) => {
        const ev = data?.featured || data?.next;
        if (ev) {
          setEventCallout({
            name: ev.name,
            date: formatEventDate(ev.start_at, ev.timezone),
            url: `https://lu.ma/${ev.url}`,
          });
        }
      })
      .catch(() => {});
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Desktop navigation links
  const desktopNavLinks = [
    {
      href: "/mitmachen",
      label: "Mitmachen",
      external: false,
      sublinks: [
        { href: "/mitmachen", label: "Kennen lernen" },
        { href: "/aktionen", label: "Aktiv werden" },
        { href: "/contactlawmakers", label: "Politik kontaktieren" },
        { href: "/spenden", label: "Spenden" },
      ]
    },
    { href: "/informieren", label: "Informieren", external: false },
    { href: "/ueber-uns", label: "Über uns", external: false },
    { href: "/shop", label: "Shop", external: false, disabled: true },
  ];

  // Mobile menu structure with sublinks
  const mobileMenuItems = [
    { href: "https://pauseaide.substack.com/p/kis-die-eigenstandig-hacken-konnen", label: "Neuer Blog: KIs, die eigenständig hacken", external: true, noIcon: true, megaphone: true },
    { href: "/", label: "Startseite", external: false },
    {
      href: "/mitmachen",
      label: "Mitmachen",
      external: false,
      sublinks: [
        { href: "/mitmachen", label: "Kennen lernen" },
        { href: "/aktionen", label: "Aktiv werden" },
        { href: "/contactlawmakers", label: "Politik kontaktieren" },
        { href: "/spenden", label: "Spenden" },
      ]
    },
    { href: "/informieren", label: "Informieren", external: false },
    { href: "/ueber-uns", label: "Über uns", external: false },
    { href: "/shop", label: "Shop", external: false, disabled: true },
    { href: "/kontakt", label: "Kontakt", external: false },
    { href: "https://pauseai.info", label: "International", external: true },
  ];

  return (
    <>
      <header
        className="fixed left-0 right-0 top-0 z-50 bg-[#FF9416]"
      >
        <div className="flex items-center justify-between px-8 md:px-16 lg:px-24 py-3">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <Image
              src="/logos/logo-wordmark-outlined.png"
              alt="PauseAI Logo"
              width={140}
              height={40}
              className="h-10"
              style={{ width: "auto" }}
              priority
            />
          </Link>

          {/* Center callout: event takes priority, otherwise blog post */}
          <div className="flex flex-1 justify-center mx-4">
            {/* Mobile: always show "News →" which opens the menu */}
            <button
              onClick={toggleMenu}
              className="md:hidden font-section text-sm tracking-wider text-black hover:text-white transition-colors flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 10v4h3l7 4.5V5.5L6 10H3z"/><path d="M15 9.5a4 4 0 010 5"/><path d="M18 7.5a7 7 0 010 9"/></svg>
              News <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </button>
            {/* Desktop: event takes priority, then blog post */}
            {eventCallout ? (
              <a
                href={eventCallout.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex group items-center gap-2 max-w-sm lg:max-w-md"
              >
                <span className="font-section text-[10px] uppercase tracking-wider text-black/50 shrink-0">Event</span>
                <span className="w-px h-3 bg-black/30 shrink-0" />
                <span className="font-section text-sm tracking-wider text-black group-hover:text-white transition-colors truncate">{eventCallout.name}</span>
                <span className="font-body text-xs text-black/60 group-hover:text-white/80 transition-colors hidden lg:inline shrink-0">{eventCallout.date}</span>
                <span className="text-black/50 group-hover:text-white transition-colors text-xs shrink-0">→</span>
              </a>
            ) : (
              <a
                href="https://pauseaide.substack.com/p/kis-die-eigenstandig-hacken-konnen"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex group items-center gap-2 max-w-sm lg:max-w-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 shrink-0 text-black group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 10v4h3l7 4.5V5.5L6 10H3z"/><path d="M15 9.5a4 4 0 010 5"/><path d="M18 7.5a7 7 0 010 9"/></svg>
                <span className="font-section text-[10px] uppercase tracking-wider text-black/50 shrink-0">Neuer Blog</span>
                <span className="w-px h-3 bg-black/30 shrink-0" />
                <span className="font-section text-sm tracking-wider text-black group-hover:text-white transition-colors truncate">KIs, die eigenständig hacken</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0 text-black group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </a>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {desktopNavLinks.map((link) => {
              if ("disabled" in link && link.disabled) {
                return (
                  <span
                    key={link.href}
                    className="relative font-section text-sm tracking-wider text-black/50 cursor-not-allowed md:text-base group"
                  >
                    {link.label}
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#1a1a1a] text-white text-xs px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      Bald verfügbar
                    </span>
                  </span>
                );
              }
              const hasSublinks = "sublinks" in link && link.sublinks;
              return hasSublinks ? (
                <div
                  key={link.href}
                  className="relative group"
                >
                  <Link href="/#was-du-tun-kannst" className="font-section text-sm tracking-wider text-black transition-colors hover:text-white md:text-base cursor-pointer inline-flex items-center gap-1">
                    {link.label}
                    <svg className="w-3 h-3 transition-transform group-hover:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="bg-[#1a1a1a] rounded-lg shadow-xl py-2 min-w-[220px]">
                      {link.sublinks!.map((sublink) => (
                        <Link
                          key={sublink.href}
                          href={sublink.href}
                          className="block px-5 py-2.5 font-section text-sm tracking-wider text-white/90 hover:text-white hover:bg-[#FF9416] transition-colors first:rounded-t-lg last:rounded-b-lg"
                        >
                          {sublink.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-section text-sm tracking-wider text-black transition-colors hover:text-white md:text-base"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-section text-sm tracking-wider text-black transition-colors hover:text-white md:text-base"
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 gap-1.5"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <span
              className={`block w-6 h-0.5 bg-black transition-all duration-300 ${
                isMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-black transition-all duration-300 ${
                isMenuOpen ? "-rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </header>

      {/* Mobile Full-Screen Overlay Menu - Dark Elegant Style */}
      <div
        className={`fixed inset-0 z-40 bg-[#1a1a1a] flex flex-col items-start justify-start pt-24 pl-8 pr-8 transition-opacity duration-300 md:hidden ${
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col items-start gap-6">
          {mobileMenuItems.map((item) => {
            const isDisabled = "disabled" in item && item.disabled;
            return (
              <div key={item.href} className="flex flex-col items-start">
                {isDisabled ? (
                  <span className="font-body text-2xl text-white/40 cursor-not-allowed flex items-center gap-3 relative group">
                    <svg className="w-4 h-4 text-white/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="square" strokeLinejoin="miter" />
                    </svg>
                    {item.label}
                    <span className="absolute left-full ml-3 top-1/2 -translate-y-1/2 whitespace-nowrap bg-[#FF9416] text-black text-sm px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      Coming soon
                    </span>
                  </span>
                ) : item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={closeMenu}
                    className="font-body text-2xl text-white transition-colors hover:text-[#FF9416] flex items-center gap-3"
                  >
                    {!("noIcon" in item && item.noIcon) && (
                      <svg className="w-4 h-4 text-[#FF9416]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="square" strokeLinejoin="miter" />
                      </svg>
                    )}
                    {"megaphone" in item && item.megaphone && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 10v4h3l7 4.5V5.5L6 10H3z"/><path d="M15 9.5a4 4 0 010 5"/><path d="M18 7.5a7 7 0 010 9"/></svg>
                    )}
                    {item.label}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    className="font-body text-2xl text-white transition-colors hover:text-[#FF9416] flex items-center gap-3"
                  >
                    <svg className="w-4 h-4 text-[#FF9416]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="square" strokeLinejoin="miter" />
                    </svg>
                    {item.label}
                  </Link>
                )}
                {/* Render sublinks if they exist */}
                {item.sublinks && (
                  <div className="flex flex-col items-start pl-2 ml-7 mt-3 gap-2 border-l border-[#FF9416]">
                    {item.sublinks.map((sublink) => (
                      <Link
                        key={sublink.href}
                        href={sublink.href}
                        onClick={closeMenu}
                        className="font-body text-lg text-white/70 transition-colors hover:text-[#FF9416] pl-3"
                      >
                        {sublink.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </>
  );
}
