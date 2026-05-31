"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const accounts = [
  {
    id: "google",
    name: "Google",
    sub: "Connect your Gmail accounts",
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      </svg>
    ),
  },
  {
    id: "microsoft",
    name: "Microsoft",
    sub: "Connect Outlook or Office 365",
    icon: (
      <svg viewBox="0 0 48 48" className="w-8 h-8">
        <path fill="#f25022" d="M1 1h21v21H1z"/>
        <path fill="#00a4ef" d="M26 1h21v21H26z"/>
        <path fill="#7fba00" d="M1 26h21v21H1z"/>
        <path fill="#ffb900" d="M26 26h21v21H26z"/>
      </svg>
    ),
  },
];

export default function OnboardingPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const router = useRouter();

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col overflow-x-hidden relative">
      {/* Ambient glow */}
      <div className="ambient-glow" />

      {/* Header */}
      <header className="w-full flex items-center justify-between p-4 md:px-6 md:py-6 z-10">
        <div className="flex items-center gap-2">
          <span
            className="material-symbols-outlined text-primary text-2xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            mail
          </span>
          <span className="text-xl font-bold text-on-surface">Nexus Mail</span>
        </div>
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full border border-outline-variant/30 bg-surface-container-low text-on-surface-variant font-mono text-xs">
          <span className="material-symbols-outlined text-sm">auto_awesome</span>
          Powered by Nexus AI
        </div>
      </header>

      {/* Main */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-6 w-full max-w-5xl mx-auto z-10 relative">
        {/* Hero text */}
        <div className="text-center mb-6 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-on-surface mb-2">
            Connect your world.
          </h1>
          <h2 className="text-xl md:text-2xl font-medium text-on-surface-variant mb-3">
            One unified chat-style inbox.
          </h2>
          <p className="text-base text-on-surface-variant/80 max-w-md mx-auto">
            Securely connect your existing accounts. Nexus AI automatically
            organizes your threads, surfaces important updates, and drafts
            intelligent replies.
          </p>
        </div>

        {/* Account cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mb-6">
          {accounts.map((account) => (
            <button
              key={account.id}
              onClick={() => toggle(account.id)}
              className={`connection-card rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer min-h-[200px] relative overflow-hidden group border ${
                selected.has(account.id)
                  ? "selected"
                  : "bg-surface-container-low/60 border-outline-variant/20"
              }`}
              style={{
                background: selected.has(account.id)
                  ? undefined
                  : "rgba(18, 18, 18, 0.6)",
                backdropFilter: "blur(20px)",
              }}
            >
              {selected.has(account.id) && (
                <div className="absolute top-3 right-3">
                  <span
                    className="material-symbols-outlined text-primary text-2xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                </div>
              )}
              <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mb-4 shadow-sm border border-outline-variant/20">
                {account.icon}
              </div>
              <h3 className="text-xl font-medium text-on-surface mb-2">
                {account.name}
              </h3>
              <p className="text-sm text-on-surface-variant">{account.sub}</p>
            </button>
          ))}
        </div>

        {/* Privacy note */}
        <div className="flex items-center justify-center gap-2 text-on-surface-variant/70 font-mono text-xs mb-6">
          <span className="material-symbols-outlined text-base">lock</span>
          <span>
            Your credentials are encrypted end-to-end. We never store your
            passwords.
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md">
          <button
            onClick={() => router.push("/inbox")}
            className="w-full sm:flex-1 py-3 px-6 rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container-high transition-colors font-mono text-xs uppercase tracking-wider"
          >
            Skip for now
          </button>
          <button
            onClick={() => selected.size > 0 && router.push("/inbox")}
            disabled={selected.size === 0}
            className={`w-full sm:flex-1 py-3 px-6 rounded-lg btn-primary-gradient text-on-primary-container font-mono text-xs uppercase tracking-wider shadow-lg transition-all duration-300 relative overflow-hidden ${
              selected.size > 0
                ? "hover:opacity-90 hover:scale-[1.02] ai-shimmer"
                : "opacity-50 cursor-not-allowed"
            }`}
          >
            Continue
          </button>
        </div>
      </main>

      {/* Bottom gradient */}
      <div className="fixed bottom-0 left-0 w-full h-32 bg-gradient-to-t from-surface-container-lowest to-transparent pointer-events-none z-0" />
    </div>
  );
}
