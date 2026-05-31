"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export function TopNav() {
  const pathname = usePathname();
  const isChat = pathname === "/inbox/chat";

  return (
    <header className="fixed top-0 right-0 flex items-center justify-between px-4 h-16 w-[calc(100%-280px)] ml-[280px] z-40 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/20">
      {/* Search */}
      <div className="flex items-center flex-1 max-w-xl px-4">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl pointer-events-none">
            search
          </span>
          <Input
            type="text"
            placeholder="Search conversations or ask AI..."
            className="w-full h-9 pl-10 pr-4 bg-surface-container-low border-transparent rounded-lg focus:border-primary/50 focus-visible:ring-1 focus-visible:ring-primary text-sm placeholder:text-on-surface-variant/60 text-on-surface"
          />
        </div>
      </div>

      {/* Center tab toggle */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center p-1 bg-surface-container-lowest rounded-xl border border-outline-variant/40 shadow-inner">
        <Link
          href="/inbox/chat"
          className={cn(
            "px-5 py-1.5 rounded-lg font-mono text-xs transition-all flex items-center gap-2",
            isChat
              ? "bg-surface-container-high text-on-surface shadow-sm"
              : "text-on-surface-variant hover:text-on-surface"
          )}
        >
          <span className="material-symbols-outlined text-base">forum</span>
          Conversations
        </Link>
        <Link
          href="/inbox"
          className={cn(
            "px-5 py-1.5 rounded-lg font-mono text-xs transition-all flex items-center gap-2",
            !isChat
              ? "bg-surface-container-high text-on-surface shadow-sm"
              : "text-on-surface-variant hover:text-on-surface"
          )}
        >
          <span className="material-symbols-outlined text-base">view_list</span>
          Classic
        </Link>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 py-1.5 px-3 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-mono text-xs">
          <span className="material-symbols-outlined text-lg">auto_awesome</span>
          Ask AI
        </button>
        <button className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-full transition-colors relative">
          <span className="material-symbols-outlined text-xl">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface" />
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-container to-secondary-container border border-outline-variant cursor-pointer hover:border-primary transition-colors ml-2" />
      </div>
    </header>
  );
}
