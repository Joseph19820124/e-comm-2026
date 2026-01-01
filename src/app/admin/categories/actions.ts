"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/utils";

export async function getCategories() {
  return prisma.category.findMany({
    include: {
      parent: { select: { id: true, name: true } },
      _count: { select: { products: true, children: true } },
    },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
}

export async function getCategoryById(id: string) {
  return prisma.category.findUnique({
    where: { id },
    include: { parent: true },
  });
}

export async function createCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const parentId = formData.get("parentId") as string;
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
  const isActive = formData.get("isActive") === "true";

  await prisma.category.create({
    data: {
      name,
      slug: slugify(name),
      description: description || null,
      parentId: parentId || null,
      sortOrder,
      isActive,
    },
  });

  revalidatePath("/admin/categories");
  return { success: true };
}

export async function updateCategory(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const parentId = formData.get("parentId") as string;
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
  const isActive = formData.get("isActive") === "true";

  await prisma.category.update({
    where: { id },
    data: {
      name,
      slug: slugify(name),
      description: description || null,
      parentId: parentId || null,
      sortOrder,
      isActive,
    },
  });

  revalidatePath("/admin/categories");
  return { success: true };
}

export async function deleteCategory(id: string) {
  // Check if category has products or children
  const category = await prisma.category.findUnique({
    where: { id },
    include: {
      _count: { select: { products: true, children: true } },
    },
  });

  if (category?._count.products ?? 0 > 0) {
    return { success: false, error: "该分类下有商品，无法删除" };
  }

  if (category?._count.children ?? 0 > 0) {
    return { success: false, error: "该分类下有子分类，无法删除" };
  }

  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
  return { success: true };
}
