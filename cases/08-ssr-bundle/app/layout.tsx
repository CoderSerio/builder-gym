import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "08 SSR Bundle - Turbopack",
  description: "SSR-friendly bundle with Turbopack",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
