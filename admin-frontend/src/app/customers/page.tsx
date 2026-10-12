"use client";

import { Empty, PageHeader, Panel } from "@/components/ui";
import { adminRequest } from "@/lib/api";
import { useEffect, useState } from "react";

type User = { id: number; name: string; email: string; phone?: string };

export default function CustomersPage() {
  const [items, setItems] = useState<User[]>([]);
  useEffect(() => {
    adminRequest<User[]>("/admin/customers").then(setItems).catch(() => setItems([]));
  }, []);

  return (
    <div>
      <PageHeader title="Customers" description={`${items.length} registered accounts`} />
      <Panel>
        {!items.length ? (
          <Empty>No customers yet.</Empty>
        ) : (
          <table className="w-full text-left text-[14px]">
            <thead className="text-[12px] text-apple-muted">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Phone</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-t border-black/5">
                  <td className="px-5 py-3.5 font-medium">{item.name}</td>
                  <td className="px-5 py-3.5 text-navy/70">{item.email}</td>
                  <td className="px-5 py-3.5 text-navy/70">{item.phone || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>
    </div>
  );
}
