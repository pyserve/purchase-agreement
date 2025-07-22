import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function tryJsonParse<T>(data: string | object): T {
  try {
    if (typeof data === "object") return data as T;

    if (data.startsWith("[")) {
      const parsedData = JSON.parse(data);
      return parsedData;
    } else {
      const parsedData = JSON.parse(`[${data}]`);
      return parsedData[0];
    }
  } catch (error) {
    return data as T;
  }
}
