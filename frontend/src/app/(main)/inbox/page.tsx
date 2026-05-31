"use client";

import Link from "next/link";

const emails = [
  {
    id: "1",
    sender: "Julian Vance",
    subject: "Q3 Strategy Alignment",
    snippet:
      "Hi Alex, let's look at the quarterly projections and see if we can optimize the AI training loop for...",
    time: "9:41 AM",
    unread: true,
    dot: true,
  },
  {
    id: "ai",
    sender: "Nexus AI",
    subject: "Daily Briefing",
    snippet:
      "You have 3 urgent items requiring action before the 2 PM product sync...",
    time: "8:15 AM",
    unread: true,
    ai: true,
  },
  {
    id: "3",
    sender: "Design System Lead",
    subject: "New Token Manifest",
    snippet:
      "Updated the glassmorphism tokens for the sidebar navigation...",
    time: "Yesterday",
    attachment: true,
  },
  {
    id: "4",
    sender: "Venture X Partners",
    subject: "Follow up: Series B Roadmap",
    snippet: "The deck looks solid. Let's schedule a call for next Wednesday to...",
    time: "Oct 24",
    flagged: true,
  },
  {
    id: "5",
    sender: "Stripe",
    subject: "Monthly Subscription Active",
    snippet:
      "Thank you for your continued support of the Nexus Mail Premium plan...",
    time: "Oct 22",
  },
  {
    id: "6",
    sender: "GitHub",
    subject: "[nexus-core] Pull request #428 opened",
    snippet:
      "feature/ai-summarization-v2-proto has been submitted for review...",
    time: "Oct 21",
  },
  {
    id: "7",
    sender: "Figma Notifications",
    subject: "Elena commented on 'Nexus_V2_Main'",
    snippet: '"Can we make the hover state on rows even more subtle?"',
    time: "Oct 20",
  },
  {
    id: "8",
    sender: "Linear",
    subject: "Issue NEX-104 assigned to you",
    snippet: "Implement dense list view toggle for power users...",
    time: "Oct 19",
  },
];

export default function InboxPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Filter bar */}
      <section className="px-4 py-3 flex items-center justify-between border-b border-outline-variant/10 bg-surface/50 flex-shrink-0">
        <div className="flex items-center gap-4 overflow-x-auto">
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-bold text-sm">
            All Mail
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-low text-sm transition-colors">
            Unread
            <span className="text-xs bg-surface-container-high px-1.5 py-0.5 rounded">
              12
            </span>
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-low text-sm transition-colors">
            <span className="material-symbols-outlined text-lg">flag</span>
            Flagged
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-low text-sm transition-colors">
            <span className="material-symbols-outlined text-lg">attach_file</span>
            Attachments
          </button>
          <div className="h-4 w-px bg-outline-variant/30" />
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-low text-sm transition-colors">
            Latest First
            <span className="material-symbols-outlined text-lg">expand_more</span>
          </button>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-on-surface-variant font-mono">
            1–50 of 1,248
          </span>
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-md hover:bg-surface-container-low text-on-surface-variant">
              <span className="material-symbols-outlined text-xl">chevron_left</span>
            </button>
            <button className="p-1.5 rounded-md hover:bg-surface-container-low text-on-surface-variant">
              <span className="material-symbols-outlined text-xl">chevron_right</span>
            </button>
          </div>
        </div>
      </section>

      {/* Table */}
      <section className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 grid grid-cols-[48px_1.5fr_3fr_120px] px-4 py-3 bg-surface border-b border-outline-variant/20 text-xs text-on-surface-variant font-bold uppercase tracking-wider font-mono">
          <div className="flex justify-center">
            <input
              type="checkbox"
              className="rounded border-outline-variant bg-transparent text-primary focus:ring-primary"
            />
          </div>
          <div>Sender</div>
          <div>Subject &amp; Snippet</div>
          <div className="text-right">Date</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-outline-variant/5">
          {emails.map((email) => (
            <Link
              key={email.id}
              href={`/inbox/${email.id}`}
              className={`grid grid-cols-[48px_1.5fr_3fr_120px] px-4 py-3.5 hover:bg-surface-container-low transition-colors group cursor-pointer border-l-2 border-l-transparent hover:border-l-primary relative ${email.ai ? "bg-primary/5 ai-shimmer" : ""}`}
            >
              <div className="flex justify-center items-center" onClick={(e) => e.preventDefault()}>
                <input
                  type="checkbox"
                  className="rounded border-outline-variant bg-transparent text-primary focus:ring-primary"
                />
              </div>

              {/* Sender */}
              <div className="flex items-center gap-3">
                {email.unread && !email.ai && (
                  <div className="w-2 h-2 rounded-full bg-primary ring-4 ring-primary/10 flex-shrink-0" />
                )}
                {email.ai && (
                  <span
                    className="material-symbols-outlined text-primary text-xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    auto_awesome
                  </span>
                )}
                {email.flagged && (
                  <span
                    className="material-symbols-outlined text-tertiary text-xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    flag
                  </span>
                )}
                <span
                  className={`text-sm truncate ${
                    email.unread
                      ? "font-bold text-on-surface"
                      : "font-medium text-on-surface-variant"
                  }`}
                >
                  {email.sender}
                </span>
              </div>

              {/* Subject + snippet */}
              <div className="flex items-center gap-2 truncate min-w-0">
                <span
                  className={`text-sm truncate flex-shrink-0 ${
                    email.ai ? "text-primary font-bold" : email.unread ? "font-bold text-on-surface" : "text-on-surface-variant"
                  }`}
                >
                  {email.subject}
                </span>
                <span className="text-sm text-on-surface-variant truncate">
                  — {email.snippet}
                </span>
                {email.ai && (
                  <span className="bg-primary/20 text-primary text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ml-2 flex-shrink-0">
                    Smart
                  </span>
                )}
                {email.attachment && (
                  <span className="material-symbols-outlined text-base text-on-surface-variant/40 flex-shrink-0">
                    attach_file
                  </span>
                )}
                <span className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button
                    className="p-1 hover:text-primary transition-colors"
                    onClick={(e) => e.preventDefault()}
                  >
                    <span className="material-symbols-outlined text-lg">archive</span>
                  </button>
                  <button
                    className="p-1 hover:text-error transition-colors"
                    onClick={(e) => e.preventDefault()}
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                  <button
                    className="p-1 hover:text-on-surface transition-colors"
                    onClick={(e) => e.preventDefault()}
                  >
                    <span className="material-symbols-outlined text-lg">mark_email_read</span>
                  </button>
                </span>
              </div>

              {/* Date */}
              <div
                className={`text-right text-sm pt-1 font-mono ${
                  email.unread ? "text-on-surface font-bold" : "text-on-surface-variant"
                }`}
              >
                {email.time}
              </div>
            </Link>
          ))}
          <div className="h-24 bg-gradient-to-t from-background to-transparent pointer-events-none sticky bottom-0" />
        </div>
      </section>

      {/* FAB */}
      <div className="fixed bottom-4 right-4 z-50">
        <button className="w-14 h-14 bg-primary text-on-primary rounded-2xl shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all group overflow-hidden relative">
          <span className="material-symbols-outlined text-3xl relative z-10">
            auto_awesome
          </span>
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
}
