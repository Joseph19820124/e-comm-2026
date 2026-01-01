"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import type { CartItem } from "@/store/cart";

export async function getUserOrders() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        take: 3,
        select: {
          id: true,
          productName: true,
          productImage: true,
          quantity: true,
        },
      },
      _count: { select: { items: true } },
    },
  });

  return orders;
}

export async function getUserOrderById(id: string) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const order = await prisma.order.findFirst({
    where: { id, userId: session.user.id },
    include: {
      items: true,
      address: true,
    },
  });

  return order;
}

export async function createOrder(data: {
  addressId: string;
  items: CartItem[];
  note?: string;
}): Promise<{ success: boolean; orderId?: string; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "请先登录" };
  }

  if (data.items.length === 0) {
    return { success: false, error: "购物车为空" };
  }

  // Validate address
  const address = await prisma.address.findFirst({
    where: { id: data.addressId, userId: session.user.id },
  });

  if (!address) {
    return { success: false, error: "无效的收货地址" };
  }

  // Validate products and stock
  const productIds = data.items.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, isActive: true },
  });

  const productMap = new Map(products.map((p) => [p.id, p]));
  const errors: string[] = [];

  for (const item of data.items) {
    const product = productMap.get(item.productId);
    if (!product) {
      errors.push(`商品"${item.name}"已下架`);
    } else if (product.stock < item.quantity) {
      errors.push(`商品"${item.name}"库存不足（剩余${product.stock}件）`);
    }
  }

  if (errors.length > 0) {
    return { success: false, error: errors.join("；") };
  }

  // Calculate totals
  const subtotal = data.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  try {
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const order = await tx.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId: session.user.id,
          addressId: address.id,
          shippingName: address.name,
          shippingPhone: address.phone,
          shippingAddress: `${address.province}${address.city}${address.district}${address.street}`,
          subtotal: new Prisma.Decimal(subtotal),
          shipping: new Prisma.Decimal(0),
          tax: new Prisma.Decimal(0),
          discount: new Prisma.Decimal(0),
          total: new Prisma.Decimal(subtotal),
          status: "PENDING",
          paymentStatus: "UNPAID",
          items: {
            create: data.items.map((item) => {
              const product = productMap.get(item.productId)!;
              return {
                productId: item.productId,
                productName: item.name,
                productImage: item.image,
                productSku: product.sku,
                price: new Prisma.Decimal(item.price),
                quantity: item.quantity,
                subtotal: new Prisma.Decimal(item.price * item.quantity),
              };
            }),
          },
        },
      });

      // Decrement stock
      for (const item of data.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return order;
    });

    revalidatePath("/account/orders");
    revalidatePath("/admin/orders");
    return { success: true, orderId: order.id };
  } catch {
    return { success: false, error: "创建订单失败，请稍后重试" };
  }
}
