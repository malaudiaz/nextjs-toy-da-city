import React from "react";

type DiscountBadgeProps = {
  discount: string;
  className?: string
};

const DiscountBadge = ({ discount, className }: DiscountBadgeProps) => {
  return (
    <div className="absolute top-0 right-6 bg-white text-red-500 text-xs font-bold px-2 py-1">
      <h3>{discount}</h3>
    </div>
  );
};

export default DiscountBadge;
