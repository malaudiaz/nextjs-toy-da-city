import React from "react";

type ConditionBadgeProps = {
  condition: string;
};

const CONDITION_MAP = {
  "new_sealed": {
    en: "New sealed",
    es: "Nuevo - sellado"
  },
  "new_open_box": {
    en: "New open box",
    es: "Nuevo - caja abierta"
  },
  "like_new": {
    en: "Like new",
    es: "Como nuevo"
  },
  "acceptable": {
    en: "Acceptable",
    es: "Aceptable"
  },
  "good": {
    en: "Good",
    es: "Bueno"
  },
  "to_repair": {
    en: "To repair",
    es: "Para reparar"
  }
};
type ConditionKey = keyof typeof CONDITION_MAP;

const getConditionColor = (condition: string): string => {
  const normalizedCondition = condition.toLowerCase().trim();

  const colorMap: Record<ConditionKey, string> = {
    new_sealed: "bg-emerald-500",
    new_open_box: "bg-sky-500",
    like_new: "bg-green-400",
    acceptable: "bg-yellow-400",
    good: "bg-amber-400",
    to_repair: "bg-red-500",
  };

  const foundKey = Object.keys(CONDITION_MAP).find((key) => {
    const translations = CONDITION_MAP[key as ConditionKey];
    return (
      translations.en.toLowerCase() === normalizedCondition ||
      translations.es.toLowerCase() === normalizedCondition
    );
  }) as ConditionKey | undefined;

  return foundKey ? colorMap[foundKey] : "bg-gray-300";
};

const ConditionBadge = ({ condition }: ConditionBadgeProps) => {
  return (
    <div className="flex gap-1 items-center">
      <div className={`rounded-full size-4 ${getConditionColor(condition)}`}></div>
      <h3>{condition}</h3>
    </div>
  );
};

export default ConditionBadge;
