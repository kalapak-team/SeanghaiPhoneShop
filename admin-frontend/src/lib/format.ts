export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(value?: number | null) {
  if (value == null) return "$0";
  return `$ ${Number(value).toLocaleString("en-US")}`;
}
