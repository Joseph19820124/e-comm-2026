"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddressSelector } from "@/components/shop/checkout/address-selector";
import { OrderSummary } from "@/components/shop/checkout/order-summary";
import { useCart } from "@/hooks/use-cart";
import { getUserAddresses } from "../actions/addresses";
import { createOrder } from "../actions/orders";
import { toast } from "sonner";
import type { Address } from "@prisma/client";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart, isHydrated } = useCart();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadAddresses = async () => {
    const data = await getUserAddresses();
    setAddresses(data);
    // Auto-select default address
    const defaultAddress = data.find((a) => a.isDefault);
    if (defaultAddress) {
      setSelectedAddressId(defaultAddress.id);
    } else if (data.length > 0) {
      setSelectedAddressId(data[0].id);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleSubmit = async () => {
    if (!selectedAddressId) {
      toast.error("请选择收货地址");
      return;
    }

    if (items.length === 0) {
      toast.error("购物车为空");
      return;
    }

    setSubmitting(true);

    const result = await createOrder({
      addressId: selectedAddressId,
      items,
    });

    if (result.success) {
      clearCart();
      toast.success("订单创建成功！");
      router.push(`/account/orders/${result.orderId}`);
    } else {
      toast.error(result.error || "创建订单失败");
    }

    setSubmitting(false);
  };

  if (!isHydrated || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">结算</h1>
        <div className="animate-pulse space-y-4">
          <div className="h-48 bg-muted rounded" />
          <div className="h-48 bg-muted rounded" />
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
            请先添加商品到购物车
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
      <h1 className="text-3xl font-bold mb-8">结算</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Address Selection */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>收货地址</CardTitle>
            </CardHeader>
            <CardContent>
              <AddressSelector
                addresses={addresses}
                selectedId={selectedAddressId}
                onSelect={setSelectedAddressId}
                onAddressChange={loadAddresses}
              />
            </CardContent>
          </Card>

          {/* Submit Button - Mobile */}
          <div className="lg:hidden">
            <Button
              size="lg"
              className="w-full"
              onClick={handleSubmit}
              disabled={!selectedAddressId || submitting}
            >
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              提交订单
            </Button>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="space-y-4">
          <OrderSummary items={items} total={total} />

          {/* Submit Button - Desktop */}
          <Button
            size="lg"
            className="w-full hidden lg:flex"
            onClick={handleSubmit}
            disabled={!selectedAddressId || submitting}
          >
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            提交订单
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            点击提交订单即表示您同意我们的服务条款
          </p>
        </div>
      </div>
    </div>
  );
}
