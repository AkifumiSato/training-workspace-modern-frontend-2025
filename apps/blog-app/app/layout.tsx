import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hello World",
  description: "Simple Hello World App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}

// Cacheは全てOpt Out
export const dynamic = "force-dynamic";
