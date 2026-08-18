import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { OverviewKpis } from "@/features/dashboard/types";
import { formatMoney } from "@/shared/lib/money";

type DashboardKpiCardsProps = {
  kpis: OverviewKpis;
};

const cards = [
  {
    key: "revenue",
    title: "Revenue",
    href: "/orders",
    description: "Excluding cancelled orders",
    value: (kpis: OverviewKpis) => formatMoney(kpis.revenue),
  },
  {
    key: "orders",
    title: "Orders",
    href: "/orders",
    description: (kpis: OverviewKpis) =>
      `${kpis.cancelledOrdersCount} cancelled in range`,
    value: (kpis: OverviewKpis) => kpis.ordersCount.toLocaleString("en-US"),
  },
  {
    key: "aov",
    title: "Average order",
    href: "/orders",
    description: "Excluding cancelled orders",
    value: (kpis: OverviewKpis) => formatMoney(kpis.averageOrderValue),
  },
  {
    key: "pending",
    title: "Pending queue",
    href: "/orders",
    description: "Current orders waiting to move",
    value: (kpis: OverviewKpis) =>
      kpis.pendingOrdersCount.toLocaleString("en-US"),
  },
  {
    key: "products",
    title: "Products",
    href: "/products",
    description: (kpis: OverviewKpis) =>
      `${kpis.inactiveProductsCount} inactive`,
    value: (kpis: OverviewKpis) => kpis.productsCount.toLocaleString("en-US"),
  },
  {
    key: "lowStock",
    title: "Low stock",
    href: "/products",
    description: "At or below 5 units",
    value: (kpis: OverviewKpis) => kpis.lowStockCount.toLocaleString("en-US"),
  },
] as const;

export function DashboardKpiCards({ kpis }: DashboardKpiCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <Link key={card.key} href={card.href}>
          <Card className="transition-colors hover:bg-muted/40">
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
              <CardDescription>
                {typeof card.description === "function"
                  ? card.description(kpis)
                  : card.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{card.value(kpis)}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
