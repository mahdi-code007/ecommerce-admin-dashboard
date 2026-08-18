"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCategories } from "@/features/categories/queries";
import { useCoupons } from "@/features/coupons/queries";
import { useOrders } from "@/features/orders/queries";
import { useProducts } from "@/features/products/queries";
import { Skeleton } from "@/components/ui/skeleton";

const COUNT_PARAMS = { page: 1, limit: 1 } as const;

export function DashboardPage() {
  const productsQuery = useProducts(COUNT_PARAMS);
  const categoriesQuery = useCategories(COUNT_PARAMS);
  const ordersQuery = useOrders(COUNT_PARAMS);
  const couponsQuery = useCoupons(COUNT_PARAMS);

  const cards = [
    {
      title: "Products",
      href: "/products",
      total: productsQuery.data?.pagination.total,
      isLoading: productsQuery.isLoading,
      isError: productsQuery.isError,
    },
    {
      title: "Categories",
      href: "/categories",
      total: categoriesQuery.data?.pagination.total,
      isLoading: categoriesQuery.isLoading,
      isError: categoriesQuery.isError,
    },
    {
      title: "Orders",
      href: "/orders",
      total: ordersQuery.data?.pagination.total,
      isLoading: ordersQuery.isLoading,
      isError: ordersQuery.isError,
    },
    {
      title: "Coupons",
      href: "/coupons",
      total: couponsQuery.data?.pagination.total,
      isLoading: couponsQuery.isLoading,
      isError: couponsQuery.isError,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Store overview from the current admin APIs. Charts will come later.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.href} href={card.href}>
            <Card className="transition-colors hover:bg-muted/40">
              <CardHeader>
                <CardTitle>{card.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {card.isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : card.isError ? (
                  <p className="text-sm text-destructive">Unavailable</p>
                ) : (
                  <p className="text-3xl font-semibold">{card.total ?? 0}</p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
