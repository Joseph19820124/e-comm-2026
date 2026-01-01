import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProductGallery } from "@/components/shop/products/product-gallery";
import { AddToCartButton } from "@/components/shop/products/add-to-cart-button";
import { ProductGrid } from "@/components/shop/products/product-grid";
import { getProductBySlug, getRelatedProducts } from "../../actions/products";
import { formatPrice } from "@/lib/utils";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "商品未找到" };
  }

  return {
    title: `${product.name} - 电商系统`,
    description: product.description?.slice(0, 160),
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(
    product.id,
    product.category?.id || null,
    4
  );

  const hasDiscount =
    product.comparePrice && Number(product.comparePrice) > Number(product.price);
  const discountPercent = hasDiscount
    ? Math.round(
        (1 - Number(product.price) / Number(product.comparePrice)) * 100
      )
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground transition-colors">
          首页
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/products" className="hover:text-foreground transition-colors">
          全部商品
        </Link>
        {product.category && (
          <>
            <ChevronRight className="h-4 w-4" />
            <Link
              href={`/products?category=${product.category.slug}`}
              className="hover:text-foreground transition-colors"
            >
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground truncate max-w-[200px]">
          {product.name}
        </span>
      </nav>

      {/* Product Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Gallery */}
        <ProductGallery
          images={product.images}
          thumbnail={product.thumbnail}
          productName={product.name}
        />

        {/* Info */}
        <div className="space-y-6">
          <div>
            {product.category && (
              <Link
                href={`/products?category=${product.category.slug}`}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                {product.category.name}
              </Link>
            )}
            <h1 className="text-2xl md:text-3xl font-bold mt-1">
              {product.name}
            </h1>
            {product.sku && (
              <p className="text-sm text-muted-foreground mt-2">
                SKU: {product.sku}
              </p>
            )}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">
              {formatPrice(Number(product.price))}
            </span>
            {hasDiscount && (
              <>
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(Number(product.comparePrice!))}
                </span>
                <Badge variant="destructive">-{discountPercent}%</Badge>
              </>
            )}
          </div>

          {/* Stock Status */}
          <div>
            {product.stock > 0 ? (
              <Badge variant="outline" className="text-green-600 border-green-600">
                有货
              </Badge>
            ) : (
              <Badge variant="secondary">已售罄</Badge>
            )}
          </div>

          <Separator />

          {/* Add to Cart */}
          <AddToCartButton
            product={{
              id: product.id,
              name: product.name,
              price: Number(product.price),
              thumbnail: product.thumbnail,
              stock: product.stock,
            }}
          />

          <Separator />

          {/* Description */}
          {product.description && (
            <div>
              <h2 className="font-semibold mb-3">商品描述</h2>
              <div className="text-muted-foreground whitespace-pre-wrap">
                {product.description}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6">相关商品</h2>
          <ProductGrid products={relatedProducts} />
        </section>
      )}
    </div>
  );
}
