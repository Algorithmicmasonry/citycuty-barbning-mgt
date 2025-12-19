import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function serializePrisma(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}