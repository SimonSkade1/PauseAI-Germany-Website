"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Handle scroll behavior - hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 10) {
        // Always show at top of page
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down - hide navbar
        setIsVisible(false);
      } else {
        // Scrolling up - show navbar
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

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

  // Desktop navigation links (only 3 main links)
  const desktopNavLinks = [
    { href: "/ueber-uns", label: "Über uns", external: false },
    { href: "https://ki-risiken.de", label: "Mehr lernen", external: true },
    { href: "/#was-du-tun-kannst", label: "Hilf mit", external: false },
  ];

  // Mobile menu structure with sublinks
  const mobileMenuItems = [
    { href: "/", label: "Startseite", external: false },
    { 
      href: "/ueber-uns", 
      label: "Über uns", 
      external: false,
      sublinks: [
        { href: "/ueber-uns#unser-ziel", label: "Unser Ziel" },
        { href: "/ueber-uns#unser-ansatz", label: "Unser Ansatz" },
        { href: "/ueber-uns#was-wir-tun", label: "Was wir tun" },
      ]
    },
    { href: "https://ki-risiken.de", label: "Mehr lernen", external: true },
    { href: "/#was-du-tun-kannst", label: "Hilf mit", external: false },
    { href: "https://pauseai.info", label: "International", external: true },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-[#FF9416] transition-transform duration-300 ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        } ${isMenuOpen ? "translate-y-0" : ""}`}
      >
        <div className="flex items-center justify-between px-8 md:px-16 lg:px-24 py-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/Logo Outlined.png"
              alt="PauseAI Logo"
              width={140}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {desktopNavLinks.map((link) =>
              link.external ? (
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
              )
            )}
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
          {mobileMenuItems.map((item) => (
            <div key={item.href} className="flex flex-col items-start">
              {item.external ? (
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                  className="font-body text-2xl text-white transition-colors hover:text-[#FF9416] flex items-center gap-3"
                >
                  <svg className="w-4 h-4 text-[#FF9416]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="square" strokeLinejoin="miter" />
                  </svg>
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
          ))}
        </nav>
      </div>
    </>
  );
}
