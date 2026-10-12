"use client";

import { usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";

export function PageEnter({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div key={pathname} className="animate-fade-up">
      {children}
    </div>
  );
}
