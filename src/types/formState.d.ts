import { Media } from "./toy";

export type CreateToyFormState = | {
  data: {
    title?: string;
    description?: string;
    price?: number;
    location?: string;
    categoryId?: number;
    statusId?: number;
    conditionId?: number;
    forSell?: boolean;
    forGifts?: boolean;
    forChanges?: boolean;
    userId?: string;
    isActive?: boolean;
    media?: Media[];
  };
  errors: {
    title?: string[];
    description?: string[];
    price?: string[];
    location?: string[];
    categoryId?: string[];
    statusId?: string[];
    conditionId?: string[];
    forSell?: string[];
    forGifts?: string[];
    forChanges?: string[];
    userId?: string[];
    isActive?: string[];
    media?: string[];
  }
  message?: string;
}
| undefined;
