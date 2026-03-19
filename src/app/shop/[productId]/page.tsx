"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartIcon from "@/components/shop/CartIcon";
import CartDrawer from "@/components/shop/CartDrawer";
import { useCart, formatPrice } from "@/context/CartContext";
import products from "@/data/products.json";
import type { Product } from "@/lib/shop-types";

const typedProducts = products as Product[];

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.productId as string;
  const product = typedProducts.find((p) => p.id === productId);

  const { addItem } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [cartOpen, setCartOpen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  if (!product) {
    return (
      <>
        <Header />
        <main className="bg-white pt-24">
          <section className="mx-auto max-w-5xl px-6 py-16 md:px-10">
            <p className="font-body text-pause-black/60">
              Produkt nicht gefunden.
            </p>
            <Link
              href="/shop"
              className="mt-4 inline-flex items-center gap-2 font-section text-xs tracking-wider text-[#FF9416] transition-colors hover:text-[#e88510]"
            >
              <ArrowLeft className="h-4 w-4" />
              Zurück zum Shop
            </Link>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  const hasSizes = product.variants.some((v) => v.size !== "Einheitsgröße");
  const availableVariants = product.variants.filter((v) => v.inStock);

  // Default to first variant if only one size or single variant
  const effectiveVariantId =
    selectedVariantId ||
    (!hasSizes && availableVariants.length > 0
      ? availableVariants[0].id
      : "");

  const selectedVariant = product.variants.find(
    (v) => v.id === effectiveVariantId
  );

  const canAdd =
    !product.soldOut && selectedVariant && selectedVariant.inStock;

  const handleAddToCart = () => {
    if (!canAdd || !effectiveVariantId) return;
    addItem(product.id, effectiveVariantId, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <>
      <Header />
      <main className="bg-white pt-24">
        <section className="mx-auto max-w-5xl px-6 pb-16 pt-10 md:px-10 md:pt-14">
          {/* Back link + Cart */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 font-section text-xs tracking-wider text-black transition-colors hover:text-[#FF9416]"
            >
              <ArrowLeft className="h-4 w-4" />
              Zurück zum Shop
            </Link>
            <CartIcon onClick={() => setCartOpen(true)} />
          </div>

          {/* Two columns */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
            {/* Image */}
            <div className="relative aspect-square overflow-hidden rounded-sm border-2 border-[#1a1a1a] bg-gray-100">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
              {product.soldOut && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <span className="font-section text-lg tracking-wider text-white">
                    Ausverkauft
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col">
              <h1 className="font-headline text-2xl text-pause-black md:text-4xl">
                {product.name}
              </h1>

              <p className="mt-2 font-body text-2xl font-bold text-pause-black">
                {formatPrice(product.price)}
              </p>

              <p className="mt-4 font-body text-pause-black/85 leading-relaxed">
                {product.description}
              </p>

              {/* Size selector */}
              {hasSizes && (
                <div className="mt-6">
                  <p className="font-section text-xs text-black mb-2">
                    Größe wählen
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariantId(variant.id)}
                        disabled={!variant.inStock}
                        className={`cursor-pointer border px-4 py-2 font-section text-xs tracking-wider transition-colors ${
                          effectiveVariantId === variant.id
                            ? "border-[#FF9416] bg-[#FF9416] text-black"
                            : variant.inStock
                            ? "border-[#1a1a1a] bg-white text-black hover:bg-gray-100"
                            : "border-[#1a1a1a] bg-gray-200 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        {variant.size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Add to cart */}
              <div className="mt-8">
                <button
                  onClick={handleAddToCart}
                  disabled={!canAdd || (hasSizes && !selectedVariantId)}
                  className={`w-full py-3 font-section text-xs tracking-wider transition-colors ${
                    !canAdd || (hasSizes && !selectedVariantId)
                      ? "border border-[#1a1a1a] bg-gray-200 text-gray-500 cursor-not-allowed"
                      : "border border-[#1a1a1a] bg-[#FF9416] text-black hover:bg-[#e88510] cursor-pointer"
                  }`}
                >
                  {product.soldOut
                    ? "Ausverkauft"
                    : justAdded
                    ? "Hinzugefügt!"
                    : hasSizes && !selectedVariantId
                    ? "Bitte Größe wählen"
                    : "In den Warenkorb"}
                </button>
              </div>

              {/* Additional info */}
              <div className="mt-8 rounded-sm border border-[#1a1a1a] bg-[#FFFAF5] p-4">
                <p className="font-body text-sm text-pause-black/70">
                  Versand innerhalb Deutschlands: 3-5 Werktage.
                  Produktion über SPOD (Print-On-Demand).
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
