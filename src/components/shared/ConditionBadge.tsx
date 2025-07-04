import React from "react";

type ConditionBadgeProps = {
  condition: string;
};

const conditionColor = (condition: string) => {
  switch (condition) {
    case "New sealed":
      return "bg-emerald-500";
    case "New open box":
      return "bg-sky-500";
    case "like_new":
      return "bg-green-400";
    case "acceptable":
      return "bg-yellow-400";
    case "Good":
      return "bg-amber-400";
    case "To repair":
      return "bg-red-500";
  }
};

const ConditionBadge = ({ condition }: ConditionBadgeProps) => {
  return (
    <div className="flex gap-1 items-center">
      <div className={`rounded-full size-4 ${conditionColor(condition)}`}></div>
      <h3>{condition}</h3>
    </div>
  );
};

export default ConditionBadge;
