import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/shop/products/product-grid";
import { getFeaturedProducts, getProductsByCategory } from "./actions/products";
import { getTopCategoriesWithProducts } from "./actions/categories";

export default async function HomePage() {
  const [featuredProducts, topCategories] = await Promise.all([
    getFeaturedProducts(8),
    getTopCategoriesWithProducts(4),
  ]);

  const categoryProducts = await Promise.all(
    topCategories.map(async (category) => ({
      category,
      products: await getProductsByCategory(category.slug, 4),
    }))
  );

  return (
    <div className="space-y-12 py-8">
      {/* Hero Section */}
      <section className="container mx-auto px-4">
        <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-background p-8 md:p-12">
          <div className="max-w-2xl space-y-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              发现优质好物
            </h1>
            <p className="text-lg text-muted-foreground">
              精选商品，品质保证，快速配送
            </p>
            <Link href="/products">
              <Button size="lg" className="mt-4">
                立即选购
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">推荐商品</h2>
            <Link href="/products?featured=true">
              <Button variant="ghost" size="sm">
                查看更多
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <ProductGrid products={featuredProducts} />
        </section>
      )}

      {/* Category Products */}
      {categoryProducts.map(
        ({ category, products }) =>
          products.length > 0 && (
            <section key={category.id} className="container mx-auto px-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">{category.name}</h2>
                <Link href={`/products?category=${category.slug}`}>
                  <Button variant="ghost" size="sm">
                    查看更多
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <ProductGrid products={products} />
            </section>
          )
      )}

      {/* Empty State */}
      {featuredProducts.length === 0 && categoryProducts.every(({ products }) => products.length === 0) && (
        <section className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">暂无商品</h2>
          <p className="text-muted-foreground mb-8">
            商品正在上架中，请稍后再来
          </p>
          <Link href="/admin">
            <Button>前往后台添加商品</Button>
          </Link>
        </section>
      )}
    </div>
  );
}
