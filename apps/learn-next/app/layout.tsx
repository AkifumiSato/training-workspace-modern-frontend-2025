import type { Metadata } from "next";

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
