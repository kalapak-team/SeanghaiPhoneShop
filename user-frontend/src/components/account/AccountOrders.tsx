"use client";

import { SectionHeader } from "@/components/account/ui";
import { api } from "@/lib/api";
import { cn, formatPrice } from "@/lib/format";
import type { Order } from "@/lib/types";
import { Check, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const STEPS = ["PENDING", "CONFIRMED", "PROCESSING", "COMPLETED"] as const;
const STEP_LABEL: Record<string, string> = {
  PENDING: "Placed",
  CONFIRMED: "Confirmed",
  PROCESSING: "Preparing",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled"
};

function formatDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function StatusBadge({ status }: { status: Order["status"] }) {
  const tone =
    status === "COMPLETED"
      ? "bg-emerald-50 text-emerald-700"
      : status === "CANCELLED"
        ? "bg-rose-50 text-rose-600"
        : status === "PENDING"
          ? "bg-apple-gray text-navy"
          : "bg-gold/10 text-gold";
  return <span className={`rounded-full px-2.5 py-1 text-[12px] font-medium ${tone}`}>{STEP_LABEL[status] || status}</span>;
}

function Tracker({ status }: { status: Order["status"] }) {
  if (status === "CANCELLED") {
    return <p className="text-[14px] text-rose-600">This order was cancelled.</p>;
  }
  const current = STEPS.indexOf(status as (typeof STEPS)[number]);
  return (
    <ol className="grid grid-cols-4 gap-2">
      {STEPS.map((step, i) => {
        const done = i <= current;
        return (
          <li key={step} className="flex flex-col gap-2">
            <span className={cn("h-1 rounded-full", done ? "bg-gold" : "bg-black/10")} />
            <span className={cn("flex items-center gap-1 text-[12px]", done ? "font-medium text-navy" : "text-apple-muted")}>
              {done && <Check size={12} className="text-gold" />}
              {STEP_LABEL[step]}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function OrderRow({ order }: { order: Order }) {
  const [open, setOpen] = useState(false);
  const items = order.items || [];
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <li className="py-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex -space-x-3">
            {items.slice(0, 3).map((item, i) => (
              <div key={i} className="h-14 w-14 overflow-hidden rounded-xl bg-apple-gray ring-2 ring-white">
                {item.imageUrl && <img src={item.imageUrl} alt="" className="h-full w-full object-contain p-1" />}
              </div>
            ))}
          </div>
          <div>
            <p className="text-[15px] font-medium text-navy">Order {order.orderNumber}</p>
            <p className="mt-0.5 text-[13px] text-apple-muted">
              {formatDate(order.createdAt)} · {count} item{count === 1 ? "" : "s"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <StatusBadge status={order.status} />
          <p className="text-[15px] font-medium text-navy">{formatPrice(order.total)}</p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="mt-4 inline-flex items-center gap-1 text-[14px] font-medium text-gold hover:underline"
      >
        {open ? "Hide details" : "View details"}
        <ChevronDown size={15} className={cn("transition", open && "rotate-180")} />
      </button>

      {open && (
        <div className="mt-5 space-y-6 rounded-2xl bg-apple-gray p-5 md:p-6">
          <Tracker status={order.status} />
          <ul className="divide-y divide-black/10">
            {items.map((item, i) => (
              <li key={i} className="flex items-center gap-4 py-3">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white">
                  {item.imageUrl && <img src={item.imageUrl} alt="" className="h-full w-full object-contain p-1.5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] text-navy">{item.productName}</p>
                  <p className="text-[13px] text-apple-muted">Qty {item.quantity}</p>
                </div>
                <p className="text-[14px] text-navy">{formatPrice(item.unitPrice * item.quantity)}</p>
              </li>
            ))}
          </ul>
          <div className="grid gap-6 border-t border-black/10 pt-5 text-[14px] sm:grid-cols-2">
            <div>
              <p className="text-[12px] font-medium text-apple-muted">Delivery to</p>
              <p className="mt-1 text-navy">{order.customerName}</p>
              <p className="text-navy/80">{order.address}</p>
              <p className="text-navy/80">{order.phone}</p>
            </div>
            <div className="sm:text-right">
              <p className="text-[12px] font-medium text-apple-muted">Total</p>
              <p className="mt-1 text-[20px] font-semibold text-navy">{formatPrice(order.total)}</p>
              {order.note && <p className="mt-2 text-[13px] text-apple-muted">Note: {order.note}</p>}
            </div>
          </div>
          <Link href="/contact" className="inline-block text-[14px] font-medium text-gold hover:underline">
            Get help with this order ›
          </Link>
        </div>
      )}
    </li>
  );
}

export function AccountOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .myOrders()
      .then((data) => setOrders(data as Order[]))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section>
      <SectionHeader title="Your orders" description="Track deliveries and review past purchases." />
      {loading && <p className="mt-8 text-[15px] text-apple-muted">Loading…</p>}
      {!loading && orders.length === 0 && (
        <div className="mt-8 rounded-2xl bg-apple-gray px-6 py-12 text-center">
          <p className="text-[17px] font-medium text-navy">You have no orders yet.</p>
          <p className="mx-auto mt-2 max-w-sm text-[14px] leading-relaxed text-apple-muted">
            When you place an order, you can follow it here from confirmed to delivered.
          </p>
          <Link href="/products" className="mt-6 inline-flex h-11 items-center rounded-full bg-gold px-6 text-sm font-medium text-white hover:bg-gold-dark">
            Start shopping
          </Link>
        </div>
      )}
      {!loading && orders.length > 0 && (
        <ul className="mt-6 divide-y divide-black/10 border-y border-black/10">
          {orders.map((order) => (
            <OrderRow key={order.id} order={order} />
          ))}
        </ul>
      )}
    </section>
  );
}
