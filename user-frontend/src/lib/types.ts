export type Brand = {
  id: number;
  name: string;
  slug: string;
  logoUrl?: string | null;
  showOnHome?: boolean;
};

export type Category = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
};

export type ProductCard = {
  id: number;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  image?: string | null;
  brand: string;
  brandSlug: string;
  category: string;
  categorySlug: string;
  condition: "NEW" | "SECONDHAND";
  conditionPercent?: number | null;
  featured: boolean;
  stock: number;
  warranty?: string | null;
};

export type ProductDetail = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  sku?: string | null;
  storage?: string | null;
  color?: string | null;
  warranty?: string | null;
  specs?: string | null;
  price: number;
  compareAtPrice?: number | null;
  stock: number;
  condition: "NEW" | "SECONDHAND";
  conditionPercent?: number | null;
  images: string[];
  featured: boolean;
  active: boolean;
  brand: Brand;
  category: Category;
};

export type Banner = {
  id: number;
  title: string;
  subtitle?: string | null;
  imageUrl?: string | null;
  linkUrl?: string | null;
  buttonText?: string | null;
  theme?: string | null;
};

export type Store = {
  id: number;
  name: string;
  addressKh?: string | null;
  addressEn?: string | null;
  phones?: string | null;
  facebookUrl?: string | null;
};

export type Settings = {
  shopName: string;
  tagline: string;
  khmerPhone: string;
  englishPhone: string;
  email: string;
  telegramUrl: string;
  telegramChannelUrl: string;
  facebookUrl: string;
  announcement: string;
  about: string;
  freeDeliveryNote: string;
};

export type BrandSection = {
  brand: Brand;
  products: ProductCard[];
};

export type HomeData = {
  settings: Settings;
  banners: Banner[];
  brands: Brand[];
  categories: Category[];
  featuredProducts: ProductCard[];
  brandSections: BrandSection[];
  secondhandProducts: ProductCard[];
  accessoryProducts: ProductCard[];
  stores: Store[];
};

export type PageResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

export type CartItem = {
  productId: number;
  name: string;
  slug: string;
  price: number;
  image?: string | null;
  quantity: number;
};

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
};

export type Address = {
  id: number;
  label?: string | null;
  recipientName: string;
  phone: string;
  line1: string;
  line2?: string | null;
  city: string;
  defaultAddress: boolean;
};

export type AddressInput = Omit<Address, "id" | "defaultAddress"> & { defaultAddress?: boolean };

export type OrderItem = {
  productId?: number | null;
  productName: string;
  imageUrl?: string | null;
  quantity: number;
  unitPrice: number;
};

export type Order = {
  id: number;
  orderNumber: string;
  customerName: string;
  phone: string;
  email?: string | null;
  address: string;
  note?: string | null;
  status: "PENDING" | "CONFIRMED" | "PROCESSING" | "COMPLETED" | "CANCELLED";
  total: number;
  createdAt?: string;
  items: OrderItem[];
};

export const FALLBACK_SETTINGS: Settings = {
  shopName: "Seanghai Phone Shop",
  tagline: "Top Leading Phone Shop in Cambodia",
  khmerPhone: "012-888-999",
  englishPhone: "098-777-666",
  email: "seanghaiphoneshop@gmail.com",
  telegramUrl: "https://t.me/seanghaiphoneshop",
  telegramChannelUrl: "https://t.me/seanghaiphoneshop",
  facebookUrl: "https://facebook.com/seanghaiphoneshop",
  announcement:
    'Now we have 2 Official Facebook Pages. Please like and follow our pages to get the latest product information: "Seanghai Phone Shop in Cambodia" and "Seanghai Mobile".',
  about:
    "Seanghai Phone Shop specializes in offering a broad selection of products, including smartphones, tablets, and accessories from leading brands such as Apple, Samsung and others more.",
  freeDeliveryNote: "Free delivery for all orders over $140"
};
