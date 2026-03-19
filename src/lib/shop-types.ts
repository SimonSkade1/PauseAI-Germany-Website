export interface ProductVariant {
  id: string;
  color: string;
  colorHex: string;
  size: string;
  inStock: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // cents EUR
  category: "clothing" | "accessories" | "stickers";
  images: string[];
  variants: ProductVariant[];
  featured: boolean;
  soldOut: boolean;
}

export interface CartItem {
  productId: string;
  variantId: string;
  quantity: number;
}
