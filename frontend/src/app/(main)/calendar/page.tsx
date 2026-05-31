"use client";

import { useState } from "react";

const days = [
  { short: "MON", num: 12, active: false },
  { short: "TUE", num: 13, active: true },
  { short: "WED", num: 14, active: false },
];

const hours = [
  "9 AM","10 AM","11 AM","12 PM","1 PM","2 PM","3 PM","4 PM","5 PM",
];

const calendarItems = [
  { label: "Work (Gmail)", color: "#ffb4ab", checked: true },
  { label: "Client Meetings", color: "#c1c1ff", checked: true },
  { label: "Personal", color: "#353534", checked: true },
];

export default function CalendarPage() {
  const [view, setView] = useState<"week" | "day">("week");

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* Left panel */}
      <aside className="w-64 border-r border-outline-variant/40 bg-surface-container-lowest flex flex-col p-6 gap-6 overflow-y-auto flex-shrink-0">
        <button className="w-full py-2 px-4 rounded-md border border-outline-variant/50 text-on-surface text-sm hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-lg">add</span>
          New Event
        </button>

        {/* Mini calendar */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-mono text-xs text-on-surface uppercase tracking-widest">
              October 2023
            </h3>
            <div className="flex gap-1">
              <button className="text-on-surface-variant hover:text-primary">
                <span className="material-symbols-outlined text-base">chevron_left</span>
              </button>
              <button className="text-on-surface-variant hover:text-primary">
                <span className="material-symbols-outlined text-base">chevron_right</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {["S","M","T","W","T","F","S"].map((d, i) => (
              <span key={i} className="font-mono text-[10px] text-on-surface-variant">
                {d}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {[28,29,30,1,2,3,4,5,6,7,8,9,10,11,12,13].map((d, i) => (
              <span
                key={i}
                className={`text-sm py-1 rounded-full cursor-pointer transition-colors ${
                  d === 14
                    ? "bg-primary-container text-on-primary-container font-bold"
                    : i < 3
                    ? "text-on-surface-variant/30"
                    : "text-on-surface hover:bg-surface-container-high"
                }`}
              >
                {d}
              </span>
            ))}
          </div>
        </div>

        <div className="h-px bg-outline-variant/30" />

        {/* My Calendars */}
        <div>
          <h3 className="font-mono text-xs text-on-surface-variant mb-4 uppercase tracking-wider">
            My Calendars
          </h3>
          <div className="flex flex-col gap-3">
            {calendarItems.map((item) => (
              <label key={item.label} className="flex items-center gap-3 cursor-pointer group">
                <div
                  className="w-4 h-4 rounded-[4px] border border-outline-variant flex items-center justify-center"
                  style={{ backgroundColor: item.color }}
                >
                  <span className="material-symbols-outlined text-xs font-bold text-on-error">
                    check
                  </span>
                </div>
                <span className="text-sm text-on-surface group-hover:text-primary transition-colors">
                  {item.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </aside>

      {/* Main calendar area */}
      <section className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Day headers */}
        <div className="flex border-b border-outline-variant/30 bg-surface-container-lowest flex-shrink-0 ml-[60px]">
          {days.map((day) => (
            <div key={day.num} className="flex-1 text-center py-3 border-r border-outline-variant/10">
              <div
                className={`font-mono text-[11px] uppercase ${
                  day.active ? "text-primary" : "text-on-surface-variant"
                }`}
              >
                {day.short}
              </div>
              <div
                className={`text-2xl font-semibold mt-1 ${
                  day.active
                    ? "text-primary bg-primary/10 rounded-full w-10 h-10 inline-flex items-center justify-center"
                    : "text-on-surface"
                }`}
              >
                {day.num}
              </div>
            </div>
          ))}
        </div>

        {/* Scrollable grid */}
        <div className="flex-1 overflow-y-auto relative">
          <div className="flex relative min-h-[560px]">
            {/* Time column */}
            <div className="w-[60px] flex-shrink-0 border-r border-outline-variant/30 bg-surface-container-lowest flex flex-col text-right pr-2 pt-2 text-on-surface-variant font-mono text-[11px] relative z-10">
              {hours.map((h) => (
                <div key={h} className="h-[60px] relative">
                  <span className="absolute top-[-8px] right-2">{h}</span>
                </div>
              ))}
            </div>

            {/* Grid lines */}
            <div className="absolute inset-0 left-[60px] flex flex-col pointer-events-none">
              {hours.map((h) => (
                <div key={h} className="h-[60px] border-b border-outline-variant/10 w-full" />
              ))}
            </div>

            {/* Day columns */}
            <div className="flex-1 flex relative">
              {/* Monday */}
              <div className="flex-1 border-r border-outline-variant/10 relative">
                <div className="absolute top-[60px] left-1 right-1 h-[90px] bg-error/10 border-l-4 border-error rounded-r-md p-2 overflow-hidden shadow-sm">
                  <h4 className="text-sm font-semibold text-on-surface leading-tight">
                    Design Sync
                  </h4>
                  <p className="font-mono text-[11px] text-on-surface-variant mt-1">
                    9:00 – 10:30 AM
                  </p>
                </div>
              </div>

              {/* Tuesday (active) */}
              <div className="flex-1 border-r border-outline-variant/10 relative bg-primary/5">
                {/* Current time line */}
                <div className="absolute top-[150px] left-0 right-0 h-px bg-error z-20 flex items-center">
                  <div className="w-2 h-2 rounded-full bg-error absolute left-[-4px]" />
                </div>

                {/* AI optimal slot */}
                <div className="absolute top-[180px] left-1 right-1 h-[60px] border border-primary/50 bg-primary-container/10 rounded-md p-2 ai-glow flex items-center justify-center cursor-pointer hover:bg-primary-container/20 transition-all">
                  <div className="flex items-center gap-2 text-primary text-sm font-medium">
                    <span className="material-symbols-outlined text-lg">auto_awesome</span>
                    Optimal Focus Block
                  </div>
                </div>

                {/* Q3 roadmap meeting */}
                <div className="absolute top-[300px] left-1 right-1 h-[60px] bg-primary-fixed-dim/20 border-l-4 border-primary-fixed-dim rounded-r-md p-2 overflow-hidden shadow-sm">
                  <h4 className="text-sm font-semibold text-on-surface leading-tight">
                    Q3 Product Roadmap
                  </h4>
                  <p className="font-mono text-[11px] text-on-surface-variant mt-1">
                    2:00 – 3:00 PM
                  </p>
                </div>

                {/* Ghost drafting event */}
                <div className="absolute top-[420px] left-1 right-1 h-[60px] stripe-bg border-2 border-dashed border-outline-variant/60 rounded-md p-2 opacity-80">
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-on-surface-variant text-base mt-0.5 animate-pulse">
                      hourglass_empty
                    </span>
                    <div>
                      <h4 className="text-sm font-medium text-on-surface-variant italic leading-tight">
                        Drafting Meeting...
                      </h4>
                      <p className="font-mono text-[11px] text-on-surface-variant mt-0.5">
                        From: Jordan Dupre
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Wednesday */}
              <div className="flex-1 relative">
                <div className="absolute top-[120px] left-1 right-1 h-[120px] bg-surface-variant border-l-4 border-outline rounded-r-md p-2 overflow-hidden shadow-sm">
                  <h4 className="text-sm font-semibold text-on-surface leading-tight">
                    Deep Work
                  </h4>
                  <p className="font-mono text-[11px] text-on-surface-variant mt-1">
                    11:00 AM – 1:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Right intelligence panel */}
      <aside className="w-[320px] border-l border-outline-variant/40 bg-surface-container-lowest flex flex-col p-6 gap-6 overflow-y-auto flex-shrink-0">
        <h2 className="text-xl font-semibold text-on-surface">Intelligence</h2>

        {/* Meeting prep */}
        <div className="rounded-xl p-5 flex flex-col gap-4 relative overflow-hidden border border-outline-variant/20 bg-surface-container-low/50 backdrop-blur">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-container to-secondary-container opacity-70" />
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-[11px] text-primary flex items-center gap-1 uppercase tracking-widest">
                <span className="material-symbols-outlined text-sm">bolt</span>
                Next Up
              </span>
              <span className="font-mono text-xs text-on-surface-variant">
                In 2h 45m
              </span>
            </div>
            <h3 className="text-lg font-semibold text-on-surface">
              Q3 Product Roadmap
            </h3>
            <p className="text-sm text-on-surface-variant mt-1">
              Discussing Q3 features and engineering capacity.
            </p>
          </div>

          {/* Relevant threads */}
          <div>
            <h4 className="font-mono text-xs text-on-surface-variant mb-2 uppercase">
              Relevant Threads
            </h4>
            <ul className="flex flex-col gap-2">
              {[
                { icon: "mail", text: "Re: Q3 Planning Constraints & Resources needed" },
                { icon: "forum", text: "Slack: Design check-in for Q3 launch" },
              ].map((t) => (
                <li
                  key={t.text}
                  className="flex items-start gap-2 text-on-surface text-sm bg-surface-container-low p-2 rounded-lg border border-outline-variant/30 hover:border-outline-variant cursor-pointer transition-colors"
                >
                  <span className="material-symbols-outlined text-base text-primary flex-shrink-0 mt-0.5">
                    {t.icon}
                  </span>
                  <span className="line-clamp-2 leading-tight">{t.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Linked docs */}
          <div>
            <h4 className="font-mono text-xs text-on-surface-variant mb-2 uppercase">
              Linked Documents
            </h4>
            <div className="flex flex-wrap gap-2">
              {[
                { icon: "description", color: "#00A971", label: "Q3_Specs_v2.pdf" },
                { icon: "table", color: "#1FA463", label: "Capacity_Model" },
              ].map((doc) => (
                <div
                  key={doc.label}
                  className="flex items-center gap-1.5 bg-surface-container-low px-2 py-1.5 rounded-md border border-outline-variant/30 text-on-surface font-mono text-xs cursor-pointer hover:bg-surface-variant"
                >
                  <span
                    className="material-symbols-outlined text-sm"
                    style={{ color: doc.color }}
                  >
                    {doc.icon}
                  </span>
                  {doc.label}
                </div>
              ))}
            </div>
          </div>

          <button className="text-primary font-mono text-xs flex items-center justify-center gap-1 hover:underline">
            Generate Full Brief
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        {/* Scheduling links */}
        <div>
          <h3 className="font-mono text-xs text-on-surface-variant mb-3 uppercase tracking-wider">
            Native Booking Links
          </h3>
          <div className="flex flex-col gap-2">
            {[
              { icon: "schedule", title: "15m Quick Sync", sub: "Public URL" },
              { icon: "hourglass_bottom", title: "1h Deep Dive", sub: "Requires Approval" },
            ].map((link) => (
              <div
                key={link.title}
                className="flex items-center justify-between bg-surface-container-high px-3 py-2.5 rounded-lg border border-outline-variant/20 hover:border-outline-variant/50 cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center text-on-surface">
                    <span className="material-symbols-outlined text-base">{link.icon}</span>
                  </div>
                  <div>
                    <div className="text-sm text-on-surface font-medium group-hover:text-primary transition-colors">
                      {link.title}
                    </div>
                    <div className="font-mono text-[11px] text-on-surface-variant">
                      {link.sub}
                    </div>
                  </div>
                </div>
                <button className="text-on-surface-variant hover:text-on-surface p-1 rounded-md hover:bg-surface-variant">
                  <span className="material-symbols-outlined text-lg">content_copy</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Smart buffers */}
        <div className="mt-auto pt-4 border-t border-outline-variant/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-lg">shield</span>
            <span className="font-mono text-xs text-on-surface-variant">
              Buffer:{" "}
              <strong className="text-on-surface font-medium">15m active</strong>
            </span>
          </div>
          <a className="font-mono text-xs text-primary hover:underline" href="#">
            Manage
          </a>
        </div>
      </aside>
    </div>
  );
}
