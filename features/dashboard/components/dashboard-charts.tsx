"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type {
  SeriesPoint,
  StatsOverview,
  StatusBreakdownItem,
  TopProduct,
} from "@/features/dashboard/types";
import { formatMoney } from "@/shared/lib/money";

const revenueChartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--foreground)",
  },
} satisfies ChartConfig;

const statusChartConfig = {
  count: {
    label: "Orders",
  },
  pending: {
    label: "Pending",
    color: "#d97706",
  },
  confirmed: {
    label: "Confirmed",
    color: "#2563eb",
  },
  shipped: {
    label: "Shipped",
    color: "#0284c7",
  },
  delivered: {
    label: "Delivered",
    color: "#059669",
  },
  cancelled: {
    label: "Cancelled",
    color: "#dc2626",
  },
} satisfies ChartConfig;

const topProductsChartConfig = {
  revenue: {
    label: "Revenue",
    color: "var(--foreground)",
  },
} satisfies ChartConfig;

function formatSeriesDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatMoneyTick(value: number) {
  return formatMoney(value);
}

function ChartEmptyState({ message }: { message: string }) {
  return (
    <div className="flex h-[240px] items-center justify-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}

export function RevenueChart({
  points,
  granularity,
}: {
  points: SeriesPoint[];
  granularity: StatsOverview["granularity"];
}) {
  const hasRevenue = points.some((point) => point.revenue > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue</CardTitle>
        <CardDescription>
          {granularity === "week" ? "Weekly totals" : "Daily totals"}, excluding
          cancelled orders
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasRevenue ? (
          <ChartContainer
            config={revenueChartConfig}
            className="aspect-auto h-[240px] w-full"
          >
            <AreaChart accessibilityLayer data={points}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={24}
                tickFormatter={formatSeriesDate}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      typeof value === "string"
                        ? formatSeriesDate(value)
                        : String(value ?? "")
                    }
                    formatter={(value) => (
                      <div className="flex w-full items-center justify-between gap-4">
                        <span className="text-muted-foreground">Revenue</span>
                        <span className="font-mono font-medium tabular-nums">
                          {formatMoneyTick(Number(value))}
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <Area
                dataKey="revenue"
                type="monotone"
                fill="var(--color-revenue)"
                fillOpacity={0.12}
                stroke="var(--color-revenue)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <ChartEmptyState message="No revenue in this range." />
        )}
      </CardContent>
    </Card>
  );
}

export function StatusBreakdownChart({
  statusBreakdown,
}: {
  statusBreakdown: StatusBreakdownItem[];
}) {
  const chartData = statusBreakdown.map((item) => ({
    ...item,
    fill: `var(--color-${item.status})`,
  }));
  const hasOrders = statusBreakdown.some((item) => item.count > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order status</CardTitle>
        <CardDescription>Includes cancelled orders in this range</CardDescription>
      </CardHeader>
      <CardContent>
        {hasOrders ? (
          <ChartContainer
            config={statusChartConfig}
            className="mx-auto aspect-square h-[240px] w-full"
          >
            <PieChart>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    nameKey="status"
                    formatter={(value) => (
                      <div className="flex w-full items-center justify-between gap-4">
                        <span className="text-muted-foreground">Orders</span>
                        <span className="font-mono font-medium tabular-nums">
                          {Number(value).toLocaleString("en-US")}
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="status"
                innerRadius={58}
                strokeWidth={4}
              />
              <ChartLegend
                content={<ChartLegendContent nameKey="status" className="flex-wrap" />}
              />
            </PieChart>
          </ChartContainer>
        ) : (
          <ChartEmptyState message="No orders in this range." />
        )}
      </CardContent>
    </Card>
  );
}

export function TopProductsChart({ products }: { products: TopProduct[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top products</CardTitle>
        <CardDescription>Revenue from non-cancelled orders</CardDescription>
      </CardHeader>
      <CardContent>
        {products.length > 0 ? (
          <ChartContainer
            config={topProductsChartConfig}
            className="aspect-auto h-[240px] w-full"
          >
            <BarChart accessibilityLayer data={products} layout="vertical">
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="productName"
                type="category"
                tickLine={false}
                axisLine={false}
                width={96}
                tickFormatter={(value: string) =>
                  value.length > 14 ? `${value.slice(0, 14)}…` : value
                }
              />
              <XAxis type="number" hide />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => (
                      <div className="flex w-full items-center justify-between gap-4">
                        <span className="text-muted-foreground">Revenue</span>
                        <span className="font-mono font-medium tabular-nums">
                          {formatMoneyTick(Number(value))}
                        </span>
                      </div>
                    )}
                  />
                }
              />
              <Bar
                dataKey="revenue"
                fill="var(--color-revenue)"
                radius={4}
              />
            </BarChart>
          </ChartContainer>
        ) : (
          <ChartEmptyState message="No product sales in this range." />
        )}
      </CardContent>
    </Card>
  );
}
