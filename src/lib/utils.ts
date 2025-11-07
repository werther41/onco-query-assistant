import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function validateVariantFormat(variant: string): boolean {
  // Basic validation for variant formats like R361C, G12S, Exon 14 Skipping, etc.
  if (!variant || variant.trim().length === 0) return false;
  return true;
}

