"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

interface CartIconProps {
  onClick: () => void;
}

export default function CartIcon({ onClick }: CartIconProps) {
  const { totalItems } = useCart();

  return (
    <button
      onClick={onClick}
      className="relative cursor-pointer p-1 transition-colors hover:text-white"
      aria-label={`Warenkorb (${totalItems} Artikel)`}
    >
      <ShoppingBag className="h-6 w-6" strokeWidth={2} />
      {totalItems > 0 && (
        <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center bg-[#1a1a1a] text-[10px] font-bold text-white">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </button>
  );
}
