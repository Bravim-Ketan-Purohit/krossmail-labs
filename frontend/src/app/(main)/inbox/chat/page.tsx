import Link from "next/link";

const conversations = [
  {
    id: "elena",
    name: "Elena Richardson",
    account: "O",
    accountColor: "#0078D4",
    time: "2m ago",
    subject: "Updated: Q4 Design Roadmap and Token Integration",
    snippet:
      "I've finished the initial draft of the token migration. We need to review the primary color palette adjustments before the dev handoff...",
    tags: [
      { label: "Design System", color: "bg-secondary-container/30 text-on-secondary-container", icon: undefined as string | undefined },
      { label: "Urgent", color: "bg-error/20 text-error", icon: "priority_high" as string | undefined },
    ],
    priority: true,
    initials: null as string | null,
    initColor: undefined as string | undefined,
    isGroup: undefined as boolean | undefined,
    dim: undefined as boolean | undefined,
  },
  {
    id: "james",
    name: "James D. (DevOps)",
    account: "O",
    accountColor: "#0078D4",
    time: "45m ago",
    subject: "Server Maintenance: Upcoming window for Nexus-7",
    snippet:
      "We are looking at a 15-minute downtime on Sunday at 02:00 UTC. This shouldn't affect the main AI processing nodes...",
    tags: [] as { label: string; color: string; icon?: string }[],
    priority: false,
    initials: "JD" as string | null,
    initColor: "bg-tertiary-container text-on-tertiary-container" as string | undefined,
    isGroup: undefined as boolean | undefined,
    dim: undefined as boolean | undefined,
  },
  {
    id: "alex",
    name: "Alex Rivera",
    account: "G",
    accountColor: "#EA4335",
    time: "2h ago",
    subject: "Review requested: API Documentation PR #442",
    snippet:
      "I've added the new endpoints for the AI-summary service. Can you take a look at the error handling logic I implemented?",
    tags: [
      { label: "Engineering", color: "bg-primary-container/20 text-primary", icon: undefined as string | undefined },
    ],
    priority: false,
    initials: null as string | null,
    initColor: undefined as string | undefined,
    isGroup: undefined as boolean | undefined,
    dim: undefined as boolean | undefined,
  },
  {
    id: "product-team",
    name: "Product Team Weekly",
    account: "O",
    accountColor: "#0078D4",
    time: "4h ago",
    subject: "Meeting notes and action items from yesterday",
    snippet:
      'Sarah: "The timeline looks tight but manageable if we offload the mobile-specific UI..."',
    tags: [] as { label: string; color: string; icon?: string }[],
    priority: false,
    initials: null as string | null,
    initColor: undefined as string | undefined,
    isGroup: true as boolean | undefined,
    dim: undefined as boolean | undefined,
  },
  {
    id: "margaret",
    name: "Margaret Chen",
    account: "G",
    accountColor: "#EA4335",
    time: "Yesterday",
    subject: "Re: Brand Partnership Opportunity",
    snippet:
      "Thanks for the introduction. I've scheduled a call with the team for next Tuesday...",
    tags: [] as { label: string; color: string; icon?: string }[],
    priority: false,
    initials: null as string | null,
    initColor: undefined as string | undefined,
    isGroup: undefined as boolean | undefined,
    dim: true as boolean | undefined,
  },
];

