"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/inbox", icon: "inbox", label: "Inbox", badge: 12 },
  { href: "/calendar", icon: "calendar_today", label: "Calendar" },
  { href: "/inbox/drafts", icon: "drafts", label: "Drafts" },
  { href: "/inbox/sent", icon: "send", label: "Sent" },
  { href: "/inbox/trash", icon: "delete", label: "Trash" },
];

const footerItems = [
  { href: "/settings", icon: "settings", label: "Settings" },
  { href: "/help", icon: "help", label: "Help" },
];

const accounts = [
  { color: "#EA4335", label: "Personal (Gmail)", count: 4 },
  { color: "#0078D4", label: "Work (Outlook)", count: 8 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-0 flex flex-col w-[280px] h-screen border-r border-outline-variant/40 bg-surface z-50 overflow-y-auto">
      <div className="p-6 flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary-container rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <span
              className="material-symbols-outlined text-white text-2xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              all_inclusive
            </span>
          </div>
          <div>
            <h1 className="text-[17px] font-bold text-on-surface leading-none tracking-tight">
              Nexus Mail
            </h1>
            <p className="text-[11px] text-primary mt-0.5 tracking-widest uppercase font-mono">
              Workspace
            </p>
          </div>
        </div>

        {/* Compose */}
        <Link
          href="/inbox/compose"
          className="mb-8 w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-primary to-inverse-primary text-white font-semibold hover:opacity-90 hover:shadow-lg hover:shadow-primary/20 active:scale-95 transition-all border border-white/10"
        >
          <span className="material-symbols-outlined text-xl">edit_square</span>
          New Message
        </Link>

        {/* Nav */}
        <nav className="flex flex-col gap-1 mb-8">
          {navItems.map((item) => {
            const isActive =
              item.href === "/inbox"
                ? pathname === "/inbox" || pathname === "/inbox/chat"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 py-2.5 px-4 rounded-lg transition-colors",
                  isActive
                    ? "bg-surface-container-high text-primary font-medium"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                )}
              >
                <span
                  className="material-symbols-outlined text-xl"
                  style={
                    isActive
                      ? { fontVariationSettings: "'FILL' 1" }
                      : undefined
                  }
                >
                  {item.icon}
                </span>
                <span className="text-sm">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto text-xs bg-primary text-on-primary px-2 py-0.5 rounded-full font-semibold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Accounts */}
        <div className="mb-8">
          <h3 className="text-[11px] text-on-surface-variant mb-3 px-4 uppercase tracking-widest font-mono">
            Accounts
          </h3>
          <div className="flex flex-col gap-1">
            {accounts.map((account) => (
              <button
                key={account.label}
                className="flex items-center justify-between py-2 px-4 rounded-lg hover:bg-surface-container-high transition-colors w-full group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: account.color,
                      boxShadow: `0 0 8px ${account.color}80`,
                    }}
                  />
                  <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
                    {account.label}
                  </span>
                </div>
                {account.count > 0 && (
                  <span className="text-xs text-on-surface-variant font-mono">
                    {account.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto border-t border-outline-variant/30 pt-6 flex flex-col gap-1">
          {footerItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-4 py-2.5 px-4 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined text-xl">
                {item.icon}
              </span>
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
          <div className="flex items-center gap-3 px-4 py-4 mt-2 bg-surface-container-low rounded-xl">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-outline-variant/40 bg-gradient-to-br from-primary-container to-secondary-container flex-shrink-0" />
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-on-surface truncate">
                Alex Rivera
              </p>
              <p className="text-xs text-on-surface-variant truncate font-mono">
                alex@nexusmail.ai
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
