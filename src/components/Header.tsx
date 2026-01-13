"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { usePathname, useRouter } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const scrollToSection = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // If we're already on the homepage, just scroll
    if (pathname === "/") {
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
      return;
    }

    // Otherwise navigate to the homepage with the hash, then attempt to scroll.
    // router.push returns when navigation completes; add a small delay to allow layout.
    await router.push('/#was-du-tun-kannst');
    setTimeout(() => {
      const target = document.getElementById('was-du-tun-kannst');
      if (target) {
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FF9416]">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center gap-3">
          <Image
            src="/Logo Outlined.png"
            alt="PauseAI Logo"
            width={140}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </a>
        <nav className="flex items-center gap-4">
          <a
            href="/#was-du-tun-kannst"
            onClick={scrollToSection}
            className="font-section text-sm tracking-wider text-black transition-colors hover:text-white md:text-base"
          >
            Mach mit
          </a>
          <Link
            href="/contactlawmakers"
            className="font-section text-sm tracking-wider text-black/90 hover:text-white md:text-base"
          >
            Helfen
          </Link>
        </nav>
      </div>
    </header>
  );
}
