"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createProduct, updateProduct } from "./actions";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import type { Prisma } from "@prisma/client";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: Prisma.Decimal;
  comparePrice: Prisma.Decimal | null;
  cost: Prisma.Decimal | null;
  sku: string | null;
  stock: number;
  lowStock: number;
  categoryId: string | null;
  isActive: boolean;
  isFeatured: boolean;
  thumbnail: string | null;
}

interface ProductFormProps {
  product?: Product;
  categories: { id: string; name: string }[];
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(product?.isActive ?? true);
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured ?? false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set("isActive", isActive.toString());
    formData.set("isFeatured", isFeatured.toString());

    const result = product
      ? await updateProduct(product.id, formData)
      : await createProduct(formData);

    setLoading(false);

    if (result.success) {
      toast.success(product ? "更新成功" : "创建成功");
      router.push("/admin/products");
    } else {
      toast.error("操作失败");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">商品名称 *</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  defaultValue={product?.name}
                  placeholder="请输入商品名称"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">商品描述</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={4}
                  defaultValue={product?.description || ""}
                  placeholder="请输入商品描述"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="thumbnail">缩略图 URL</Label>
                <Input
                  id="thumbnail"
                  name="thumbnail"
                  defaultValue={product?.thumbnail || ""}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>价格与库存</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">售价 *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    required
                    defaultValue={product?.price.toString()}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comparePrice">原价</Label>
                  <Input
                    id="comparePrice"
                    name="comparePrice"
                    type="number"
                    step="0.01"
                    defaultValue={product?.comparePrice?.toString() || ""}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">成本价</Label>
                  <Input
                    id="cost"
                    name="cost"
                    type="number"
                    step="0.01"
                    defaultValue={product?.cost?.toString() || ""}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    name="sku"
                    defaultValue={product?.sku || ""}
                    placeholder="SKU-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">库存 *</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    required
                    defaultValue={product?.stock || 0}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lowStock">低库存预警</Label>
                  <Input
                    id="lowStock"
                    name="lowStock"
                    type="number"
                    defaultValue={product?.lowStock || 10}
                    placeholder="10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>分类</CardTitle>
            </CardHeader>
            <CardContent>
              <Select name="categoryId" defaultValue={product?.categoryId || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="选择分类" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">无分类</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>状态</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={isActive}
                  onCheckedChange={(checked) => setIsActive(checked as boolean)}
                />
                <Label htmlFor="isActive">上架销售</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isFeatured"
                  checked={isFeatured}
                  onCheckedChange={(checked) => setIsFeatured(checked as boolean)}
                />
                <Label htmlFor="isFeatured">推荐商品</Label>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "保存中..." : "保存"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/products")}
            >
              取消
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
