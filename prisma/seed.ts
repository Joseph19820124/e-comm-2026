import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin",
      password: "admin123", // In production, use bcrypt
      role: "ADMIN",
    },
  });

  console.log("Created admin user:", admin.email);

  // Create sample categories
  const electronics = await prisma.category.upsert({
    where: { slug: "electronics" },
    update: {},
    create: {
      name: "电子产品",
      slug: "electronics",
      description: "各类电子产品",
      isActive: true,
    },
  });

  const clothing = await prisma.category.upsert({
    where: { slug: "clothing" },
    update: {},
    create: {
      name: "服装",
      slug: "clothing",
      description: "时尚服装",
      isActive: true,
    },
  });

  console.log("Created categories:", electronics.name, clothing.name);

  // Create sample products
  const products = await Promise.all([
    prisma.product.upsert({
      where: { slug: "iphone-15" },
      update: {},
      create: {
        name: "iPhone 15",
        slug: "iphone-15",
        description: "最新款 iPhone",
        price: 6999,
        comparePrice: 7999,
        stock: 100,
        sku: "IP15-001",
        categoryId: electronics.id,
        isActive: true,
        isFeatured: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: "macbook-pro" },
      update: {},
      create: {
        name: "MacBook Pro",
        slug: "macbook-pro",
        description: "专业级笔记本电脑",
        price: 14999,
        comparePrice: 16999,
        stock: 50,
        sku: "MBP-001",
        categoryId: electronics.id,
        isActive: true,
        isFeatured: true,
      },
    }),
    prisma.product.upsert({
      where: { slug: "t-shirt" },
      update: {},
      create: {
        name: "纯棉T恤",
        slug: "t-shirt",
        description: "舒适纯棉T恤",
        price: 99,
        comparePrice: 149,
        stock: 200,
        sku: "TS-001",
        categoryId: clothing.id,
        isActive: true,
      },
    }),
  ]);

  console.log("Created products:", products.length);

  console.log("\n✅ Seed completed!");
  console.log("\n📝 Admin login:");
  console.log("   Email: admin@example.com");
  console.log("   Password: admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
