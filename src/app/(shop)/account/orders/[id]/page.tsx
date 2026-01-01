import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getUserOrderById } from "../../../actions/orders";
import { formatPrice } from "@/lib/utils";
import { ORDER_STATUS_MAP } from "@/lib/constants";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const order = await getUserOrderById(id);

  if (!order) {
    return { title: "订单未找到" };
  }

  return {
    title: `订单 ${order.orderNumber} - 电商系统`,
  };
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const order = await getUserOrderById(id);

  if (!order) {
    notFound();
  }

  const statusInfo = ORDER_STATUS_MAP[order.status];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/account/orders">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{order.orderNumber}</h1>
          <p className="text-sm text-muted-foreground">
            下单时间：{new Date(order.createdAt).toLocaleString("zh-CN")}
          </p>
        </div>
        <Badge className={`ml-auto ${statusInfo.color}`}>
          {statusInfo.label}
        </Badge>
      </div>

      {/* Shipping Address */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">收货信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium">{order.shippingName}</span>
            <span className="text-muted-foreground">{order.shippingPhone}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {order.shippingAddress}
          </p>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">商品清单</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="relative w-20 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                  {item.productImage ? (
                    <Image
                      src={item.productImage}
                      alt={item.productName}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground text-xs">
                      暂无
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium line-clamp-2">{item.productName}</p>
                  {item.productSku && (
                    <p className="text-sm text-muted-foreground">
                      SKU: {item.productSku}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-muted-foreground">
                      x{item.quantity}
                    </span>
                    <span className="font-medium">
                      {formatPrice(Number(item.subtotal))}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">订单金额</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">商品小计</span>
            <span>{formatPrice(Number(order.subtotal))}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">运费</span>
            <span>{Number(order.shipping) > 0 ? formatPrice(Number(order.shipping)) : "免运费"}</span>
          </div>
          {Number(order.discount) > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">优惠</span>
              <span className="text-green-600">-{formatPrice(Number(order.discount))}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>实付金额</span>
            <span className="text-xl text-primary">{formatPrice(Number(order.total))}</span>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      {(order.paidAt || order.shippedAt || order.deliveredAt) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">订单状态</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.deliveredAt && (
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                  <div>
                    <p className="font-medium">已送达</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.deliveredAt).toLocaleString("zh-CN")}
                    </p>
                  </div>
                </div>
              )}
              {order.shippedAt && (
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                  <div>
                    <p className="font-medium">已发货</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.shippedAt).toLocaleString("zh-CN")}
                    </p>
                  </div>
                </div>
              )}
              {order.paidAt && (
                <div className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div>
                    <p className="font-medium">已付款</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.paidAt).toLocaleString("zh-CN")}
                    </p>
                  </div>
                </div>
              )}
              <div className="flex gap-3">
                <div className="w-2 h-2 rounded-full bg-muted-foreground mt-2" />
                <div>
                  <p className="font-medium">订单创建</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(order.createdAt).toLocaleString("zh-CN")}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
