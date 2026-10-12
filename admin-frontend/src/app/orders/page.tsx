"use client";

import { Empty, PageHeader, Panel, StatusBadge } from "@/components/ui";
import { adminRequest } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { useEffect, useState } from "react";

type Order = { id: number; orderNumber: string; customerName: string; phone: string; total: number; status: string };

const STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "COMPLETED", "CANCELLED"];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const load = () => adminRequest<Order[]>("/admin/orders").then(setOrders).catch(() => setOrders([]));

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <PageHeader title="Orders" description="Track and update fulfillment." />
      <Panel>
        {!orders.length ? (
          <Empty>No orders yet.</Empty>
        ) : (
          <table className="w-full text-left text-[14px]">
            <thead className="text-[12px] text-apple-muted">
              <tr>
                <th className="px-5 py-3 font-medium">Order</th>
                <th className="px-5 py-3 font-medium">Customer</th>
                <th className="px-5 py-3 font-medium">Phone</th>
                <th className="px-5 py-3 font-medium">Total</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-black/5">
                  <td className="px-5 py-3.5 font-medium">{order.orderNumber}</td>
                  <td className="px-5 py-3.5">{order.customerName}</td>
                  <td className="px-5 py-3.5 text-navy/70">{order.phone}</td>
                  <td className="px-5 py-3.5">{formatPrice(order.total)}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <StatusBadge status={order.status} />
                      <select
                        value={order.status}
                        className="rounded-lg border border-black/10 bg-white px-2 py-1 text-[12px] outline-none focus:border-gold"
                        onChange={async (e) => {
                          await adminRequest(`/admin/orders/${order.id}/status`, {
                            method: "PATCH",
                            body: JSON.stringify({ status: e.target.value })
                          });
                          load();
                        }}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s.charAt(0) + s.slice(1).toLowerCase()}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Panel>
    </div>
  );
}
