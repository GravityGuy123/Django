import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPriceToNaira = (price: number) => {
  return price.toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
  });
};
