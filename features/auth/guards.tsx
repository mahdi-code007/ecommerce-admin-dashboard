"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PageSpinner } from "@/features/auth/page-spinner";
import { useAuth } from "@/features/auth/context";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [router, status]);

  if (status !== "authenticated") {
    return <PageSpinner />;
  }

  return children;
}

export function GuestGuard({ children }: { children: React.ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [router, status]);

  if (status !== "unauthenticated") {
    return <PageSpinner />;
  }

  return children;
}
