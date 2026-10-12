import { ProductDetail } from "@/lib/types";

export type SpecRow = { label: string; value: string };
export type SpecSection = { title: string; rows: SpecRow[] };

function pick<T>(id: number, items: T[]): T {
  return items[Math.abs(id) % items.length];
}

function brandKey(product: ProductDetail) {
  return (product.brand?.slug || product.brand?.name || "").toLowerCase();
}

function isPhone(product: ProductDetail) {
  const slug = product.category?.slug || "";
  return slug === "smartphone" || /iphone|galaxy|pixel|nova|reno|redmi|mate|pura|find/i.test(product.name);
}

function platform(product: ProductDetail) {
  const brand = brandKey(product);
  if (brand.includes("apple")) {
    return { os: "iOS 18", chipset: "Apple A18 Pro (3 nm)", cpu: "6-core (2 performance + 4 efficiency)", gpu: "Apple GPU (6-core)" };
  }
  if (brand.includes("samsung")) {
    return { os: "Android 16, One UI 8", chipset: "Snapdragon 8 Elite (3 nm)", cpu: "Octa-core (2x4.32 GHz + 6x3.53 GHz)", gpu: "Adreno 830" };
  }
  if (brand.includes("huawei")) {
    return { os: "HarmonyOS 5 / EMUI 16", chipset: "Kirin 9030S (5 nm)", cpu: "Octa-core (1×2.7 GHz + 3×2.15 GHz + 4×1.62 GHz)", gpu: "Maleoon 935F" };
  }
  if (brand.includes("xiaomi") || brand.includes("redmi")) {
    return { os: "Android 15, HyperOS 2", chipset: "Snapdragon 8s Gen 4 (4 nm)", cpu: "Octa-core (1x3.2 GHz + 7x2.8 GHz)", gpu: "Adreno 735" };
  }
  if (brand.includes("oppo")) {
    return { os: "Android 15, ColorOS 15", chipset: "MediaTek Dimensity 8400", cpu: "Octa-core (1x3.25 GHz + 3x3.0 GHz + 4x2.1 GHz)", gpu: "Mali-G720" };
  }
  if (brand.includes("vivo")) {
    return { os: "Android 15, Funtouch OS 15", chipset: "MediaTek Dimensity 7300", cpu: "Octa-core (4x2.5 GHz + 4x2.0 GHz)", gpu: "Mali-G615" };
  }
  if (brand.includes("google")) {
    return { os: "Android 16", chipset: "Google Tensor G4 (4 nm)", cpu: "Octa-core (1x3.1 GHz + 3x2.6 GHz + 4x1.95 GHz)", gpu: "Mali-G715" };
  }
  return { os: "Android 15", chipset: "Snapdragon 7s Gen 3", cpu: "Octa-core", gpu: "Adreno 710" };
}

