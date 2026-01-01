import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { ORDER_STATUS_MAP } from "@/lib/constants";
import type { OrderStatus } from "@prisma/client";

interface OrderCardProps {
  order: {
    id: string;
    orderNumber: string;
    status: OrderStatus;
    total: { toString(): string } | number | string;
    createdAt: Date;
    items: {
      id: string;
      productName: string;
      productImage: string | null;
      quantity: number;
    }[];
    _count: { items: number };
  };
}

export function OrderCard({ order }: OrderCardProps) {
  const statusInfo = ORDER_STATUS_MAP[order.status];

  return (
    <div className="border rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {order.orderNumber}
          </span>
          <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
        </div>
        <span className="text-sm text-muted-foreground">
          {new Date(order.createdAt).toLocaleDateString("zh-CN")}
        </span>
      </div>

      {/* Items Preview */}
      <div className="flex gap-3 mb-4">
        {order.items.map((item) => (
          <div
            key={item.id}
            className="relative w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0"
          >
            {item.productImage ? (
              <Image
                src={item.productImage}
                alt={item.productName}
                fill
                className="object-cover"
                sizes="64px"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground text-xs">
                暂无
              </div>
            )}
            {item.quantity > 1 && (
              <span className="absolute bottom-0 right-0 bg-black/70 text-white text-xs px-1">
                x{item.quantity}
              </span>
            )}
          </div>
        ))}
        {order._count.items > 3 && (
          <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center text-sm text-muted-foreground">
            +{order._count.items - 3}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm text-muted-foreground">
            共 {order._count.items} 件商品
          </span>
          <span className="mx-2 text-muted-foreground">·</span>
          <span className="font-semibold">
            合计 {formatPrice(Number(order.total))}
          </span>
        </div>
        <Link href={`/account/orders/${order.id}`}>
          <Button variant="outline" size="sm">
            查看详情
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
