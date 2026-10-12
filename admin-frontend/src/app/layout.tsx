import { AdminShell } from "@/components/AdminShell";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Seanghai Admin"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