function phoneSpecs(product: ProductDetail): SpecSection[] {
  const id = product.id;
  const plat = platform(product);
  const storage = product.storage || "256GB 8GB RAM";
  const display = pick(id, ["6.6 inches, 105.5 cm²", "6.7 inches, 110.2 cm²", "6.3 inches, 98.4 cm²", "6.8 inches, 114.0 cm²"]);
  const resolution = pick(id, ["1256 x 2760 pixels", "1280 x 2800 pixels", "1220 x 2712 pixels", "1440 x 3120 pixels"]);
  const battery = pick(id, ["5000 mAh", "5500 mAh", "6000 mAh", "4700 mAh"]);
  const charge = pick(id, ["66W wired", "80W wired", "45W wired", "25W wired"]);
  const colors = product.color
    ? product.color
    : pick(id, ["Black, White, Blue", "Guava Soda, Orange Soda, Coconut White", "Natural Titanium, Black, White", "Green, Silver, Gold"]);

  return [
    { title: "NETWORK", rows: [{ label: "Technology", value: "GSM / HSPA / LTE / 5G" }] },
    {
      title: "LAUNCH",
      rows: [
        { label: "Announced", value: "2026" },
        { label: "Status", value: product.condition === "SECONDHAND" ? "Available (secondhand)" : "Available. Released 2026" }
      ]
    },
    {
      title: "BODY",
      rows: [
        { label: "Dimensions", value: pick(id, ["157.8 x 74.5 x 8.2 mm", "163.4 x 78.1 x 8.1 mm", "147.6 x 70.6 x 8.3 mm"]) },
        { label: "Weight", value: pick(id, ["187 g", "206 g", "199 g", "166 g"]) },
        { label: "Build", value: "Glass front, aluminum frame, glass back" },
        { label: "SIM", value: "Nano-SIM + Nano-SIM + eSIM" }
      ]
    },
    {
      title: "DISPLAY",
      rows: [
        { label: "Type", value: pick(id, ["LTPO OLED, 120Hz, HDR", "AMOLED, 120Hz, HDR10+", "Super Retina XDR OLED, 120Hz"]) },
        { label: "Size", value: display },
        { label: "Resolution", value: resolution },
        { label: "Protection", value: pick(id, ["Kunlun Glass 2", "Gorilla Glass Victus 2", "Ceramic Shield"]) }
      ]
    },
    {
      title: "PLATFORM",
      rows: [
        { label: "OS", value: plat.os },
        { label: "Chipset", value: plat.chipset },
        { label: "CPU", value: plat.cpu },
        { label: "GPU", value: plat.gpu }
      ]
    },
    {
      title: "MEMORY",
      rows: [
        { label: "Card slot", value: "No" },
        { label: "Internal", value: storage }
      ]
    },
    {
      title: "MAIN CAMERA",
      rows: [
        { label: "Triple", value: "50 MP (wide) + 50 MP (telephoto) + 12 MP (ultrawide), AF, OIS" },
        { label: "Features", value: "LED flash, panorama, HDR, PDAF" },
        { label: "Video", value: "4K@30/60fps, 1080p@30/60/120fps, gyro-EIS, OIS" }
      ]
    },
    {
      title: "SELFIE CAMERA",
      rows: [
        { label: "Single", value: "12 MP, f/2.2, (wide), AF" },
        { label: "Features", value: "HDR, panorama" },
        { label: "Video", value: "4K@30fps, 1080p@30fps, gyro-EIS" }
      ]
    },
    {
      title: "SOUND",
      rows: [
        { label: "Loudspeaker", value: "Yes, with stereo speakers" },
        { label: "3.5mm jack", value: "No" }
      ]
    },
    {
      title: "COMMS",
      rows: [
        { label: "WLAN", value: "Wi-Fi 802.11 a/b/g/n/ac/6/7, dual-band" },
        { label: "Bluetooth", value: "5.3, A2DP, LE" },
        { label: "Positioning", value: "GPS, GLONASS, GALILEO, BDS" },
        { label: "NFC", value: "Yes" },
        { label: "Infrared port", value: brandKey(product).includes("apple") ? "No" : "Yes" },
        { label: "Radio", value: "No" },
        { label: "USB", value: brandKey(product).includes("apple") ? "USB Type-C 3.2, MagSafe" : "USB Type-C" }
      ]
    },
    {
      title: "FEATURES",
      rows: [{ label: "Sensors", value: "Fingerprint (under display), accelerometer, gyro, proximity, compass" }]
    },
    {
      title: "BATTERY",
      rows: [
        { label: "Type", value: `${battery}` },
        { label: "Charging", value: `${charge}, 15W wireless, reverse wired` }
      ]
    },
    {
      title: "MISC",
      rows: [
        { label: "Colors", value: colors },
        { label: "Models", value: product.sku || product.slug.toUpperCase() },
        { label: "Price", value: `About $${Number(product.price).toFixed(0)}` }
      ]
    }
  ];
}

