import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OncoQuery Assistant",
  description: "AI-powered genomic variant interpretation for oncology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