export default function ChatInboxPage() {
  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Conversation list */}
      <main className="flex-1 lg:mr-[320px] overflow-y-auto">
        <div className="max-w-[900px] mx-auto p-4 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between py-2">
            <div>
              <h2 className="text-2xl font-semibold text-on-surface">Inbox</h2>
              <p className="text-sm text-on-surface-variant mt-1">
                12 unread conversations curated by AI
              </p>
            </div>
          </div>

          {/* List */}
          <div className="space-y-3">
            {conversations.map((c) => (
              <Link
                key={c.id}
                href={`/inbox/${c.id}`}
                className={`group relative bg-surface-container-low rounded-2xl p-4 border ${
                  c.priority
                    ? "border-outline-variant/30 hover:border-primary/50"
                    : "border-outline-variant/20 hover:border-outline-variant/60"
                } hover:bg-surface-container transition-all cursor-pointer shadow-sm block ${
                  c.dim ? "opacity-70 hover:opacity-100" : ""
                }`}
              >
                {c.priority && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-primary rounded-r-full" />
                )}
                <div className="flex gap-4">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0 mt-1">
                    {c.isGroup ? (
                      <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant border-2 border-surface">
                        <span className="material-symbols-outlined text-xl">group</span>
                      </div>
                    ) : c.initials ? (
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 border-surface ${c.initColor || "bg-surface-container-highest text-on-surface"}`}
                      >
                        {c.initials}
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-container to-secondary-container border-2 border-surface" />
                    )}
                    {/* Account badge */}
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-surface rounded-full flex items-center justify-center border border-outline-variant">
                      <span
                        className="font-bold text-[10px]"
                        style={{ color: c.accountColor }}
                      >
                        {c.account}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <h4
                        className={`text-base font-semibold ${
                          c.priority
                            ? "text-on-surface group-hover:text-primary transition-colors"
                            : "text-on-surface font-medium"
                        }`}
                      >
                        {c.name}
                      </h4>
                      <span className="text-xs text-on-surface-variant whitespace-nowrap ml-4 font-mono">
                        {c.time}
                      </span>
                    </div>
                    <p
                      className={`text-sm font-medium mb-1 truncate ${
                        c.priority ? "text-on-primary-container" : "text-on-surface"
                      }`}
                    >
                      {c.subject}
                    </p>
                    <p className="text-sm text-on-surface-variant truncate">
                      {c.snippet}
                    </p>
                    {c.tags && c.tags.length > 0 && (
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {c.tags.map((tag) => (
                          <span
                            key={tag.label}
                            className={`px-2 py-0.5 rounded-md font-mono text-[11px] flex items-center gap-1 ${tag.color}`}
                          >
                            {tag.icon && (
                              <span className="material-symbols-outlined text-xs">
                                {tag.icon}
                              </span>
                            )}
                            {tag.label}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex justify-center py-8">
            <button className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-surface-container border border-outline-variant/30 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all font-mono text-sm">
              <span>Load older conversations</span>
              <span className="material-symbols-outlined text-lg">expand_more</span>
            </button>
          </div>
        </div>
      </main>

      {/* AI Right sidebar */}
      <aside className="hidden lg:flex w-[320px] border-l border-outline-variant/30 bg-surface/50 backdrop-blur-xl flex-col p-5 gap-6 overflow-y-auto fixed right-0 top-16 bottom-0 z-30">
        {/* Focus Score */}
        <div className="bg-gradient-to-br from-primary-container/20 to-surface-container rounded-2xl p-5 border border-primary/20 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="text-primary text-[42px] font-bold leading-none tracking-tighter mb-1">
              84%
            </div>
            <div className="font-mono text-[11px] text-primary uppercase tracking-widest font-semibold">
              Focus Score
            </div>
            <p className="mt-2 text-sm text-on-surface-variant">
              Your inbox is cleaner than average today.
            </p>
            <button className="mt-4 w-full py-2 bg-primary text-on-primary rounded-lg font-mono text-sm hover:opacity-90 transition-opacity shadow-sm">
              Auto-triage Inbox
            </button>
          </div>
        </div>

        {/* AI Summary */}
        <div>
          <h3 className="font-mono text-xs text-on-surface-variant uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-primary">
              auto_awesome
            </span>
            AI Summary
          </h3>
          <div className="bg-surface-container rounded-xl p-4 border border-outline-variant/20 text-sm text-on-surface-variant leading-relaxed">
            You have{" "}
            <span className="text-on-surface font-medium">3 high-priority</span>{" "}
            threads regarding the{" "}
            <span className="text-primary font-medium">Q4 Roadmap</span>. Elena
            is waiting for your approval on design system updates, and there&apos;s a
            scheduled sync with DevOps at 3:00 PM.
          </div>
        </div>

        {/* Suggested Actions */}
        <div>
          <h3 className="font-mono text-xs text-on-surface-variant uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-base">task_alt</span>
            Suggested Actions
          </h3>
          <div className="space-y-2">
            {[
              { title: "Approve Token Migration", sub: "From Elena's email" },
              { title: "Confirm 02:00 UTC Downtime", sub: "Reply to James D." },
            ].map((action) => (
              <div
                key={action.title}
                className="bg-surface-container rounded-xl p-3 border border-outline-variant/20 flex items-start gap-3 hover:border-primary/30 cursor-pointer transition-colors group"
              >
                <div className="mt-0.5 w-4 h-4 rounded-full border border-outline-variant group-hover:border-primary flex-shrink-0" />
                <div>
                  <p className="text-sm text-on-surface font-medium">{action.title}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">{action.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Attachments */}
        <div>
          <h3 className="font-mono text-xs text-on-surface-variant uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-base">attachment</span>
            Recent Attachments
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-surface-container rounded-xl p-3 border border-outline-variant/20 flex flex-col items-center justify-center text-center gap-2 cursor-pointer hover:bg-surface-container-high transition-colors">
              <div className="w-10 h-10 rounded-lg bg-error/10 text-error flex items-center justify-center">
                <span className="material-symbols-outlined">picture_as_pdf</span>
              </div>
              <span className="text-[11px] text-on-surface-variant truncate w-full">
                Q4_Roadmap.pdf
              </span>
            </div>
            <div className="bg-surface-container rounded-xl p-3 border border-outline-variant/20 flex flex-col items-center justify-center text-center gap-2 cursor-pointer hover:bg-surface-container-high transition-colors">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <span className="material-symbols-outlined">design_services</span>
              </div>
              <span className="text-[11px] text-on-surface-variant truncate w-full">
                Tokens_v2.fig
              </span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
