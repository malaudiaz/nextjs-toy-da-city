import React from 'react';

type StatusBadgeProps = {
  status: number;
};

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case 1:
        return { text: 'New', bg: 'bg-green-600' };
      case 2:
        return { text: 'Like new', bg: 'bg-blue-500' };
      case 3:
        return { text: 'Acceptable', bg: 'bg-amber-600' };
      default:
        return { text: 'To Repair', bg: 'bg-red-500' };
    }
  };

  const { text, bg } = getStatusConfig();

  return (
    <div className="flex gap-1 items-center min-h-[24px] mb-1">
      <div className={`rounded-full size-4 ${bg}`}></div>
      <span className="line-clamp-1 text-sm">{text}</span>
    </div>
  );
};

export default StatusBadge;