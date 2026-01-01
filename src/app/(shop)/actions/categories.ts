"use server";

import { prisma } from "@/lib/prisma";

export async function getActiveCategories() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      image: true,
      parentId: true,
      _count: {
        select: { products: true },
      },
    },
  });

  return categories;
}

export async function getTopCategoriesWithProducts(limit = 4) {
  const categories = await prisma.category.findMany({
    where: {
      isActive: true,
      parentId: null,
      products: {
        some: { isActive: true },
      },
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    take: limit,
    select: {
      id: true,
      name: true,
      slug: true,
      image: true,
    },
  });

  return categories;
}
