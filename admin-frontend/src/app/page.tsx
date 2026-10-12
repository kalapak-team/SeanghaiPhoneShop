"use client";

import { Empty, Panel, StatusBadge } from "@/components/ui";
import { adminRequest } from "@/lib/api";
import { cn, formatPrice } from "@/lib/format";
import { Activity, CreditCard, DollarSign, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Dashboard = {
  products: number;
  orders: number;
  customers: number;
  revenue: number;
  recentOrders: Array<{
    id: number;
    orderNumber: string;
    customerName: string;
    email?: string;
    total: number;
    status: string;
  }>;
};

type OrderRow = { id: number; total: number; status: string; createdAt?: string; customerName?: string };

const TABS = ["Overview", "Analytics", "Reports", "Notifications"] as const;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("");
}

function paid(order: { status: string }) {
  return order.status !== "CANCELLED";
}

function inMonth(iso: string | undefined, year: number, month: number) {
  if (!iso) return false;
  const d = new Date(iso);
  return d.getFullYear() === year && d.getMonth() === month;
}

function delta(current: number, previous: number) {
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / previous) * 100;
}

function formatDelta(value: number) {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

function niceMax(n: number) {
  if (n <= 0) return 6000;
  const mag = Math.pow(10, Math.floor(Math.log10(n)));
  return Math.ceil(n / mag) * mag;
}

function yTicks(max: number) {
  return [0, 0.25, 0.5, 0.75, 1].map((p) => Math.round(max * p));
}

function formatAxis(n: number) {
  if (n >= 1000) return `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return `$${n}`;
}

export default function DashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [tab, setTab] = useState<(typeof TABS)[number]>("Overview");

  useEffect(() => {
    adminRequest<Dashboard>("/admin/dashboard").then(setData).catch(() => setData(null));
    adminRequest<OrderRow[]>("/admin/orders").then(setOrders).catch(() => setOrders([]));
  }, []);

  const year = new Date().getFullYear();
  const thisMonth = new Date().getMonth();
  const lastMonthDate = new Date(year, thisMonth - 1, 1);

  const stats = useMemo(() => {
    const live = orders.filter(paid);
    const rev = (list: OrderRow[]) => list.reduce((s, o) => s + Number(o.total || 0), 0);
    const thisM = live.filter((o) => inMonth(o.createdAt, year, thisMonth));
    const lastM = live.filter((o) => inMonth(o.createdAt, lastMonthDate.getFullYear(), lastMonthDate.getMonth()));
    const monthValues = MONTHS.map((_, m) => rev(live.filter((o) => inMonth(o.createdAt, year, m))));
    const max = niceMax(Math.max(...monthValues, 0));
    return {
      monthValues,
      max,
      ticks: yTicks(max),
      revenueDelta: delta(rev(thisM), rev(lastM)),
      ordersDelta: delta(thisM.length, lastM.length),
      salesThisMonth: thisM.length
    };
  }, [orders, year, thisMonth, lastMonthDate]);

  const cards = [
    {
      label: "Total Revenue",
      value: formatPrice(data?.revenue ?? 0),
      trend: formatDelta(stats.revenueDelta),
      trendUp: stats.revenueDelta >= 0,
      note: "from last month",
      icon: DollarSign
    },
    {
      label: "Orders",
      value: `+${(data?.orders ?? 0).toLocaleString()}`,
      trend: formatDelta(stats.ordersDelta),
      trendUp: stats.ordersDelta >= 0,
      note: "from last month",
      icon: Users
    },
    {
      label: "Sales",
      value: `+${stats.salesThisMonth.toLocaleString()}`,
      trend: formatDelta(stats.ordersDelta),
      trendUp: stats.ordersDelta >= 0,
      note: "from last month",
      icon: CreditCard
    },
    {
      label: "Products",
      value: `+${(data?.products ?? 0).toLocaleString()}`,
      trend: "In catalog",
      trendUp: true,
      note: "",
      icon: Activity
    }
  ];

  const download = () => {
    const rows = [
      ["Order", "Customer", "Total", "Status"],
      ...(data?.recentOrders || []).map((o) => [o.orderNumber, o.customerName, String(o.total), o.status])
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "seanghai-recent-orders.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-[24px] font-bold tracking-tight text-navy md:text-[28px]">Dashboard</h1>
        <button
          type="button"
          onClick={download}
          className="inline-flex h-9 items-center rounded-md bg-navy px-4 text-[13px] font-medium text-white hover:bg-navy/90"
        >
          Download
        </button>
      </div>

      <div className="mt-4 inline-flex rounded-lg bg-[#f4f4f5] p-1">
        {TABS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={cn(
              "rounded-md px-3 py-1.5 text-[13px] transition",
              tab === item ? "bg-white font-medium text-navy shadow-sm" : "text-apple-muted hover:text-navy"
            )}
          >
            {item}
          </button>
        ))}
      </div>

      {tab === "Overview" && (
        <>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {cards.map((card) => (
              <div key={card.label} className="rounded-xl border border-black/[0.08] bg-white p-6">
                <div className="flex items-center justify-between">
                  <p className="text-[14px] font-medium text-navy">{card.label}</p>
                  <card.icon size={16} className="text-apple-muted" />
                </div>
                <p className="mt-2 text-[28px] font-bold tracking-tight text-navy">{card.value}</p>
                <p className={cn("mt-1 text-[12px]", card.note ? (card.trendUp ? "text-emerald-600" : "text-rose-600") : "text-apple-muted")}>
                  {card.trend}
                  {card.note ? ` ${card.note}` : ""}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,1fr)]">
            <div className="rounded-xl border border-black/[0.08] bg-white p-6">
              <h2 className="text-[16px] font-semibold text-navy">Overview</h2>
              <div className="mt-6 flex h-[260px] gap-3">
                <div className="flex h-[220px] flex-col justify-between py-0 text-right text-[11px] text-apple-muted">
                  {[...stats.ticks].reverse().map((t) => (
                    <span key={t}>{formatAxis(t)}</span>
                  ))}
                </div>
                <div className="relative min-w-0 flex-1">
                  <div className="absolute inset-x-0 top-0 h-[220px]">
                    {stats.ticks.map((t, i) => (
                      <div
                        key={t}
                        className="absolute inset-x-0 border-t border-black/[0.06]"
                        style={{ top: `${(i / (stats.ticks.length - 1)) * 100}%` }}
                      />
                    ))}
                  </div>
                  <div className="relative flex h-[220px] items-end justify-between gap-1.5 px-1">
                    {stats.monthValues.map((value, i) => (
                      <div key={MONTHS[i]} className="flex h-full flex-1 flex-col items-center justify-end">
                        <div
                          className="w-full max-w-[36px] rounded-t-[2px] bg-navy"
                          style={{ height: `${Math.max(value > 0 ? 6 : 0, (value / stats.max) * 100)}%` }}
                          title={`${MONTHS[i]} ${year}: ${formatPrice(value)}`}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex justify-between px-1 text-[11px] text-apple-muted">
                    {MONTHS.map((m) => (
                      <span key={m} className="flex-1 text-center">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-black/[0.08] bg-white p-6">
              <h2 className="text-[16px] font-semibold text-navy">Recent Sales</h2>
              <p className="mt-1 text-[13px] text-apple-muted">
                You made {stats.salesThisMonth} sale{stats.salesThisMonth === 1 ? "" : "s"} this month.
              </p>
              {!data?.recentOrders?.length ? (
                <Empty>No sales yet.</Empty>
              ) : (
                <ul className="mt-6 space-y-6">
                  {data.recentOrders.map((order) => (
                    <li key={order.id} className="flex items-center gap-4">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f4f4f5] text-[11px] font-semibold text-navy">
                        {initials(order.customerName)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-medium leading-none text-navy">{order.customerName}</p>
                        <p className="mt-1 truncate text-[13px] text-apple-muted">{order.email || order.orderNumber}</p>
                      </div>
                      <p className="text-[14px] font-medium text-navy">+{formatPrice(order.total)}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}

      {tab === "Analytics" && (
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-black/[0.08] p-6">
            <p className="text-[13px] text-apple-muted">Avg. order value</p>
            <p className="mt-2 text-[24px] font-bold">{formatPrice(data?.orders ? Number(data.revenue) / data.orders : 0)}</p>
          </div>
          <div className="rounded-xl border border-black/[0.08] p-6">
            <p className="text-[13px] text-apple-muted">Completed orders</p>
            <p className="mt-2 text-[24px] font-bold">{orders.filter((o) => o.status === "COMPLETED").length}</p>
          </div>
          <div className="rounded-xl border border-black/[0.08] p-6">
            <p className="text-[13px] text-apple-muted">Catalog</p>
            <p className="mt-2 text-[24px] font-bold">{(data?.products ?? 0).toLocaleString()} products</p>
          </div>
        </div>
      )}

      {tab === "Reports" && (
        <Panel className="mt-4 rounded-xl border border-black/[0.08]">
          {!data?.recentOrders?.length ? (
            <Empty>No orders to report.</Empty>
          ) : (
            <table className="w-full text-left text-[14px]">
              <thead className="text-[12px] text-apple-muted">
                <tr>
                  <th className="px-5 py-3 font-medium">Order</th>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Total</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recentOrders.map((order) => (
                  <tr key={order.id} className="border-t border-black/5">
                    <td className="px-5 py-3 font-medium">{order.orderNumber}</td>
                    <td className="px-5 py-3">{order.customerName}</td>
                    <td className="px-5 py-3">{formatPrice(order.total)}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Panel>
      )}

      {tab === "Notifications" && (
        <div className="mt-4 rounded-xl border border-black/[0.08] px-6 py-16 text-center">
          <p className="text-[15px] font-medium text-navy">You&apos;re all caught up</p>
          <p className="mt-1 text-[13px] text-apple-muted">New orders and low-stock alerts will show here.</p>
        </div>
      )}
    </div>
  );
}
