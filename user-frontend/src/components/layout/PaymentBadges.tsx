const METHODS = [
  { name: "KHQR", src: "/payments/khqr.png", height: "h-7" },
  { name: "ABA PayWay", src: "/payments/aba-payway.svg", height: "h-[18px]" },
  { name: "ACLEDA Bank", src: "/payments/acleda.png", height: "h-8" },
  { name: "Wing Bank", src: "/payments/wing.png", height: "h-7" },
  { name: "Chip Mong Bank", src: "/payments/chip-mong.png", height: "h-7" }
];

export function PaymentBadges({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-8 gap-y-4 ${className}`}>
      {METHODS.map((method) => (
        <img
          key={method.name}
          src={method.src}
          alt={method.name}
          title={method.name}
          className={`${method.height} w-auto object-contain opacity-55 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0`}
        />
      ))}
    </div>
  );
}
