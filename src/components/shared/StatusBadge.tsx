import React from "react";

type statusBadgeProps = {
  status: string;
};

const StatusBadge = ({ status }: statusBadgeProps) => {
  const statusBadge = () => {
    switch (status) {
      case "Like new":
        return "bg-blue-500";
      case "Acceptable":
        return "bg-brown-500";
      case "New":
        return "bg-green-700";
      default:
        return "bg-red-500";
    }
  };

  return (
    <div className="flex gap-1 items-center min-h-[24px] mb-1">
      <div className={`rounded-full size-4 ${statusBadge()}`}></div>
      <span className="line-clamp-1">{status}</span>
    </div>
  );
};

export default StatusBadge;
