import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type {
  LowStockProduct,
  TopCity,
  TopCoupon,
} from "@/features/dashboard/types";
import { formatMoney } from "@/shared/lib/money";

function EmptyList({ message }: { message: string }) {
  return <p className="text-sm text-muted-foreground">{message}</p>;
}

export function LowStockCard({ products }: { products: LowStockProduct[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Low stock</CardTitle>
        <CardDescription>Products at or below 5 units</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {products.length === 0 ? (
          <EmptyList message="No low-stock products right now." />
        ) : (
          products.map((product) => (
            <div key={product.id} className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{product.name}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {product.productType}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {!product.isActive ? (
                  <Badge variant="outline">Inactive</Badge>
                ) : null}
                <Badge variant="secondary">{product.stock}</Badge>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export function TopCitiesCard({ cities }: { cities: TopCity[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top cities</CardTitle>
        <CardDescription>Shipping cities by revenue</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {cities.length === 0 ? (
          <EmptyList message="No city sales in this range." />
        ) : (
          cities.map((city) => (
            <div key={city.city} className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{city.city}</p>
                <p className="text-xs text-muted-foreground">
                  {city.ordersCount.toLocaleString("en-US")} orders
                </p>
              </div>
              <p className="text-sm font-medium">{formatMoney(city.revenue)}</p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export function TopCouponsCard({ coupons }: { coupons: TopCoupon[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top coupons</CardTitle>
        <CardDescription>Codes used on non-cancelled orders</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {coupons.length === 0 ? (
          <EmptyList message="No coupon usage in this range." />
        ) : (
          coupons.map((coupon) => (
            <div key={coupon.code} className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-mono text-sm font-medium">
                  {coupon.code}
                </p>
                <p className="text-xs text-muted-foreground">
                  {coupon.ordersCount.toLocaleString("en-US")} orders ·{" "}
                  {formatMoney(coupon.discountTotal)} off
                </p>
              </div>
              <p className="text-sm font-medium">{formatMoney(coupon.revenue)}</p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
