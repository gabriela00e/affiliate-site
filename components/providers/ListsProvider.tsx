"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { WISHLIST_STORAGE_KEY, COMPARE_STORAGE_KEY, COMPARE_MAX_ITEMS } from "@/lib/constants";

type ListsContextType = {
  wishlist: string[];
  compare: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  toggleCompare: (productId: string) => void;
  isComparing: (productId: string) => boolean;
  clearCompare: () => void;
};

const ListsContext = createContext<ListsContextType | null>(null);

function readStorage(key: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function ListsProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compare, setCompare] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setWishlist(readStorage(WISHLIST_STORAGE_KEY));
    setCompare(readStorage(COMPARE_STORAGE_KEY));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
  }, [wishlist, hydrated]);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(COMPARE_STORAGE_KEY, JSON.stringify(compare));
  }, [compare, hydrated]);

  const toggleWishlist = (productId: string) =>
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );

  const toggleCompare = (productId: string) =>
    setCompare((prev) => {
      if (prev.includes(productId)) return prev.filter((id) => id !== productId);
      if (prev.length >= COMPARE_MAX_ITEMS) return prev;
      return [...prev, productId];
    });

  return (
    <ListsContext.Provider
      value={{
        wishlist,
        compare,
        toggleWishlist,
        isWishlisted: (id) => wishlist.includes(id),
        toggleCompare,
        isComparing: (id) => compare.includes(id),
        clearCompare: () => setCompare([]),
      }}
    >
      {children}
    </ListsContext.Provider>
  );
}

export function useLists() {
  const ctx = useContext(ListsContext);
  if (!ctx) throw new Error("useLists must be used within ListsProvider");
  return ctx;
}
