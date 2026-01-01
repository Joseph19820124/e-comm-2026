"use client";

import { useState } from "react";
import { Check, Plus, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AddressForm } from "@/components/shop/account/address-form";
import type { Address } from "@prisma/client";

interface AddressSelectorProps {
  addresses: Address[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAddressChange: () => void;
}

export function AddressSelector({
  addresses,
  selectedId,
  onSelect,
  onAddressChange,
}: AddressSelectorProps) {
  const [showForm, setShowForm] = useState(false);

  const handleFormClose = (open: boolean) => {
    setShowForm(open);
    if (!open) {
      onAddressChange();
    }
  };

  if (addresses.length === 0) {
    return (
      <div className="text-center py-8 border rounded-lg">
        <MapPin className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
        <p className="text-muted-foreground mb-4">还没有收货地址</p>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          添加地址
        </Button>
        <AddressForm open={showForm} onOpenChange={handleFormClose} />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {addresses.map((address) => (
        <div
          key={address.id}
          onClick={() => onSelect(address.id)}
          className={cn(
            "relative p-4 rounded-lg border-2 cursor-pointer transition-colors",
            selectedId === address.id
              ? "border-primary bg-primary/5"
              : "border-transparent bg-muted/50 hover:border-muted-foreground/30"
          )}
        >
          {selectedId === address.id && (
            <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
              <Check className="h-3 w-3" />
            </div>
          )}
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium">{address.name}</span>
            <span className="text-muted-foreground">{address.phone}</span>
            {address.isDefault && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                默认
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {address.province}
            {address.city}
            {address.district}
            {address.street}
          </p>
        </div>
      ))}

      <Button
        variant="outline"
        className="w-full"
        onClick={() => setShowForm(true)}
      >
        <Plus className="mr-2 h-4 w-4" />
        添加新地址
      </Button>

      <AddressForm open={showForm} onOpenChange={handleFormClose} />
    </div>
  );
}
