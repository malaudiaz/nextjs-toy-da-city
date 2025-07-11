import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import React from "react";

const TypeFilter = () => {
  return (
    <div className="space-y-2 px-4 py-2">
      <h3>Type</h3>
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center gap-1">
          <Label className="text-sm">Sale</Label>
          <Input className="size-6" type="checkbox" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <Label className="text-sm">Free</Label>
          <Input className="size-6" type="checkbox" />
        </div>
        <div className="flex flex-col items-center gap-1">
          <Label className="text-sm">Swap</Label>
          <Input className="size-6" type="checkbox" />
        </div>
      </div>
    </div>
  );
};

export default TypeFilter;
