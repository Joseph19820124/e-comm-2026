"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "@/components/shop/cart/cart-item";
import { CartSummary } from "@/components/shop/cart/cart-summary";
import { useCart } from "@/hooks/use-cart";

export default function CartPage() {
  const { items, clearCart, isHydrated } = useCart();

  if (!isHydrated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">购物车</h1>
        <div className="animate-pulse space-y-4">
          <div className="h-24 bg-muted rounded" />
          <div className="h-24 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">购物车是空的</h1>
          <p className="text-muted-foreground mb-8">
            快去挑选心仪的商品吧
          </p>
          <Link href="/products">
            <Button size="lg">去购物</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">购物车</h1>
        <Button variant="ghost" size="sm" onClick={clearCart}>
          清空购物车
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="divide-y">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between items-center">
            <Link href="/products">
              <Button variant="outline">继续购物</Button>
            </Link>
          </div>
        </div>

        {/* Summary */}
        <div>
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
