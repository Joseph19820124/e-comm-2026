"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { OrderStatus, PaymentStatus } from "@prisma/client";

export async function getOrders(status?: string) {
  const where = status && status !== "all" ? { status: status as OrderStatus } : {};

  return prisma.order.findMany({
    where,
    include: {
      user: { select: { name: true, email: true } },
      _count: { select: { items: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true } },
      address: true,
      items: {
        include: {
          product: { select: { id: true, name: true, thumbnail: true } },
        },
      },
    },
  });
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const updateData: {
    status: OrderStatus;
    paymentStatus?: PaymentStatus;
    paidAt?: Date;
    shippedAt?: Date;
    deliveredAt?: Date;
    cancelledAt?: Date;
  } = { status };

  // Update related fields based on status
  switch (status) {
    case "PAID":
      updateData.paymentStatus = "PAID";
      updateData.paidAt = new Date();
      break;
    case "SHIPPED":
      updateData.shippedAt = new Date();
      break;
    case "DELIVERED":
      updateData.deliveredAt = new Date();
      break;
    case "CANCELLED":
      updateData.cancelledAt = new Date();
      break;
    case "REFUNDED":
      updateData.paymentStatus = "REFUNDED";
      break;
  }

  await prisma.order.update({
    where: { id },
    data: updateData,
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  return { success: true };
}
