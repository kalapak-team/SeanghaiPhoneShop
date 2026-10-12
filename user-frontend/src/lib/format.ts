export function formatPrice(value?: number | null) {
  if (value == null) return "";
  return `$ ${Number(value).toLocaleString("en-US")}`;
}

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
