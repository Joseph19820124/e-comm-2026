"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { createAddress, updateAddress } from "@/app/(shop)/actions/addresses";
import type { Address } from "@prisma/client";

interface AddressFormProps {
  address?: Address | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddressForm({ address, open, onOpenChange }: AddressFormProps) {
  const [loading, setLoading] = useState(false);
  const [isDefault, setIsDefault] = useState(address?.isDefault || false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set("isDefault", isDefault.toString());

    const result = address
      ? await updateAddress(address.id, formData)
      : await createAddress(formData);

    if (result.success) {
      toast.success(address ? "地址已更新" : "地址已添加");
      onOpenChange(false);
    } else {
      toast.error(result.error || "操作失败");
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{address ? "编辑地址" : "添加新地址"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">收货人 *</Label>
              <Input
                id="name"
                name="name"
                defaultValue={address?.name}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">手机号 *</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                defaultValue={address?.phone}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="province">省份 *</Label>
              <Input
                id="province"
                name="province"
                placeholder="如：广东省"
                defaultValue={address?.province}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">城市 *</Label>
              <Input
                id="city"
                name="city"
                placeholder="如：深圳市"
                defaultValue={address?.city}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="district">区县 *</Label>
              <Input
                id="district"
                name="district"
                placeholder="如：南山区"
                defaultValue={address?.district}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="street">详细地址 *</Label>
            <Input
              id="street"
              name="street"
              placeholder="街道、门牌号、小区、楼栋等"
              defaultValue={address?.street}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="postalCode">邮政编码</Label>
            <Input
              id="postalCode"
              name="postalCode"
              placeholder="可选"
              defaultValue={address?.postalCode || ""}
              disabled={loading}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isDefault"
              checked={isDefault}
              onCheckedChange={(checked) => setIsDefault(checked === true)}
              disabled={loading}
            />
            <Label htmlFor="isDefault" className="font-normal">
              设为默认地址
            </Label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              取消
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {address ? "保存" : "添加"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
