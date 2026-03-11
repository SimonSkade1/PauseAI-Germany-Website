"use client";

import { ConvexClientProvider } from "@/app/ConvexClientProvider";

export default function ActionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ConvexClientProvider>{children}</ConvexClientProvider>;
}
