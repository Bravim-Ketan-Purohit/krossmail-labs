import Link from "next/link";

const messages = [
  {
    id: 1,
    from: "them",
    initials: "JD",
    text: "Hey team, I've finished the initial draft for the Q3 roadmap. I think we need to prioritize the AI integration by late July.",
    time: "10:42 AM",
  },
  {
    id: 2,
    from: "them",
    initials: "JD",
    text: null,
    richText: (
      <>
        Can we meet on{" "}
        <span className="text-primary font-bold">Thursday at 2:00 PM</span> to
        discuss the resource allocation?
      </>
    ),
    time: "10:43 AM",
  },
  {
    id: 3,
    from: "me",
    text: "Sounds good, Jordan. Thursday at 2 works for me. I'll invite the engineering leads as well.",
    time: "11:05 AM",
  },
];

const quickReplies = [
  { label: "Confirm Thursday 2PM", icon: "bolt", primary: true },
  { label: "Can we push it to Friday?" },
  { label: "I'll review the budget now." },
  { label: "Thanks for the update!" },
];

export default function MessageDetailPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-64px)] relative">
      {/* Shared sidebar already rendered by (main)/layout */}
      <div className="flex flex-col flex-1 max-w-[1200px] mx-auto w-full px-4 py-6 overflow-hidden">
        {/* Conversation header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-container to-secondary-container ring-2 ring-primary/20" />
              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-background rounded-full" />
            </div>
            <div>
              <h2 className="text-xl font-medium text-on-surface">
                Jordan Dupré
              </h2>
              <p className="text-sm text-on-surface-variant">
                Re: Product Roadmap 2024 Q3 · 3 participants
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-tertiary-container text-on-tertiary-container font-bold text-sm hover:brightness-110 transition-all">
              <span className="material-symbols-outlined text-sm">
                calendar_add_on
              </span>
              Add to Calendar
            </button>
            <button className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">more_vert</span>
            </button>
          </div>
        </div>

        {/* Thread */}
        <div className="flex-1 overflow-y-auto space-y-8 pb-40">
          {/* Date separator */}
          <div className="flex items-center justify-center gap-4">
            <div className="h-px flex-grow bg-outline-variant/30" />
            <span className="font-mono text-xs text-on-surface-variant uppercase tracking-widest">
              Yesterday
            </span>
            <div className="h-px flex-grow bg-outline-variant/30" />
          </div>

          {messages.map((msg) =>
            msg.from === "them" ? (
              <div key={msg.id} className="flex flex-col items-start max-w-[85%]">
                <div className="flex items-end gap-3 mb-1">
                  <div className="w-8 h-8 rounded-full bg-surface-container-highest flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-on-surface">
                    {msg.initials}
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-bl-sm border border-outline-variant text-on-surface-variant leading-relaxed">
                    {msg.richText ?? msg.text}
                  </div>
                </div>
                <span className="ml-11 text-[10px] text-on-surface-variant uppercase font-mono">
                  {msg.time}
                </span>
              </div>
            ) : (
              <div key={msg.id} className="flex flex-col items-end self-end max-w-[85%]">
                <div className="px-4 py-3 rounded-2xl rounded-br-sm bg-surface-container-highest text-on-surface leading-relaxed">
                  {msg.text}
                </div>
                <div className="flex items-center gap-1 mt-1 mr-1">
                  <span className="text-[10px] text-on-surface-variant uppercase font-mono">
                    {msg.time}
                  </span>
                  <span className="material-symbols-outlined text-xs text-primary">
                    done_all
                  </span>
                </div>
              </div>
            )
          )}

          {/* AI Insight card */}
          <div className="ai-gradient-border p-4 rounded-2xl relative overflow-hidden">
            <div className="shimmer absolute inset-0 opacity-20 pointer-events-none" />
            <div className="flex items-start gap-3">
              <span
                className="material-symbols-outlined text-primary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                auto_awesome
              </span>
              <div>
                <p className="font-bold text-on-surface mb-1">Nexus AI Insight</p>
                <p className="text-sm text-on-surface-variant">
                  Jordan is suggesting a meeting on Thursday. I&apos;ve detected your
                  calendar is open from 1:00 PM to 3:30 PM. Would you like me to
                  draft a calendar invite for the team?
                </p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button className="text-primary font-bold text-xs px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-colors">
                Draft Invite
              </button>
              <button className="text-on-surface-variant text-xs px-3 py-1.5 rounded-lg hover:bg-surface-variant transition-colors">
                Dismiss
              </button>
            </div>
          </div>

          {/* Follow-up message + attachment */}
          <div className="flex flex-col items-start max-w-[85%]">
            <div className="flex items-end gap-3 mb-1">
              <div className="w-8 h-8 rounded-full bg-surface-container-highest flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-on-surface">
                JD
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-bl-sm border border-outline-variant text-on-surface-variant leading-relaxed">
                Perfect. I&apos;m also attaching the current budget spreadsheet for
                reference.
              </div>
            </div>
          </div>

          {/* Attachment */}
          <div className="ml-11 max-w-[300px] p-3 rounded-xl bg-surface-container-low border border-outline-variant flex items-center gap-3 hover:bg-surface-container-high cursor-pointer transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 flex-shrink-0">
              <span className="material-symbols-outlined">description</span>
            </div>
            <div className="flex-grow min-w-0">
              <p className="text-sm font-bold truncate">Q3_Budget_Draft.pdf</p>
              <p className="text-xs text-on-surface-variant">2.4 MB · PDF</p>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">
              download
            </span>
          </div>
        </div>
      </div>

      {/* Fixed reply area */}
      <div className="fixed bottom-0 left-[280px] right-0 p-4 glass border-t border-outline-variant/30 flex flex-col gap-4 z-50">
        {/* Quick replies */}
        <div className="max-w-[1200px] mx-auto w-full flex flex-wrap gap-2">
          {quickReplies.map((r) => (
            <button
              key={r.label}
              className={`whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold active:scale-95 transition-all ${
                r.primary
                  ? "border-primary/30 bg-primary/5 text-primary hover:bg-primary/10"
                  : "border-outline-variant bg-surface text-on-surface-variant font-medium hover:bg-surface-container-high"
              }`}
            >
              {r.icon && (
                <span className="material-symbols-outlined text-sm">
                  {r.icon}
                </span>
              )}
              {r.label}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="max-w-[1200px] mx-auto w-full">
          <div className="flex items-center gap-3 bg-surface-container-high rounded-2xl p-2 focus-within:ring-2 focus-within:ring-primary transition-all">
            <button className="w-10 h-10 rounded-xl flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
              <span className="material-symbols-outlined">add_circle</span>
            </button>
            <input
              type="text"
              className="flex-grow bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant py-2 outline-none text-sm"
              placeholder="Type a message or use '/' for AI commands..."
            />
            <div className="flex items-center gap-1">
              <button className="w-10 h-10 rounded-xl flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">mood</span>
              </button>
              <button className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center shadow-lg shadow-primary/20 hover:brightness-110 active:scale-95 transition-all">
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
