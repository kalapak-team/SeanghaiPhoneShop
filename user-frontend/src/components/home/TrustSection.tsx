import { Headphones, ShieldCheck, Truck } from "lucide-react";

const items = [
  { icon: Headphones, title: "24/7 CUSTOMER SERVICE", text: "Friendly 24/7 customer support" },
  { icon: ShieldCheck, title: "TRUSTED PHONE SHOP", text: "More than 10 years in business" },
  { icon: Truck, title: "FREE AND FAST DELIVERY", text: "Free delivery for all orders over $140" }
];

export function TrustSection() {
  return (
    <section className="bg-apple-gray">
      <div className="container-xl grid gap-10 py-16 md:grid-cols-3">
        {items.map((item) => (
          <div key={item.title} className="text-center transition duration-300 hover:-translate-y-1">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-navy text-white transition hover:scale-110">
              <item.icon size={22} />
            </div>
            <h3 className="text-lg font-semibold tracking-wide text-navy">{item.title}</h3>
            <p className="mt-1 text-sm text-apple-muted">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
