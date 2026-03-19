"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartIcon from "@/components/shop/CartIcon";
import CartDrawer from "@/components/shop/CartDrawer";
import { formatPrice } from "@/context/CartContext";
import products from "@/data/products.json";
import type { Product } from "@/lib/shop-types";

const typedProducts = products as Product[];

type Category = "all" | "clothing" | "accessories" | "stickers";

const CATEGORY_LABELS: Record<Category, string> = {
  all: "Alle",
  clothing: "Kleidung",
  accessories: "Accessoires",
  stickers: "Sticker",
};

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [cartOpen, setCartOpen] = useState(false);

  const filteredProducts =
    activeCategory === "all"
      ? typedProducts
      : typedProducts.filter((p) => p.category === activeCategory);

  return (
    <>
      <Header />
      <main className="bg-white pt-24">
        {/* Hero */}
        <section className="mx-auto max-w-5xl px-6 pb-8 pt-10 md:px-10 md:pt-14">
          <div className="flex items-start justify-between">
            <div className="mb-10">
              <p className="font-section text-sm text-[#FF9416]">Shop</p>
              <h1 className="font-headline mt-2 text-3xl text-pause-black md:text-5xl">
                PauseAI Merchandise
              </h1>
              <p className="mt-6 max-w-3xl font-body text-pause-black/85">
                Mit jedem Kauf unterstützt du unsere Arbeit für sichere
                KI-Entwicklung. Alle Einnahmen fließen direkt in unsere
                Aufklärungsarbeit und Kampagnen.
              </p>
            </div>
            <div className="mt-2">
              <CartIcon onClick={() => setCartOpen(true)} />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {(Object.keys(CATEGORY_LABELS) as Category[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`cursor-pointer border px-4 py-2 font-section text-xs tracking-wider transition-colors ${
                  activeCategory === cat
                    ? "border-[#1a1a1a] bg-[#FF9416] text-black"
                    : "border-[#1a1a1a] bg-white text-black hover:bg-gray-100"
                }`}
              >
                {CATEGORY_LABELS[cat]}
              </button>
            ))}
          </div>
        </section>

        {/* Product Grid */}
        <section className="mx-auto max-w-5xl px-6 pb-16 md:px-10">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                href={`/shop/${product.id}`}
                className="group rounded-sm border-2 border-[#1a1a1a] bg-white transition-shadow hover:shadow-lg"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {product.soldOut && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <span className="font-section text-sm tracking-wider text-white">
                        Ausverkauft
                      </span>
                    </div>
                  )}
                  {product.featured && !product.soldOut && (
                    <span className="absolute left-3 top-3 bg-[#FF9416] px-2 py-1 font-section text-[10px] tracking-wider text-black">
                      Beliebt
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-section text-sm text-black">
                    {product.name}
                  </h3>
                  <p className="mt-1 font-body text-sm text-pause-black/70">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="py-16 text-center">
              <p className="font-body text-pause-black/60">
                Keine Produkte in dieser Kategorie.
              </p>
            </div>
          )}
        </section>

        {/* Info box */}
        <section className="mx-auto max-w-5xl px-6 pb-16 md:px-10">
          <div className="rounded-sm border border-[#1a1a1a] bg-[#FFFAF5] p-6">
            <h2 className="font-section text-sm text-black mb-2">
              Versand & Produktion
            </h2>
            <p className="font-body text-sm text-pause-black/85">
              Unsere Produkte werden über SPOD (Spreadshirt Print-On-Demand)
              produziert und direkt zu dir nach Hause geliefert. Der Versand
              innerhalb Deutschlands dauert in der Regel 3-5 Werktage.
            </p>
          </div>
        </section>
      </main>
      <Footer />

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