function tabletSpecs(product: ProductDetail): SpecSection[] {
  return [
    { title: "NETWORK", rows: [{ label: "Technology", value: "GSM / HSPA / LTE / 5G / Wi-Fi" }] },
    { title: "DISPLAY", rows: [{ label: "Type", value: "IPS LCD / OLED, 120Hz" }, { label: "Size", value: "11.2 inches" }, { label: "Resolution", value: "2560 x 1600 pixels" }] },
    { title: "PLATFORM", rows: Object.entries(platform(product)).map(([label, value]) => ({ label: label.toUpperCase(), value })) },
    { title: "MEMORY", rows: [{ label: "Internal", value: product.storage || "256GB" }] },
    { title: "BATTERY", rows: [{ label: "Type", value: "8000 mAh" }, { label: "Charging", value: "33W wired" }] },
    { title: "MISC", rows: [{ label: "Colors", value: product.color || "Gray, Silver" }, { label: "Price", value: `About $${Number(product.price).toFixed(0)}` }] }
  ];
}

function watchSpecs(product: ProductDetail): SpecSection[] {
  return [
    { title: "DISPLAY", rows: [{ label: "Type", value: "LTPO OLED, always-on" }, { label: "Size", value: "1.9 inches" }, { label: "Protection", value: "Ion-X glass" }] },
    { title: "BODY", rows: [{ label: "Build", value: "Aluminum / stainless steel, water resistant" }, { label: "Strap", value: "Sport / Milanese loop" }] },
    { title: "FEATURES", rows: [{ label: "Sensors", value: "Heart rate, ECG, GPS, accelerometer, gyro, compass" }] },
    { title: "BATTERY", rows: [{ label: "Type", value: "Li-Ion" }, { label: "Charging", value: "Magnetic charging, up to 36 hours" }] },
    { title: "MISC", rows: [{ label: "Colors", value: product.color || "Black, Silver, Gold" }, { label: "Price", value: `About $${Number(product.price).toFixed(0)}` }] }
  ];
}

function computerSpecs(product: ProductDetail): SpecSection[] {
  const plat = platform(product);
  return [
    { title: "PLATFORM", rows: [{ label: "OS", value: brandKey(product).includes("apple") ? "macOS Sequoia" : "Windows 11" }, { label: "Chipset", value: plat.chipset }, { label: "CPU", value: plat.cpu }, { label: "GPU", value: plat.gpu }] },
    { title: "MEMORY", rows: [{ label: "Internal", value: product.storage || "512GB SSD + 16GB RAM" }] },
    { title: "DISPLAY", rows: [{ label: "Type", value: "Liquid Retina / IPS" }, { label: "Size", value: "13.6 – 15 inches" }] },
    { title: "BATTERY", rows: [{ label: "Type", value: "Up to 18 hours" }, { label: "Charging", value: "USB-C / MagSafe" }] },
    { title: "MISC", rows: [{ label: "Colors", value: product.color || "Silver, Space Gray, Midnight" }, { label: "Price", value: `About $${Number(product.price).toFixed(0)}` }] }
  ];
}

function accessorySpecs(product: ProductDetail): SpecSection[] {
  const rows: SpecRow[] = [
    { label: "Type", value: product.category?.name || "Accessory" },
    { label: "Brand", value: product.brand?.name || "—" },
    { label: "Color", value: product.color || "As shown" }
  ];
  if (product.storage) rows.push({ label: "Capacity", value: product.storage });
  if (product.warranty) rows.push({ label: "Warranty", value: product.warranty });
  rows.push({ label: "Price", value: `About $${Number(product.price).toFixed(0)}` });
  return [{ title: "DETAILS", rows }];
}

export function buildProductSpecs(product: ProductDetail): SpecSection[] {
  const slug = product.category?.slug || "";
  if (isPhone(product)) return phoneSpecs(product);
  if (slug === "tablet") return tabletSpecs(product);
  if (slug === "watch") return watchSpecs(product);
  if (slug === "computer") return computerSpecs(product);
  return accessorySpecs(product);
}

export function cashBack(product: ProductDetail) {
  if (!product.compareAtPrice || product.compareAtPrice <= product.price) return 0;
  return Math.round(Number(product.compareAtPrice) - Number(product.price));
}

export function showPhonePerks(product: ProductDetail) {
  const slug = product.category?.slug || "";
  return product.condition === "NEW" && (slug === "smartphone" || slug === "tablet") && Number(product.price) >= 80;
}

export function digitsOnly(value?: string | null) {
  return (value || "").replace(/\D/g, "");
}
