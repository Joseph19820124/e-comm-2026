import { OrderStatus } from "@prisma/client";

export const ORDER_STATUS_MAP: Record<OrderStatus, { label: string; color: string }> = {
  PENDING: { label: "待付款", color: "bg-yellow-100 text-yellow-800" },
  PAID: { label: "已付款", color: "bg-blue-100 text-blue-800" },
  PROCESSING: { label: "处理中", color: "bg-purple-100 text-purple-800" },
  SHIPPED: { label: "已发货", color: "bg-indigo-100 text-indigo-800" },
  DELIVERED: { label: "已送达", color: "bg-green-100 text-green-800" },
  CANCELLED: { label: "已取消", color: "bg-gray-100 text-gray-800" },
  REFUNDED: { label: "已退款", color: "bg-red-100 text-red-800" },
};
