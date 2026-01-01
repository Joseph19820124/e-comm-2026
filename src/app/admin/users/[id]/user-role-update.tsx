"use client";

import { useState } from "react";
import { updateUserRole } from "../actions";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { UserRole } from "@prisma/client";

interface UserRoleUpdateProps {
  userId: string;
  currentRole: UserRole;
}

export function UserRoleUpdate({ userId, currentRole }: UserRoleUpdateProps) {
  const [role, setRole] = useState<UserRole>(currentRole);
  const [loading, setLoading] = useState(false);

  async function handleUpdate() {
    if (role === currentRole) {
      toast.info("角色未改变");
      return;
    }

    setLoading(true);
    const result = await updateUserRole(userId, role);
    setLoading(false);

    if (result.success) {
      toast.success("角色更新成功");
    } else {
      toast.error("更新失败");
    }
  }

  return (
    <div className="space-y-4">
      <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="USER">普通用户</SelectItem>
          <SelectItem value="ADMIN">管理员</SelectItem>
        </SelectContent>
      </Select>
      <Button
        className="w-full"
        onClick={handleUpdate}
        disabled={loading || role === currentRole}
      >
        {loading ? "更新中..." : "更新角色"}
      </Button>
    </div>
  );
}
