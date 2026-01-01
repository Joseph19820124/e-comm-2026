import { notFound } from "next/navigation";
import Link from "next/link";
import { getOrderById } from "../actions";
import { ORDER_STATUS_MAP } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { OrderStatusUpdate } from "./order-status-update";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  const statusInfo = ORDER_STATUS_MAP[order.status];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/orders">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">订单详情</h1>
        <span
          className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${statusInfo.color}`}
        >
          {statusInfo.label}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>订单信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">订单号</p>
                  <p className="font-mono">{order.orderNumber}</p>
                </div>
                <div>
                  <p className="text-gray-500">下单时间</p>
                  <p>{new Date(order.createdAt).toLocaleString("zh-CN")}</p>
                </div>
                <div>
                  <p className="text-gray-500">客户</p>
                  <p>{order.user.name || order.user.email}</p>
                </div>
                <div>
                  <p className="text-gray-500">付款状态</p>
                  <p>{order.paymentStatus}</p>
                </div>
              </div>
              {order.note && (
                <div>
                  <p className="text-gray-500 text-sm">备注</p>
                  <p className="mt-1">{order.note}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>商品列表</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 pb-4 border-b last:border-0"
                  >
                    {item.productImage && (
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-gray-500">
                        {item.productSku || "-"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p>{formatPrice(item.price.toString())} x {item.quantity}</p>
                      <p className="font-medium">
                        {formatPrice(item.subtotal.toString())}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">小计</span>
                  <span>{formatPrice(order.subtotal.toString())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">运费</span>
                  <span>{formatPrice(order.shipping.toString())}</span>
                </div>
                {order.discount.toString() !== "0" && (
                  <div className="flex justify-between text-red-600">
                    <span>优惠</span>
                    <span>-{formatPrice(order.discount.toString())}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>总计</span>
                  <span>{formatPrice(order.total.toString())}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>收货信息</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p className="font-medium">{order.shippingName}</p>
              <p>{order.shippingPhone}</p>
              <p className="text-gray-600">{order.shippingAddress}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>更新状态</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderStatusUpdate
                orderId={order.id}
                currentStatus={order.status}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>时间线</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-3">
              <div>
                <p className="text-gray-500">创建时间</p>
                <p>{new Date(order.createdAt).toLocaleString("zh-CN")}</p>
              </div>
              {order.paidAt && (
                <div>
                  <p className="text-gray-500">付款时间</p>
                  <p>{new Date(order.paidAt).toLocaleString("zh-CN")}</p>
                </div>
              )}
              {order.shippedAt && (
                <div>
                  <p className="text-gray-500">发货时间</p>
                  <p>{new Date(order.shippedAt).toLocaleString("zh-CN")}</p>
                </div>
              )}
              {order.deliveredAt && (
                <div>
                  <p className="text-gray-500">送达时间</p>
                  <p>{new Date(order.deliveredAt).toLocaleString("zh-CN")}</p>
                </div>
              )}
              {order.cancelledAt && (
                <div>
                  <p className="text-gray-500">取消时间</p>
                  <p>{new Date(order.cancelledAt).toLocaleString("zh-CN")}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
