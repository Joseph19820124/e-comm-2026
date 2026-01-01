"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ORDER_STATUS_MAP } from "@/lib/constants";

const statuses = [
  { value: "all", label: "全部" },
  ...Object.entries(ORDER_STATUS_MAP).map(([value, { label }]) => ({
    value,
    label,
  })),
];

export function OrderStatusFilter({ currentStatus }: { currentStatus?: string }) {
  const router = useRouter();

  function handleFilter(status: string) {
    if (status === "all") {
      router.push("/admin/orders");
    } else {
      router.push(`/admin/orders?status=${status}`);
    }
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {statuses.map((status) => (
        <Button
          key={status.value}
          variant={
            (currentStatus || "all") === status.value ? "default" : "outline"
          }
          size="sm"
          onClick={() => handleFilter(status.value)}
        >
          {status.label}
        </Button>
      ))}
    </div>
  );
}
