"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Header() {
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById("was-du-tun-kannst");
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FF9416]">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
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
        <nav className="flex items-center gap-6">
          {/*<Link
            href="/ueber-uns"
            className="font-section text-sm tracking-wider text-black transition-colors hover:text-white md:text-base"
          >
            Über Uns
          </Link> Work in progress*/}
          <a
            href="/#was-du-tun-kannst"

            onClick={scrollToSection}
            className="font-section text-sm tracking-wider text-black transition-colors hover:text-white md:text-base"
          >
            Hilf mit
          </a>
        </nav>
      </div>
    </header>
  );
}
