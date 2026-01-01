import { prisma } from "@/lib/prisma";
import { CategoryForm } from "../category-form";

export default async function NewCategoryPage() {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">新增分类</h1>
      <CategoryForm categories={categories} />
    </div>
  );
}
