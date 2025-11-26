
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const SellerInfoSkeleton = () => {
  return (
    <div className="flex items-center space-x-6 animate-pulse lg:min-w-6xl mx-auto">
      
      <Skeleton className="w-24 h-24 rounded-full" />
      <div className="space-y-3">
        <Skeleton className="h-8 w-48"></Skeleton>
        <Skeleton className="h-6 w-40"></Skeleton> 
        <Skeleton className="h-4 w-32"></Skeleton> 
        <Skeleton className="h-4 w-24"></Skeleton> 
      </div>
    </div>
  );
};

export default SellerInfoSkeleton;