"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dna, BarChart2, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", icon: BarChart2, label: "Query" },
  { href: "/infographic", icon: Dna, label: "Infographic" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed left-0 top-0 h-full w-nav bg-nav-bg flex flex-col items-center py-4 z-50">
      {/* Logo mark */}
      <Link
        href="/"
        className="mb-6 flex items-center justify-center w-9 h-9 rounded-lg bg-primary hover:opacity-90 transition-opacity"
        title="OncoQuery"
      >
        <Dna className="w-5 h-5 text-white" />
      </Link>

      {/* Nav items */}
      <div className="flex flex-col gap-1 flex-1 w-full px-1.5">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive =
            href === "/"
              ? pathname === "/" || pathname.startsWith("/report")
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              title={label}
              className={cn(
                "flex items-center justify-center h-9 w-full rounded-md transition-colors",
                isActive
                  ? "bg-white/10 text-white"
                  : "text-nav-icon hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="w-5 h-5" />
            </Link>
          );
        })}
      </div>

      {/* Bottom: settings + user */}
      <div className="flex flex-col gap-1 w-full px-1.5">
        <button
          title="Settings"
          className="flex items-center justify-center h-9 w-full rounded-md text-nav-icon hover:bg-white/5 hover:text-white transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
        <button
          title="Profile"
          className="flex items-center justify-center h-9 w-full rounded-md transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
            <User className="w-4 h-4 text-nav-icon" />
          </div>
        </button>
      </div>
    </nav>
  );
}
