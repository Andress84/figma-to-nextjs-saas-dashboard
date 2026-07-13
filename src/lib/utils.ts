type ClassValue = false | null | string | undefined;

export function cn(...classes: readonly ClassValue[]) {
  return classes.filter(Boolean).join(" ");
}
