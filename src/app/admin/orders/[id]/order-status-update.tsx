"use client";

import { useState } from "react";
import { updateOrderStatus } from "../actions";
import { ORDER_STATUS_MAP } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { OrderStatus } from "@prisma/client";

interface OrderStatusUpdateProps {
  orderId: string;
  currentStatus: OrderStatus;
}

export function OrderStatusUpdate({
  orderId,
  currentStatus,
}: OrderStatusUpdateProps) {
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [loading, setLoading] = useState(false);

  async function handleUpdate() {
    if (status === currentStatus) {
      toast.info("状态未改变");
      return;
    }

    setLoading(true);
    const result = await updateOrderStatus(orderId, status);
    setLoading(false);

    if (result.success) {
      toast.success("状态更新成功");
    } else {
      toast.error("更新失败");
    }
  }

  return (
    <div className="space-y-4">
      <Select
        value={status}
        onValueChange={(value) => setStatus(value as OrderStatus)}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(ORDER_STATUS_MAP).map(([value, { label }]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        className="w-full"
        onClick={handleUpdate}
        disabled={loading || status === currentStatus}
      >
        {loading ? "更新中..." : "更新状态"}
      </Button>
    </div>
  );
}
