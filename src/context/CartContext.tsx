"use client";

import React, { createContext, useContext, useReducer, useEffect, useCallback } from "react";
import type { CartItem } from "@/lib/shop-types";

interface CartState {
  items: CartItem[];
  donationAmount: number; // cents
}

type CartAction =
  | { type: "ADD_ITEM"; payload: { productId: string; variantId: string; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: { variantId: string } }
  | { type: "UPDATE_QUANTITY"; payload: { variantId: string; quantity: number } }
  | { type: "SET_DONATION"; payload: { amount: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartState };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(
        (item) => item.variantId === action.payload.variantId
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.variantId === action.payload.variantId
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(
          (item) => item.variantId !== action.payload.variantId
        ),
      };
    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (item) => item.variantId !== action.payload.variantId
          ),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.variantId === action.payload.variantId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    }
    case "SET_DONATION":
      return { ...state, donationAmount: action.payload.amount };
    case "CLEAR_CART":
      return { items: [], donationAmount: 0 };
    case "LOAD_CART":
      return action.payload;
    default:
      return state;
  }
}

const initialState: CartState = {
  items: [],
  donationAmount: 0,
};

interface CartContextValue {
  items: CartItem[];
  donationAmount: number;
  addItem: (productId: string, variantId: string, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  setDonation: (amount: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("pauseai-cart");
      if (saved) {
        const parsed = JSON.parse(saved) as CartState;
        dispatch({ type: "LOAD_CART", payload: parsed });
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem("pauseai-cart", JSON.stringify(state));
    } catch {
      // Ignore storage errors
    }
  }, [state]);

  const addItem = useCallback(
    (productId: string, variantId: string, quantity = 1) => {
      dispatch({ type: "ADD_ITEM", payload: { productId, variantId, quantity } });
    },
    []
  );

  const removeItem = useCallback((variantId: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { variantId } });
  }, []);

  const updateQuantity = useCallback((variantId: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { variantId, quantity } });
  }, []);

  const setDonation = useCallback((amount: number) => {
    dispatch({ type: "SET_DONATION", payload: { amount } });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = state.donationAmount; // Product totals are computed where needed with product data

  const value: CartContextValue = {
    items: state.items,
    donationAmount: state.donationAmount,
    addItem,
    removeItem,
    updateQuantity,
    setDonation,
    clearCart,
    totalItems,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export function formatPrice(cents: number): string {
  return (cents / 100).toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + " \u20AC";
}
