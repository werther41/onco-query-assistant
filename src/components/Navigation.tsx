"use client";

import { Dna, User } from "lucide-react";

export default function Navigation() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Left: Logo and Site Name */}
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-[rgba(0,178,255,1)]">
            <Dna className="w-5 h-5 text-primary-foreground" />
          </div>
          <h2 className="text-lg font-bold text-foreground">OncoQuery</h2>
        </div>

        {/* Right: User Avatar Placeholder */}
        <button className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary hover:bg-muted border border-border transition-colors">
          <User className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>
    </nav>
  );
}
