"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { UserRole } from "@prisma/client";

export async function getUsers() {
  return prisma.user.findMany({
    include: {
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      addresses: true,
      orders: {
        take: 5,
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { orders: true } },
    },
  });
}

export async function updateUserRole(id: string, role: UserRole) {
  await prisma.user.update({
    where: { id },
    data: { role },
  });

  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${id}`);
  return { success: true };
}

export async function deleteUser(id: string) {
  // Check if user has orders
  const user = await prisma.user.findUnique({
    where: { id },
    include: { _count: { select: { orders: true } } },
  });

  if (user?._count.orders ?? 0 > 0) {
    return { success: false, error: "该用户有订单记录，无法删除" };
  }

  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/users");
  return { success: true };
}
