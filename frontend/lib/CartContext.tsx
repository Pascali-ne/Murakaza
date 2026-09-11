"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { CatalogItem } from "./api";

export interface CartItemEntry {
  item: CatalogItem;
  quantity: number;
}

export type CartItem = CartItemEntry;

export interface CartContextValue {
  // Array of items
  cart: CartItemEntry[];
  items: CartItemEntry[];

  // Cart open/close drawer state
  isCartOpen: boolean;
  isOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Checkout modal state
  isCheckoutOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;

  // Actions
  addToCart: (item: CatalogItem, quantity?: number) => void;
  addItem: (item: CatalogItem, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;

  // Totals
  totalItems: number;
  itemCount: number;
  totalPriceRwf: number;
  totalRwf: number;
}

const defaultCartValue: CartContextValue = {
  cart: [],
  items: [],
  isCartOpen: false,
  isOpen: false,
  setIsCartOpen: () => {},
  openCart: () => {},
  closeCart: () => {},
  toggleCart: () => {},
  isCheckoutOpen: false,
  openCheckout: () => {},
  closeCheckout: () => {},
  addToCart: () => {},
  addItem: () => {},
  removeFromCart: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
  totalItems: 0,
  itemCount: 0,
  totalPriceRwf: 0,
  totalRwf: 0,
};

const CartContext = createContext<CartContextValue>(defaultCartValue);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItemEntry[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = typeof window !== "undefined" ? localStorage.getItem("murakaza_cart") : null;
      if (stored) {
        setCart(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && typeof window !== "undefined") {
      try {
        localStorage.setItem("murakaza_cart", JSON.stringify(cart));
      } catch {
        // ignore
      }
    }
  }, [cart, mounted]);

  const addToCart = (item: CatalogItem, quantity: number = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((entry) => entry.item.id === item.id);
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      }
      return [...prev, { item, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((entry) => entry.item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((entry) =>
        entry.item.id === itemId ? { ...entry, quantity } : entry
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const openCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };
  const closeCheckout = () => setIsCheckoutOpen(false);

  const totalItems = cart.reduce((acc, entry) => acc + entry.quantity, 0);
  const totalPriceRwf = cart.reduce((acc, entry) => acc + entry.item.priceRwf * entry.quantity, 0);

  const value: CartContextValue = {
    cart,
    items: cart,
    isCartOpen,
    isOpen: isCartOpen,
    setIsCartOpen,
    openCart,
    closeCart,
    toggleCart,
    isCheckoutOpen,
    openCheckout,
    closeCheckout,
    addToCart,
    addItem: addToCart,
    removeFromCart,
    removeItem: removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    itemCount: totalItems,
    totalPriceRwf,
    totalRwf: totalPriceRwf,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  return context || defaultCartValue;
}
