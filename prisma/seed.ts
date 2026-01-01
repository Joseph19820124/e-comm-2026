import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Unsplash 图片 (免费使用)
const categoryImages = {
  electronics: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400",
  clothing: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400",
  home: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400",
  sports: "https://images.unsplash.com/photo-1461896836934- voices?w=400",
  beauty: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400",
  books: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400",
  food: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400",
  toys: "https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400",
  jewelry: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400",
  outdoor: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400",
};

const categories = [
  { name: "电子产品", slug: "electronics", description: "手机、电脑、数码配件等" },
  { name: "服装鞋包", slug: "clothing", description: "男装、女装、鞋子、箱包" },
  { name: "家居生活", slug: "home", description: "家具、家纺、厨具、收纳" },
  { name: "运动户外", slug: "sports", description: "运动装备、健身器材、户外用品" },
  { name: "美妆个护", slug: "beauty", description: "护肤、彩妆、个人护理" },
  { name: "图书音像", slug: "books", description: "图书、电子书、音乐、影视" },
  { name: "食品生鲜", slug: "food", description: "零食、饮料、生鲜、进口食品" },
  { name: "母婴玩具", slug: "toys", description: "童装、玩具、婴儿用品" },
  { name: "珠宝配饰", slug: "jewelry", description: "项链、手表、眼镜、饰品" },
  { name: "户外露营", slug: "outdoor", description: "帐篷、睡袋、野餐、登山" },
];

