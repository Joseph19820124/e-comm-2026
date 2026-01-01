"use server";

import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function registerUser(formData: FormData): Promise<{
  success: boolean;
  error?: string;
}> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, error: "请填写邮箱和密码" };
  }

  if (password.length < 6) {
    return { success: false, error: "密码至少需要6个字符" };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, error: "该邮箱已被注册" };
    }

    const hashedPassword = await hash(password, 12);

    await prisma.user.create({
      data: {
        name: name || null,
        email,
        password: hashedPassword,
        role: "USER",
      },
    });

    return { success: true };
  } catch {
    return { success: false, error: "注册失败，请稍后重试" };
  }
}
