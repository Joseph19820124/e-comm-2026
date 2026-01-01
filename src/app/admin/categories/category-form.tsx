"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createCategory, updateCategory } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  description: string | null;
  parentId: string | null;
  sortOrder: number;
  isActive: boolean;
}

interface CategoryFormProps {
  category?: Category;
  categories: { id: string; name: string }[];
}

export function CategoryForm({ category, categories }: CategoryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(category?.isActive ?? true);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set("isActive", isActive.toString());

    const result = category
      ? await updateCategory(category.id, formData)
      : await createCategory(formData);

    setLoading(false);

    if (result.success) {
      toast.success(category ? "更新成功" : "创建成功");
      router.push("/admin/categories");
    } else {
      toast.error("操作失败");
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
          <div className="space-y-2">
            <Label htmlFor="name">分类名称 *</Label>
            <Input
              id="name"
              name="name"
              required
              defaultValue={category?.name}
              placeholder="请输入分类名称"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">描述</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={category?.description || ""}
              placeholder="请输入分类描述"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="parentId">父分类</Label>
            <Select name="parentId" defaultValue={category?.parentId || ""}>
              <SelectTrigger>
                <SelectValue placeholder="选择父分类（可选）" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">无</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sortOrder">排序</Label>
            <Input
              id="sortOrder"
              name="sortOrder"
              type="number"
              defaultValue={category?.sortOrder || 0}
              placeholder="数字越小越靠前"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={isActive}
              onCheckedChange={(checked) => setIsActive(checked as boolean)}
            />
            <Label htmlFor="isActive">启用</Label>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? "保存中..." : "保存"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/categories")}
            >
              取消
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
