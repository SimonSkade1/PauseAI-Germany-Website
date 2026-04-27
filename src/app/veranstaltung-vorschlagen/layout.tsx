"use client";

import { ConvexClientProvider } from "@/app/ConvexClientProvider";

export default function EventSuggestLayout({ children }: { children: React.ReactNode }) {
  return <ConvexClientProvider>{children}</ConvexClientProvider>;
}
