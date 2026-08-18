"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PageSpinner } from "@/features/auth/page-spinner";
import { useAuth } from "@/features/auth/context";

export default function HomePage() {
  const { status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }

    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [router, status]);

  return <PageSpinner />;
}
