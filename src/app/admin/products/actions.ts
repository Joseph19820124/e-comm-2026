"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";
import { Prisma } from "@prisma/client";

export async function getProducts(search?: string) {
  const where: Prisma.ProductWhereInput = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { sku: { contains: search, mode: "insensitive" } },
        ],
      }
    : {};

  return prisma.product.findMany({
    where,
    include: {
      category: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });
}

export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = formData.get("price") as string;
  const comparePrice = formData.get("comparePrice") as string;
  const cost = formData.get("cost") as string;
  const sku = formData.get("sku") as string;
  const stock = formData.get("stock") as string;
  const lowStock = formData.get("lowStock") as string;
  const categoryId = formData.get("categoryId") as string;
  const isActive = formData.get("isActive") === "true";
  const isFeatured = formData.get("isFeatured") === "true";
  const thumbnail = formData.get("thumbnail") as string;

  await prisma.product.create({
    data: {
      name,
      slug: slugify(name),
      description: description || null,
      price: new Prisma.Decimal(price),
      comparePrice: comparePrice ? new Prisma.Decimal(comparePrice) : null,
      cost: cost ? new Prisma.Decimal(cost) : null,
      sku: sku || null,
      stock: parseInt(stock) || 0,
      lowStock: parseInt(lowStock) || 10,
      categoryId: categoryId || null,
      isActive,
      isFeatured,
      thumbnail: thumbnail || null,
      images: [],
    },
  });

  revalidatePath("/admin/products");
  return { success: true };
}

export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = formData.get("price") as string;
  const comparePrice = formData.get("comparePrice") as string;
  const cost = formData.get("cost") as string;
  const sku = formData.get("sku") as string;
  const stock = formData.get("stock") as string;
  const lowStock = formData.get("lowStock") as string;
  const categoryId = formData.get("categoryId") as string;
  const isActive = formData.get("isActive") === "true";
  const isFeatured = formData.get("isFeatured") === "true";
  const thumbnail = formData.get("thumbnail") as string;

  await prisma.product.update({
    where: { id },
    data: {
      name,
      slug: slugify(name),
      description: description || null,
      price: new Prisma.Decimal(price),
      comparePrice: comparePrice ? new Prisma.Decimal(comparePrice) : null,
      cost: cost ? new Prisma.Decimal(cost) : null,
      sku: sku || null,
      stock: parseInt(stock) || 0,
      lowStock: parseInt(lowStock) || 10,
      categoryId: categoryId || null,
      isActive,
      isFeatured,
      thumbnail: thumbnail || null,
    },
  });

  revalidatePath("/admin/products");
  return { success: true };
}

export async function deleteProduct(id: string) {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { _count: { select: { orderItems: true } } },
  });

  if (product?._count.orderItems ?? 0 > 0) {
    return { success: false, error: "该商品已有订单，无法删除" };
  }

  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  return { success: true };
}
