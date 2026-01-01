"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";

export function CartSummary() {
  const { data: session } = useSession();
  const { total, itemCount, isHydrated } = useCart();

  if (!isHydrated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>订单摘要</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-muted rounded w-full" />
            <div className="h-4 bg-muted rounded w-3/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>订单摘要</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">商品数量</span>
          <span>{itemCount} 件</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">商品小计</span>
          <span>{formatPrice(total)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">运费</span>
          <span className="text-green-600">免运费</span>
        </div>
        <Separator />
        <div className="flex justify-between font-semibold">
          <span>合计</span>
          <span className="text-xl text-primary">{formatPrice(total)}</span>
        </div>
      </CardContent>
      <CardFooter>
        {session?.user ? (
          <Link href="/checkout" className="w-full">
            <Button className="w-full" size="lg" disabled={itemCount === 0}>
              去结算
            </Button>
          </Link>
        ) : (
          <Link href="/login?callbackUrl=/checkout" className="w-full">
            <Button className="w-full" size="lg" disabled={itemCount === 0}>
              登录后结算
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}
