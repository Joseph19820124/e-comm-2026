import { notFound } from "next/navigation";
import Link from "next/link";
import { getUserById } from "../actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { UserRoleUpdate } from "./user-role-update";
import { ORDER_STATUS_MAP } from "@/lib/constants";

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUserById(id);

  if (!user) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/users">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">用户详情</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>基本信息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">姓名</p>
                  <p className="font-medium">{user.name || "未设置"}</p>
                </div>
                <div>
                  <p className="text-gray-500">邮箱</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-gray-500">角色</p>
                  <Badge
                    variant={user.role === "ADMIN" ? "default" : "secondary"}
                  >
                    {user.role === "ADMIN" ? "管理员" : "用户"}
                  </Badge>
                </div>
                <div>
                  <p className="text-gray-500">注册时间</p>
                  <p>{new Date(user.createdAt).toLocaleString("zh-CN")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>收货地址 ({user.addresses.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {user.addresses.length === 0 ? (
                <p className="text-gray-500">暂无收货地址</p>
              ) : (
                <div className="space-y-4">
                  {user.addresses.map((address) => (
                    <div
                      key={address.id}
                      className="p-4 border rounded-lg space-y-1"
                    >
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{address.name}</p>
                        <p className="text-gray-500">{address.phone}</p>
                        {address.isDefault && (
                          <Badge variant="outline">默认</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {address.province} {address.city} {address.district}{" "}
                        {address.street}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>最近订单 ({user._count.orders})</CardTitle>
            </CardHeader>
            <CardContent>
              {user.orders.length === 0 ? (
                <p className="text-gray-500">暂无订单</p>
              ) : (
                <div className="space-y-4">
                  {user.orders.map((order) => {
                    const statusInfo = ORDER_STATUS_MAP[order.status];
                    return (
                      <Link
                        key={order.id}
                        href={`/admin/orders/${order.id}`}
                        className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-mono text-sm">
                              {order.orderNumber}
                            </p>
                            <p className="text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleString("zh-CN")}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {formatPrice(order.total.toString())}
                            </p>
                            <span
                              className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${statusInfo.color}`}
                            >
                              {statusInfo.label}
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>角色管理</CardTitle>
            </CardHeader>
            <CardContent>
              <UserRoleUpdate userId={user.id} currentRole={user.role} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
