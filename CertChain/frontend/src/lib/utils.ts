import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine multiple Tailwind class names conditionally.
 * Example:
 *   cn("p-2", isActive && "bg-blue-500")
 */
export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}
