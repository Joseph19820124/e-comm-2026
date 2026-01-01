import { ProductCard } from "./product-card";

type DecimalLike = { toString(): string } | number | string;

interface Product {
  id: string;
  name: string;
  slug: string;
  price: DecimalLike;
  comparePrice: DecimalLike | null;
  thumbnail: string | null;
  stock: number;
  category?: { name: string; slug: string } | null;
}

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
}

export function ProductGrid({ products, emptyMessage = "暂无商品" }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
