import { Package } from "lucide-react";
import { OrderCard } from "@/components/shop/account/order-card";
import { getUserOrders } from "../../actions/orders";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "我的订单 - 电商系统",
};

export default async function OrdersPage() {
  const orders = await getUserOrders();

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">还没有订单</h2>
        <p className="text-muted-foreground mb-6">快去挑选心仪的商品吧</p>
        <Link href="/products">
          <Button>去购物</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">我的订单</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