const productData: Record<string, Array<{
  name: string;
  price: number;
  comparePrice?: number;
  description: string;
  image: string;
  isFeatured?: boolean;
}>> = {
  electronics: [
    { name: "iPhone 15 Pro Max", price: 9999, comparePrice: 10999, description: "Apple 最新旗舰手机，A17 Pro 芯片", image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400", isFeatured: true },
    { name: "MacBook Pro 14寸", price: 14999, comparePrice: 16999, description: "M3 Pro 芯片，专业级性能", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400", isFeatured: true },
    { name: "AirPods Pro 2", price: 1899, comparePrice: 1999, description: "主动降噪，空间音频", image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400" },
    { name: "iPad Air", price: 4799, comparePrice: 5299, description: "M1 芯片，10.9 英寸", image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400" },
    { name: "Apple Watch Ultra", price: 6499, comparePrice: 6999, description: "钛金属表壳，极限运动", image: "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400" },
  ],
  clothing: [
    { name: "纯棉休闲T恤", price: 99, comparePrice: 149, description: "100%纯棉，舒适透气", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400", isFeatured: true },
    { name: "修身牛仔裤", price: 299, comparePrice: 399, description: "弹力修身，经典蓝色", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400" },
    { name: "羊毛大衣", price: 899, comparePrice: 1299, description: "70%羊毛，保暖时尚", image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400", isFeatured: true },
    { name: "运动休闲鞋", price: 459, comparePrice: 599, description: "轻便舒适，缓震科技", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400" },
    { name: "商务双肩包", price: 359, comparePrice: 459, description: "大容量，防水面料", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400" },
  ],
  home: [
    { name: "北欧风沙发", price: 2999, comparePrice: 3999, description: "简约设计，优质面料", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400", isFeatured: true },
    { name: "乳胶记忆枕", price: 199, comparePrice: 299, description: "泰国天然乳胶，护颈设计", image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400" },
    { name: "智能电饭煲", price: 599, comparePrice: 799, description: "IH加热，多种烹饪模式", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400" },
    { name: "无线吸尘器", price: 1299, comparePrice: 1599, description: "强劲吸力，长续航", image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400" },
    { name: "空气净化器", price: 899, comparePrice: 1199, description: "HEPA滤网，除甲醛", image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400" },
  ],
  sports: [
    { name: "瑜伽垫加厚版", price: 129, comparePrice: 179, description: "TPE材质，防滑耐磨", image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400", isFeatured: true },
    { name: "跑步机家用款", price: 2999, comparePrice: 3599, description: "折叠设计，静音马达", image: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=400" },
    { name: "哑铃套装", price: 399, comparePrice: 499, description: "可调节重量，包胶防滑", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400" },
    { name: "运动水壶", price: 79, comparePrice: 99, description: "大容量1L，防漏设计", image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400" },
    { name: "运动护膝", price: 89, comparePrice: 129, description: "专业防护，透气舒适", image: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=400" },
  ],
  beauty: [
    { name: "精华液套装", price: 299, comparePrice: 399, description: "玻尿酸+烟酰胺，补水亮肤", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400", isFeatured: true },
    { name: "口红礼盒", price: 399, comparePrice: 499, description: "6色套装，丝绒质地", image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400" },
    { name: "电动牙刷", price: 299, comparePrice: 399, description: "声波清洁，智能计时", image: "https://images.unsplash.com/photo-1559590240-675c0b5e6f79?w=400" },
    { name: "护发精油", price: 89, comparePrice: 129, description: "摩洛哥坚果油，修护发质", image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400" },
    { name: "面膜礼盒", price: 159, comparePrice: 199, description: "20片装，多种功效", image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400" },
  ],
  books: [
    { name: "人类简史", price: 59, comparePrice: 79, description: "尤瓦尔·赫拉利经典著作", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400", isFeatured: true },
    { name: "三体全集", price: 99, comparePrice: 129, description: "刘慈欣科幻巨著，精装版", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400" },
    { name: "程序员修炼之道", price: 79, comparePrice: 99, description: "编程经典，第二版", image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400" },
    { name: "小王子", price: 39, comparePrice: 49, description: "法语原版插图，中法对照", image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400" },
    { name: "经济学原理", price: 89, comparePrice: 119, description: "曼昆著作，最新版", image: "https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?w=400" },
  ],
  food: [
    { name: "进口坚果礼盒", price: 199, comparePrice: 259, description: "6种坚果，年货必备", image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400", isFeatured: true },
    { name: "有机蜂蜜", price: 89, comparePrice: 119, description: "新西兰进口，纯天然", image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400" },
    { name: "精品咖啡豆", price: 129, comparePrice: 159, description: "埃塞俄比亚产区，中度烘焙", image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400" },
    { name: "日式抹茶粉", price: 69, comparePrice: 89, description: "宇治抹茶，烘焙甜品用", image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400" },
    { name: "黑巧克力礼盒", price: 159, comparePrice: 199, description: "72%可可，比利时进口", image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400" },
  ],
  toys: [
    { name: "乐高城市系列", price: 399, comparePrice: 499, description: "警察局套装，适合6岁+", image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400", isFeatured: true },
    { name: "儿童滑板车", price: 299, comparePrice: 399, description: "三轮设计，LED发光轮", image: "https://images.unsplash.com/photo-1566140967404-b8b3932483f5?w=400" },
    { name: "益智积木桶", price: 159, comparePrice: 199, description: "200+块，多种颜色", image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400" },
    { name: "遥控汽车", price: 189, comparePrice: 249, description: "越野车型，充电续航", image: "https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=400" },
    { name: "毛绒玩具熊", price: 89, comparePrice: 129, description: "60cm大号，柔软亲肤", image: "https://images.unsplash.com/photo-1558679908-541bcf1249ff?w=400" },
  ],
  jewelry: [
    { name: "银饰项链", price: 299, comparePrice: 399, description: "925纯银，简约款式", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400", isFeatured: true },
    { name: "机械手表", price: 1999, comparePrice: 2599, description: "自动机芯，商务风格", image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400" },
    { name: "防蓝光眼镜", price: 199, comparePrice: 259, description: "TR90材质，超轻镜框", image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400" },
    { name: "珍珠耳环", price: 159, comparePrice: 199, description: "淡水珍珠，优雅经典", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400" },
    { name: "皮质手链", price: 89, comparePrice: 119, description: "头层牛皮，男女通用", image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400" },
  ],
  outdoor: [
    { name: "双人帐篷", price: 599, comparePrice: 799, description: "防风防雨，快速搭建", image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=400", isFeatured: true },
    { name: "登山背包", price: 399, comparePrice: 499, description: "50L大容量，防水面料", image: "https://images.unsplash.com/photo-1622260614153-03223fb72052?w=400" },
    { name: "户外睡袋", price: 299, comparePrice: 399, description: "羽绒填充，-10度保暖", image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400" },
    { name: "折叠野餐桌", price: 189, comparePrice: 249, description: "铝合金材质，轻便易携", image: "https://images.unsplash.com/photo-1526401485004-46910ecc8e51?w=400" },
    { name: "户外头灯", price: 79, comparePrice: 99, description: "USB充电，三档调节", image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400" },
  ],
};

async function main() {
  console.log("🌱 开始填充数据...\n");

  // Create admin user with hashed password
  const hashedPassword = await hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: { password: hashedPassword },
    create: {
      email: "admin@example.com",
      name: "Admin",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log("✅ 管理员账户:", admin.email);

  // Create categories
  const createdCategories: Record<string, string> = {};
  for (let i = 0; i < categories.length; i++) {
    const cat = categories[i];
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        image: categoryImages[cat.slug as keyof typeof categoryImages],
        sortOrder: i,
      },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: categoryImages[cat.slug as keyof typeof categoryImages],
        sortOrder: i,
        isActive: true,
      },
    });
    createdCategories[cat.slug] = category.id;
    console.log(`✅ 分类: ${cat.name}`);
  }

  // Create products
  let productCount = 0;
  for (const [categorySlug, products] of Object.entries(productData)) {
    const categoryId = createdCategories[categorySlug];
    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      const slug = `${categorySlug}-${i + 1}`;
      await prisma.product.upsert({
        where: { slug },
        update: {
          name: p.name,
          description: p.description,
          price: p.price,
          comparePrice: p.comparePrice,
          thumbnail: p.image,
          images: [p.image],
          isFeatured: p.isFeatured || false,
        },
        create: {
          name: p.name,
          slug,
          description: p.description,
          price: p.price,
          comparePrice: p.comparePrice,
          thumbnail: p.image,
          images: [p.image],
          stock: Math.floor(Math.random() * 100) + 20,
          sku: `${categorySlug.toUpperCase()}-${String(i + 1).padStart(3, "0")}`,
          categoryId,
          isActive: true,
          isFeatured: p.isFeatured || false,
        },
      });
      productCount++;
    }
  }
  console.log(`\n✅ 商品: ${productCount} 件`);

  console.log("\n🎉 数据填充完成!");
  console.log("\n📝 管理员登录:");
  console.log("   邮箱: admin@example.com");
  console.log("   密码: admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
