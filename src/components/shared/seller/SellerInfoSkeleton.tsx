
import React from "react";

const SellerInfoSkeleton = () => {
  return (
    <div className="flex items-center space-x-6 animate-pulse lg:min-w-6xl mx-auto">
      {/* Avatar skeleton */}
      <div className="w-28 h-28 rounded-full bg-gray-300 flex-shrink-0" />

      {/* Text content skeleton */}
      <div className="space-y-3">
        <div className="h-8 w-48 bg-gray-300 rounded"></div> {/* Name */}
        <div className="h-6 w-40 bg-gray-300 rounded"></div> {/* Rating line */}
        <div className="h-4 w-32 bg-gray-300 rounded"></div> {/* Member since */}
        <div className="h-4 w-24 bg-gray-300 rounded"></div> {/* Role */}
      </div>
    </div>
  );
};

export default SellerInfoSkeleton;