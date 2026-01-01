"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import type { CartItem } from "@/store/cart";

interface OrderSummaryProps {
  items: CartItem[];
  total: number;
}

export function OrderSummary({ items, total }: OrderSummaryProps) {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">订单摘要</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Items */}
        <div className="space-y-3 max-h-[300px] overflow-y-auto">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="relative w-14 h-14 rounded-md overflow-hidden bg-muted flex-shrink-0">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground text-xs">
                    暂无
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm line-clamp-1">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatPrice(item.price)} x {item.quantity}
                </p>
              </div>
              <div className="text-sm font-medium">
                {formatPrice(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Totals */}
        <div className="space-y-2">
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
        </div>

        <Separator />

        <div className="flex justify-between font-semibold">
          <span>应付金额</span>
          <span className="text-xl text-primary">{formatPrice(total)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
