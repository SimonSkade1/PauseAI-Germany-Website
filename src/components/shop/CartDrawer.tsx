"use client";

import Image from "next/image";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import { useCart, formatPrice } from "@/context/CartContext";
import products from "@/data/products.json";
import type { Product } from "@/lib/shop-types";

const typedProducts = products as Product[];

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const DONATION_PRESETS = [0, 200, 500, 1000]; // cents

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, donationAmount, removeItem, updateQuantity, setDonation, clearCart } = useCart();

  const getProduct = (productId: string) =>
    typedProducts.find((p) => p.id === productId);

  const getVariant = (product: Product, variantId: string) =>
    product.variants.find((v) => v.id === variantId);

  const itemsTotal = items.reduce((sum, item) => {
    const product = getProduct(item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const grandTotal = itemsTotal + donationAmount;

  const handleCheckout = () => {
    alert("Stripe-Integration kommt bald!");
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[70] bg-black/50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-[80] flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1a1a1a] px-6 py-4">
          <h2 className="font-section text-lg text-black">Warenkorb</h2>
          <button
            onClick={onClose}
            className="cursor-pointer p-1 transition-colors hover:text-[#FF9416]"
            aria-label="Warenkorb schließen"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="font-body text-pause-black/60">
                Dein Warenkorb ist leer.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const product = getProduct(item.productId);
                if (!product) return null;
                const variant = getVariant(product, item.variantId);

                return (
                  <div
                    key={item.variantId}
                    className="flex gap-4 border-b border-gray-200 pb-4"
                  >
                    {/* Image */}
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden bg-gray-100">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-section text-xs text-black">
                            {product.name}
                          </p>
                          {variant && variant.size !== "Einheitsgröße" && (
                            <p className="font-body text-xs text-pause-black/60 mt-0.5">
                              Größe: {variant.size}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.variantId)}
                          className="cursor-pointer p-1 text-pause-black/40 transition-colors hover:text-red-500"
                          aria-label="Artikel entfernen"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-auto flex items-center justify-between pt-2">
                        {/* Quantity controls */}
                        <div className="flex items-center border border-[#1a1a1a]">
                          <button
                            onClick={() =>
                              updateQuantity(item.variantId, item.quantity - 1)
                            }
                            className="cursor-pointer px-2 py-1 transition-colors hover:bg-gray-100"
                            aria-label="Menge verringern"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="font-body px-3 py-1 text-sm">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.variantId, item.quantity + 1)
                            }
                            className="cursor-pointer px-2 py-1 transition-colors hover:bg-gray-100"
                            aria-label="Menge erhöhen"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <p className="font-body text-sm font-bold">
                          {formatPrice(product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Clear cart */}
              <button
                onClick={clearCart}
                className="font-body text-xs text-pause-black/50 underline transition-colors hover:text-pause-black cursor-pointer"
              >
                Warenkorb leeren
              </button>
            </div>
          )}
        </div>

        {/* Donation + Total */}
        <div className="border-t border-[#1a1a1a] px-6 py-4">
          {/* Donation */}
          <div className="mb-4">
            <p className="font-section text-xs text-black mb-2">
              PauseAI unterstützen
            </p>
            <div className="flex gap-2">
              {DONATION_PRESETS.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setDonation(amount)}
                  className={`flex-1 cursor-pointer border py-1.5 font-body text-xs transition-colors ${
                    donationAmount === amount
                      ? "border-[#FF9416] bg-[#FF9416] text-black"
                      : "border-[#1a1a1a] bg-white text-black hover:bg-gray-100"
                  }`}
                >
                  {amount === 0 ? "0 \u20AC" : formatPrice(amount)}
                </button>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between mb-4">
            <span className="font-section text-sm text-black">Gesamt</span>
            <span className="font-section text-lg text-black">
              {formatPrice(grandTotal)}
            </span>
          </div>

          {/* Checkout */}
          <button
            onClick={handleCheckout}
            disabled={items.length === 0}
            className={`w-full py-3 font-section text-xs tracking-wider transition-colors ${
              items.length === 0
                ? "border border-[#1a1a1a] bg-gray-200 text-gray-500 cursor-not-allowed"
                : "border border-[#1a1a1a] bg-[#FF9416] text-black hover:bg-[#e88510] cursor-pointer"
            }`}
          >
            Zur Kasse
          </button>
        </div>
      </div>
    </>
  );
}
