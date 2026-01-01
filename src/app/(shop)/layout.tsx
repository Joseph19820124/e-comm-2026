import { SessionProvider } from "next-auth/react";
import { ShopHeader } from "@/components/shop/layout/header";
import { ShopFooter } from "@/components/shop/layout/footer";
import { getActiveCategories } from "./actions/categories";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const categories = await getActiveCategories();

  return (
    <SessionProvider>
      <div className="min-h-screen flex flex-col">
        <ShopHeader categories={categories} />
        <main className="flex-1">{children}</main>
        <ShopFooter />
      </div>
    </SessionProvider>
  );
}
