"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cart";

export function useCart() {
  const [isHydrated, setIsHydrated] = useState(false);
  const store = useCartStore();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return {
    ...store,
    isHydrated,
    itemCount: isHydrated ? store.getItemCount() : 0,
    total: isHydrated ? store.getTotal() : 0,
  };
}
