import { Suspense } from "react";
import { ProductGrid } from "@/components/shop/products/product-grid";
import { ProductSearch } from "@/components/shop/products/product-search";
import { ProductFilters } from "@/components/shop/products/product-filters";
import { Button } from "@/components/ui/button";
import { getProducts } from "../actions/products";
import { getActiveCategories } from "../actions/categories";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const metadata = {
  title: "全部商品 - 电商系统",
};

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    sort?: "newest" | "price-asc" | "price-desc";
    page?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const [{ products, pagination }, categories] = await Promise.all([
    getProducts({
      search: params.search,
      categorySlug: params.category,
      sort: params.sort,
      page,
      limit: 12,
    }),
    getActiveCategories(),
  ]);

  const buildPageUrl = (pageNum: number) => {
    const urlParams = new URLSearchParams();
    if (params.search) urlParams.set("search", params.search);
    if (params.category) urlParams.set("category", params.category);
    if (params.sort) urlParams.set("sort", params.sort);
    if (pageNum > 1) urlParams.set("page", pageNum.toString());
    const queryString = urlParams.toString();
    return `/products${queryString ? `?${queryString}` : ""}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">全部商品</h1>
        <p className="text-muted-foreground">
          共 {pagination.total} 件商品
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <div className="w-full lg:w-64">
          <Suspense fallback={<div>Loading...</div>}>
            <ProductSearch />
          </Suspense>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <ProductFilters categories={categories} />
        </Suspense>
      </div>

      <ProductGrid products={products} emptyMessage="没有找到符合条件的商品" />

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          {page > 1 && (
            <Link href={buildPageUrl(page - 1)}>
              <Button variant="outline" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
          )}

          <div className="flex items-center gap-1">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter((p) => {
                if (pagination.totalPages <= 7) return true;
                if (p === 1 || p === pagination.totalPages) return true;
                if (Math.abs(p - page) <= 1) return true;
                return false;
              })
              .map((p, idx, arr) => {
                const showEllipsis = idx > 0 && p - arr[idx - 1] > 1;
                return (
                  <span key={p} className="flex items-center gap-1">
                    {showEllipsis && <span className="px-2">...</span>}
                    <Link href={buildPageUrl(p)}>
                      <Button
                        variant={p === page ? "default" : "outline"}
                        size="icon"
                      >
                        {p}
                      </Button>
                    </Link>
                  </span>
                );
              })}
          </div>

          {page < pagination.totalPages && (
            <Link href={buildPageUrl(page + 1)}>
              <Button variant="outline" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
