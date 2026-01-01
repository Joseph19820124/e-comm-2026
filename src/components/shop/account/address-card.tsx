"use client";

import { useState } from "react";
import { MoreVertical, Pencil, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { deleteAddress, setDefaultAddress } from "@/app/(shop)/actions/addresses";
import type { Address } from "@prisma/client";

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
}

export function AddressCard({ address, onEdit }: AddressCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const result = await deleteAddress(address.id);
    if (result.success) {
      toast.success("地址已删除");
      setShowDeleteDialog(false);
    } else {
      toast.error(result.error || "删除失败");
    }
    setLoading(false);
  };

  const handleSetDefault = async () => {
    const result = await setDefaultAddress(address.id);
    if (result.success) {
      toast.success("已设为默认地址");
    } else {
      toast.error(result.error || "设置失败");
    }
  };

  return (
    <>
      <div className="relative p-4 rounded-lg border hover:border-primary/50 transition-colors">
        {address.isDefault && (
          <Badge className="absolute top-2 right-2">默认</Badge>
        )}

        <div className="pr-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium">{address.name}</span>
            <span className="text-muted-foreground">{address.phone}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {address.province}
            {address.city}
            {address.district}
            {address.street}
            {address.postalCode && ` (${address.postalCode})`}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-10"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(address)}>
              <Pencil className="mr-2 h-4 w-4" />
              编辑
            </DropdownMenuItem>
            {!address.isDefault && (
              <DropdownMenuItem onClick={handleSetDefault}>
                <Star className="mr-2 h-4 w-4" />
                设为默认
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() => setShowDeleteDialog(true)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              删除
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              确定要删除这个收货地址吗？此操作无法撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={loading}
            >
              取消
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
