import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatPrice = (price) => {
  // Allow 0 as a valid price
  if (price === undefined || price === null || isNaN(price)) {
    console.warn("Invalid price:", price);
    return "£0.00";
  }
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(price);
};
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
