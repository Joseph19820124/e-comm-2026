import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Settings } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-6 h-6" />
            <span className="font-bold text-xl">电商系统</span>
          </div>
          <Link href="/admin">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              管理后台
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            电商系统 MVP
          </h1>
          <p className="text-lg text-gray-600">
            基于 Next.js 16 + Prisma 7 + NextAuth v5 构建的电商管理系统
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/admin">
              <Button size="lg" className="w-full sm:w-auto">
                进入管理后台
              </Button>
            </Link>
          </div>

          <div className="pt-12 border-t">
            <h2 className="text-xl font-semibold mb-4">已完成功能</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="p-4 bg-white rounded-lg border">
                <p className="font-medium">分类管理</p>
                <p className="text-gray-500">层级分类</p>
              </div>
              <div className="p-4 bg-white rounded-lg border">
                <p className="font-medium">商品管理</p>
                <p className="text-gray-500">CRUD + 搜索</p>
              </div>
              <div className="p-4 bg-white rounded-lg border">
                <p className="font-medium">订单管理</p>
                <p className="text-gray-500">状态流转</p>
              </div>
              <div className="p-4 bg-white rounded-lg border">
                <p className="font-medium">用户管理</p>
                <p className="text-gray-500">角色分配</p>
              </div>
            </div>
          </div>

          <div className="pt-8 text-sm text-gray-500">
            <p>测试账户: admin@example.com / admin123</p>
          </div>
        </div>
      </main>
    </div>
  );
}
