"use server";

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function getFeaturedProducts(limit = 8) {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      isFeatured: true,
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      comparePrice: true,
      thumbnail: true,
      stock: true,
      category: {
        select: { name: true, slug: true },
      },
    },
  });

  return products;
}

export async function getProducts(params: {
  search?: string;
  categorySlug?: string;
  page?: number;
  limit?: number;
  sort?: "newest" | "price-asc" | "price-desc";
}) {
  const { search, categorySlug, page = 1, limit = 12, sort = "newest" } = params;

  const where: Prisma.ProductWhereInput = {
    isActive: true,
  };

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (categorySlug) {
    where.category = { slug: categorySlug };
  }

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "price-asc" ? { price: "asc" } :
    sort === "price-desc" ? { price: "desc" } :
    { createdAt: "desc" };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        comparePrice: true,
        thumbnail: true,
        stock: true,
        category: {
          select: { name: true, slug: true },
        },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      price: true,
      comparePrice: true,
      images: true,
      thumbnail: true,
      stock: true,
      sku: true,
      category: {
        select: { id: true, name: true, slug: true },
      },
    },
  });

  return product;
}

export async function getProductsByCategory(categorySlug: string, limit = 4) {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      category: { slug: categorySlug },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      comparePrice: true,
      thumbnail: true,
      stock: true,
    },
  });

  return products;
}

export async function getRelatedProducts(productId: string, categoryId: string | null, limit = 4) {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      id: { not: productId },
      ...(categoryId ? { categoryId } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      comparePrice: true,
      thumbnail: true,
      stock: true,
    },
  });

  return products;
}
