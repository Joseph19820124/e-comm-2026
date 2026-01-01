"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getUserAddresses() {
  const session = await auth();
  if (!session?.user?.id) return [];

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return addresses;
}

export async function getAddressById(id: string) {
  const session = await auth();
  if (!session?.user?.id) return null;

  const address = await prisma.address.findFirst({
    where: { id, userId: session.user.id },
  });

  return address;
}

export async function createAddress(formData: FormData): Promise<{
  success: boolean;
  error?: string;
}> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "请先登录" };
  }

  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const province = formData.get("province") as string;
  const city = formData.get("city") as string;
  const district = formData.get("district") as string;
  const street = formData.get("street") as string;
  const postalCode = formData.get("postalCode") as string;
  const isDefault = formData.get("isDefault") === "true";

  if (!name || !phone || !province || !city || !district || !street) {
    return { success: false, error: "请填写完整的地址信息" };
  }

  try {
    // If setting as default, clear other defaults
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false },
      });
    }

    await prisma.address.create({
      data: {
        userId: session.user.id,
        name,
        phone,
        province,
        city,
        district,
        street,
        postalCode: postalCode || null,
        isDefault,
      },
    });

    revalidatePath("/account/addresses");
    revalidatePath("/checkout");
    return { success: true };
  } catch {
    return { success: false, error: "创建地址失败" };
  }
}

export async function updateAddress(
  id: string,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "请先登录" };
  }

  const address = await prisma.address.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!address) {
    return { success: false, error: "地址不存在" };
  }

  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const province = formData.get("province") as string;
  const city = formData.get("city") as string;
  const district = formData.get("district") as string;
  const street = formData.get("street") as string;
  const postalCode = formData.get("postalCode") as string;
  const isDefault = formData.get("isDefault") === "true";

  try {
    if (isDefault && !address.isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false },
      });
    }

    await prisma.address.update({
      where: { id },
      data: {
        name,
        phone,
        province,
        city,
        district,
        street,
        postalCode: postalCode || null,
        isDefault,
      },
    });

    revalidatePath("/account/addresses");
    revalidatePath("/checkout");
    return { success: true };
  } catch {
    return { success: false, error: "更新地址失败" };
  }
}

export async function deleteAddress(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "请先登录" };
  }

  const address = await prisma.address.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!address) {
    return { success: false, error: "地址不存在" };
  }

  try {
    await prisma.address.delete({ where: { id } });
    revalidatePath("/account/addresses");
    revalidatePath("/checkout");
    return { success: true };
  } catch {
    return { success: false, error: "删除地址失败" };
  }
}

export async function setDefaultAddress(id: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "请先登录" };
  }

  try {
    await prisma.address.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    });

    await prisma.address.update({
      where: { id },
      data: { isDefault: true },
    });

    revalidatePath("/account/addresses");
    revalidatePath("/checkout");
    return { success: true };
  } catch {
    return { success: false, error: "设置默认地址失败" };
  }
}
