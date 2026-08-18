"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PageSpinner } from "@/components/auth/page-spinner";
import { useAuth } from "@/lib/auth/auth-context";

export function GuestGuard({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/products");
    }
  }, [router, status]);

  if (status !== "unauthenticated") {
    return <PageSpinner />;
  }

  return children;
}
