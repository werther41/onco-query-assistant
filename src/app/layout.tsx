import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={`${inter.className} antialiased`}>
        <div className="flex min-h-screen">
          <Navigation />
          <main className="flex-1 pl-nav min-w-0">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
