"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FaAws, FaGithub } from "react-icons/fa";
import { BsMicrosoft } from "react-icons/bs";

const SUBJECTS: [string, string, string, boolean][] = [
  ["Julian Vance", "RE: RE: RE: RE: Q3 planning", "9:41 AM", true],
  ["Marketing", "Please don't reply all to this", "9:02 AM", false],
  ["HR Systems", "ACTION REQUIRED (sent 3 weeks ago)", "Yesterday", true],
  ["Dad", "Fwd: Fwd: Fwd: see below", "Yesterday", false],
  ["Unknown sender", "Quick question", "Oct 24", true],
  ["Notifications", "Your password expires in 2 days", "Oct 24", false],
  ["The Whole Company", "Re: Office plants — a thread", "Oct 23", false],
  ["Calendar", "Invite: sync (no agenda)", "Oct 23", true],
  ["Stripe", "Your receipt — again", "Oct 22", false],
  ["Someone you met once", "Following up on my last 4 emails", "Oct 22", false],
  ["GitHub", "[repo] 38 new notifications", "Oct 21", false],
  ["LinkedIn", "You appeared in 0 searches", "Oct 21", false],
];

function GhostRows() {
  return (
    <>
      {SUBJECTS.map(([sender, subject, time, unread], i) => (
        <div key={i} className={`grow${unread ? " unread" : ""}`}>
          <span className="gdot" />
          <span className="gs">{sender}</span>
          <span className="gj">{subject}</span>
          <span className="gt">{time}</span>
        </div>
      ))}
    </>
  );
}

const QUERIES = [
  {
    q: "Find the invoice Marcus sent before the holidays",
    html: `<div class="arow"><span class="afile">PDF</span><div><b>Marcus Reyes — Statement_Dec.pdf</b><br><span>Gmail · Dec 22, 2025 · "please see attached statement"</span></div></div>`,
  },
  {
    q: "What did I agree to with TechCorp last month?",
    html: `<div class="arow"><span class="afile" style="color:#7c7bf7">✦</span><div><span class="ac">You agreed to a <b style="color:#bdb9ff">14-day pilot</b> at no cost, renewing monthly unless cancelled. Confirmed by you on Apr 9.</span></div></div>`,
  },
  {
    q: "Has anyone mentioned this vendor before?",
    html: `<div class="arow"><span class="afile" style="color:#7c7bf7">✦</span><div><span class="ac">Yes — <b style="color:#bdb9ff">3 threads</b> across Outlook &amp; Gmail since 2023. Last flagged a late invoice in February.</span></div></div>`,
  },
];

export default function Page() {
  const navRef = useRef<HTMLElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const chaosRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<HTMLDivElement>(null);
  const qtRef = useRef<HTMLDivElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);
  const answerRowRef = useRef<HTMLDivElement>(null);
  const searchStageRef = useRef<HTMLDivElement>(null);
  const proofRef = useRef<HTMLElement>(null);
  const finalCardRef = useRef<HTMLDivElement>(null);

  const [signupDone, setSignupDone] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => { document.documentElement.classList.add("js"); }, []);

  /* custom cursor */
  useEffect(() => {
    const dot = document.getElementById("cdot") as HTMLDivElement;
    const ring = document.getElementById("cring") as HTMLDivElement;
    if (!dot || !ring) return;
    let rx = innerWidth / 2, ry = innerHeight / 2;
    let curX = rx, curY = ry;
    const onMove = (e: MouseEvent) => {
      curX = e.clientX; curY = e.clientY;
      dot.style.transform = `translate(${curX}px,${curY}px) translate(-50%,-50%)`;
    };
    let raf: number;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      rx += (curX - rx) * 0.18;
      ry += (curY - ry) * 0.18;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
    };
    raf = requestAnimationFrame(loop);
    window.addEventListener("mousemove", onMove);
    const hotEls = document.querySelectorAll("a,button,input,[data-hot]");
    hotEls.forEach(el => {
      el.addEventListener("mouseenter", () => ring.classList.add("hot"));
      el.addEventListener("mouseleave", () => ring.classList.remove("hot"));
    });
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf); };
  }, []);

  /* calm motes */
  useEffect(() => {
    const motes = document.getElementById("calmMotes");
    if (!motes) return;
    let html = "";
    for (let i = 0; i < 26; i++) {
      const left = Math.random() * 100;
      const ms = 12 + Math.random() * 14;
      const md = -Math.random() * ms;
      const sz = 2 + Math.random() * 3;
      const mx = ((Math.random() * 60 - 30) | 0);
      const mo = (0.35 + Math.random() * 0.5).toFixed(2);
      html += `<span class="calm-mote" style="left:${left}%;width:${sz}px;height:${sz}px;--ms:${ms.toFixed(1)}s;--md:${md.toFixed(1)}s;--mx:${mx}px;--mo:${mo}"></span>`;
    }
    motes.innerHTML = html;
  }, []);

  /* nav show on scroll */
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const fn = () => nav.classList.toggle("show", scrollY > innerHeight * 0.6);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* hero parallax + chaos->calm */
  useEffect(() => {
    const hero = heroRef.current;
    const chaos = chaosRef.current;
    const scanner = scannerRef.current;
    if (!hero || !chaos || !scanner) return;
    const layers = [...hero.querySelectorAll<HTMLDivElement>(".layer")];
    const reduceMo = matchMedia("(prefers-reduced-motion:reduce)").matches;
    let scanFired = false, ticking = false;
    const state = layers.map(() => ({ sy: 0, mx: 0, my: 0 }));
    const apply = (l: HTMLDivElement, s: { sy: number; mx: number; my: number }) => {
      l.style.transform = `translate3d(${s.mx}px,${s.sy + s.my}px,0)`;
    };
    const onScroll = () => {
      const p = Math.min(1, Math.max(0, scrollY / (innerHeight * 0.85)));
      chaos.style.setProperty("--chaos", p.toFixed(3));
      hero.style.setProperty("--chaos", p.toFixed(3));
      if (p >= 0.97 && !scanFired && !reduceMo) {
        scanFired = true;
        scanner.classList.remove("run"); void scanner.offsetWidth; scanner.classList.add("run");
      }
      if (p < 0.5 && scanFired) { scanFired = false; scanner.classList.remove("run"); }
      layers.forEach((l, i) => { state[i].sy = scrollY * parseFloat(l.dataset.depth || "0"); apply(l, state[i]); });
      ticking = false;
    };
    const schedule = () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } };
    window.addEventListener("scroll", schedule);
    onScroll();
    const onMove = (e: MouseEvent) => {
      const cx = e.clientX / innerWidth - 0.5, cy = e.clientY / innerHeight - 0.5;
      layers.forEach((l, i) => { const f = i * i * 10 + 6; state[i].mx = cx * f; state[i].my = cy * f * 0.45; apply(l, state[i]); });
      chaos.style.transform = `rotateY(${cx * 3.4}deg) rotateX(${-cy * 2.2}deg)`;
    };
    hero.addEventListener("mousemove", onMove);
    return () => { window.removeEventListener("scroll", schedule); hero.removeEventListener("mousemove", onMove); };
  }, []);

  /* calm aurora parallax */
  useEffect(() => {
    const sec = document.querySelector<HTMLElement>(".reveal-sec");
    const auroras = [...document.querySelectorAll<HTMLElement>(".calm-aurora")];
    if (!sec || !auroras.length || matchMedia("(prefers-reduced-motion:reduce)").matches) return;
    const onMove = (e: MouseEvent) => {
      const r = sec.getBoundingClientRect();
      const cx = e.clientX / r.width - 0.5, cy = (e.clientY - r.top) / r.height - 0.5;
      auroras.forEach(a => { const d = parseFloat(a.dataset.cp || "24"); a.style.translate = `${cx * d}px ${cy * d * 0.7}px`; });
    };
    const onLeave = () => auroras.forEach(a => (a.style.translate = "0 0"));
    sec.addEventListener("mousemove", onMove);
    sec.addEventListener("mouseleave", onLeave);
    return () => { sec.removeEventListener("mousemove", onMove); sec.removeEventListener("mouseleave", onLeave); };
  }, []);

  /* IntersectionObserver reveals */
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }),
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );
    document.querySelectorAll(".reveal,.tilt,.feat,.glow-in,.sec-cards,.calm,#proof").forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* animated search */
  useEffect(() => {
    const stage = searchStageRef.current, qt = qtRef.current, answer = answerRef.current, row = answerRowRef.current;
    if (!stage || !qt || !answer || !row) return;
    let qi = 0, started = false;
    let tid: ReturnType<typeof setTimeout>;
    const typeQuery = (text: string, cb: () => void) => {
      qt.innerHTML = '<span class="caret"></span>';
      let i = 0;
      const tick = () => {
        qt.innerHTML = text.slice(0, i) + '<span class="caret"></span>';
        if (i++ <= text.length) tid = setTimeout(tick, 28); else tid = setTimeout(cb, 500);
      };
      tick();
    };
    const cycle = () => {
      const item = QUERIES[qi];
      answer.classList.remove("show");
      typeQuery(item.q, () => {
        row.innerHTML = item.html;
        answer.classList.add("show");
        tid = setTimeout(() => { qi = (qi + 1) % QUERIES.length; cycle(); }, 3200);
      });
    };
    const sio = new IntersectionObserver(
      es => es.forEach(e => { if (e.isIntersecting && !started) { started = true; cycle(); } }),
      { threshold: 0.4 }
    );
    sio.observe(stage);
    return () => { sio.disconnect(); clearTimeout(tid); };
  }, []);

  /* count-up proof bar */
  useEffect(() => {
    const proof = proofRef.current;
    if (!proof) return;
    const nums = [...proof.querySelectorAll<HTMLElement>(".num")];
    const sigs = [...proof.querySelectorAll<HTMLElement>(".proof-sig")];
    const reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
    const finalVal = (n: HTMLElement) => parseInt(n.dataset.count!, 10) + (n.dataset.suffix || "");
    if (reduce) { nums.forEach(n => (n.textContent = finalVal(n))); sigs.forEach(s => s.classList.add("lit")); return; }
    let done = false;
    const easeOut = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
    const pio = new IntersectionObserver(es => {
      es.forEach(e => {
        if (e.isIntersecting && !done) {
          done = true; pio.unobserve(e.target);
          const dur = 900, start = performance.now();
          const frame = (now: number) => {
            const t = Math.min(1, (now - start) / dur), v = easeOut(t);
            nums.forEach(n => (n.textContent = Math.round(v * parseInt(n.dataset.count!, 10)) + (n.dataset.suffix || "")));
            if (t < 1) requestAnimationFrame(frame);
            else { nums.forEach(n => (n.textContent = finalVal(n))); sigs.forEach((s, i) => setTimeout(() => s.classList.add("lit"), i * 80)); }
          };
          requestAnimationFrame(frame);
        }
      });
    }, { threshold: 0.4 });
    pio.observe(proof);
    return () => pio.disconnect();
  }, []);

  const handleCardTilt = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = finalCardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y - rect.height / 2) / (rect.height / 2)) * -9;
    const ry = ((x - rect.width  / 2) / (rect.width  / 2)) *  9;
    card.style.transition = "transform 0.08s ease-out";
    card.style.transform = `perspective(1100px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.025,1.025,1.025)`;
  };

  const handleCardLeave = () => {
    const card = finalCardRef.current;
    if (!card) return;
    card.style.transition = "transform 0.65s cubic-bezier(0.16,1,0.3,1)";
    card.style.transform = "perspective(1100px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError("");

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      const inp = document.querySelector<HTMLInputElement>(".signup input");
      if (inp) inp.style.borderColor = "#ea4335";
      return;
    }

    setSignupLoading(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setSignupDone(true);
      } else {
        setSignupError(data.error ?? "Something went wrong. Try again.");
      }
    } catch {
      setSignupError("Network error. Please try again.");
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <>
      <div className="cursor-dot" id="cdot" />
      <div className="cursor-ring" id="cring" />
      <div id="scanner" ref={scannerRef} />

      {/* NAV */}
      <nav className="nav" ref={navRef}>
        <div className="brand"><Image src="/logo.svg" alt="LiwiLabs" width={120} height={36} style={{ height: 32, width: "auto" }} priority unoptimized /></div>
        <a className="nav-cta" href="#waitlist" data-hot="">Join the waitlist</a>
      </nav>

      {/* S1 CHAOS HERO */}
      <section className="hero" id="hero" ref={heroRef}>
        <div className="chaos" id="chaos" ref={chaosRef}>
          <div className="layer" data-depth="0.18">
            <div className="ghost-inbox"><GhostRows /></div>
          </div>
          <div className="layer" data-depth="0">
            <div className="toast t-gmail"><span className="ic">M</span><div className="tt"><b>Gmail</b><span>RE: RE: RE: RE: Q3 planning</span></div><span className="badge">247</span></div>
            <div className="toast t-outlook"><span className="ic">O</span><div className="tt"><b>Outlook · Work</b><span>ACTION REQUIRED (sent 3 weeks ago)</span></div><span className="badge">1,891</span></div>
            <div className="toast t-icloud"><span className="ic">@</span><div className="tt"><b>iCloud Mail</b><span>Your storage is almost full</span></div><span className="badge">43</span></div>
            <div className="toast t-cal"><span className="ic">31</span><div className="tt"><b>Calendar</b><span>&ldquo;Quick sync&rdquo; · in 5 minutes</span></div><span className="badge">9</span></div>
            <div className="toast t-slack"><span className="ic">#</span><div className="tt"><b>Slack</b><span>&ldquo;did you see my email?&rdquo;</span></div><span className="badge">12</span></div>
            <div className="toast t-receipt"><span className="ic">✓</span><div className="tt"><b>Read receipt</b><span>&ldquo;Q2 budget — please review&rdquo; opened just now · sent 6 months ago</span></div><span className="badge">1</span></div>
            <div className="toast t-noreply"><span className="ic">⊘</span><div className="tt"><b>no-reply@notifications.kr</b><span>Do not reply to this message.</span></div></div>
          </div>
          <div className="layer" data-depth="-0.3">
            <div className="front-card attach">
              <div className="file">PDF</div>
              <div className="meta"><b>FINAL_v3_USE_THIS_ONE_<br />NOT_THE_OTHER_v3.pdf</b><span>2.4 MB · downloaded 6×</span></div>
            </div>
            <div className="front-card replyall">
              <h4>Reply to all 47 recipients?</h4>
              <p>This conversation includes the entire company, two vendors, and someone who left in 2021.</p>
              <div className="btns"><button>Just sender</button><button className="yes">Reply all</button></div>
            </div>
            <div className="front-card invite">
              <div className="when">THU · 2:00 PM</div>
              <b>&ldquo;This will only take 5 minutes&rdquo;</b>
              <s>5 minutes</s>&nbsp;<span className="dur">→ now 45 minutes</span>
            </div>
            <div className="front-card invite2">
              <div className="when">MON · 9:00 – 11:00 AM</div>
              <b>Quick Sync</b>
              <span className="dur">2 hours · no agenda · 11 guests</span>
            </div>
          </div>
        </div>
        <div className="hero-vig" />
        <div className="hero-scan" />
        <div className="hero-copy">
          <h1>Your inbox has been<br />broken since <span className="em">1995.</span></h1>
          <p className="sub">We just didn&apos;t notice because the bar was this low.</p>
        </div>
        <div className="scroll-hint"><span>Scroll</span><span className="line" /></div>
      </section>

      {/* S2 REVEAL */}
      <section className="reveal-sec">
        <div className="calm" aria-hidden="true">
          <div className="calm-aurora a1" data-cp="22" />
          <div className="calm-aurora a2" data-cp="38" />
          <div className="calm-aurora a3" data-cp="30" />
          <div className="calm-core" />
          <div className="calm-floor" />
          <div id="calmMotes" />
          {([
            { cls: "c1", dur: "7.5s", d: "0s", ci: "G", label: "Gmail", sub: "247 sorted · 3 for you" },
            { cls: "c2", dur: "9s", d: ".4s", ci: "31", label: "Calendar", sub: "Booked itself" },
            { cls: "c3", dur: "8.2s", d: ".8s", ci: "↩", label: "Follow-up", sub: "Drafted & sent" },
            { cls: "c4", dur: "8.6s", d: ".2s", ci: "O", label: "Outlook · Work", sub: "Nothing urgent" },
            { cls: "c5", dur: "7.8s", d: ".6s", ci: "$", label: "Q2 budget", sub: "Replied for you" },
            { cls: "c6", dur: "9.4s", d: "1s", ci: "@", label: "iCloud", sub: "Archived" },
          ] as const).map(({ cls, dur, d, ci, label, sub }) => (
            <div key={cls} className={`calm-card ${cls}`} style={{ "--dur": dur, "--d": d } as React.CSSProperties}>
              <span className="done">✓</span>
              <div className="cc-inner"><span className="ci">{ci}</span><div><b>{label}</b><span className="r">{sub}</span></div></div>
            </div>
          ))}
        </div>
        <div className="wrap">
          <div className="reveal"><div className="this-is">This is Kross.</div></div>
          <div className="reveal d1"><div className="kross-mark"><Image src="/logo.svg" alt="LiwiLabs" width={280} height={280} style={{ height: 180, width: "auto" }} unoptimized /></div></div>
          <div className="reveal d2">
            <p className="tagline">Cross-connect your email with AI. <span className="g">One inbox. Every account. Zero chaos.</span></p>
          </div>
          <div className="reveal d2">
            <div className="cta-row">
              <a className="btn-primary" href="#waitlist" data-hot="">Join the waitlist</a>
              <span className="fineprint">No credit card. No spam. Just early access.</span>
            </div>
          </div>
          <div className="reveal-screenshot reveal d3 tilt">
            <div className="device">
              <div className="device-bar"><i /><i /><i /><span className="fn">kross — conversations</span></div>
              <Image src="/inbox-chat.png" alt="Kross chat-style inbox" width={1000} height={600} style={{ width: "100%", height: "auto" }} />
              <div className="device-glow" />
            </div>
          </div>
        </div>
      </section>

      {/* PROOF BAR */}
      <section className="proof" id="proof" ref={proofRef}>
        <div className="proof-wrap">
          <div className="proof-stats">
            <div className="proof-stat"><span className="num" data-count="28" data-suffix="%">0%</span><span className="lbl">Of your workweek. Lost to email. Every week.</span></div>
            <div className="proof-div" />
            <div className="proof-stat"><span className="num" data-count="121" data-suffix="">0</span><span className="lbl">Emails hit your inbox. Daily. On average.</span></div>
            <div className="proof-div" />
            <div className="proof-stat"><span className="num" data-count="11" data-suffix="×">0×</span><span className="lbl">Per hour. That&apos;s how often people check email.</span></div>
          </div>
          <div className="proof-split" />
          <div className="proof-trust">
            <span className="proof-sig"><span className="b">·</span> Built on AWS</span>
            <div className="proof-div" />
            <span className="proof-sig"><span className="b">·</span> End-to-end encrypted</span>
            <div className="proof-div" />
            <span className="proof-sig"><span className="b">·</span> AI runs on your infra. Not ours.</span>
            <div className="proof-div" />
            <span className="proof-sig"><span className="b">·</span> Native Gmail + Outlook OAuth</span>
          </div>
        </div>
      </section>

      {/* BACKERS STRIP */}
      <div className="backers">
        <div className="backers-wrap">
          <span className="backers-label">Backed by &amp; built on</span>
          <div className="backers-logos">


            {/* AWS for Startups */}
            <div className="backer">
              <FaAws size={36} style={{ color: "#FF9900" }} aria-hidden="true" />
              <span className="backer-name">AWS for Startups</span>
            </div>

            <div style={{ width: 1, alignSelf: "stretch", background: "var(--border)" }} />

            {/* GitHub for Startups */}
            <div className="backer">
              <FaGithub size={24} aria-hidden="true" />
              <span className="backer-name">GitHub for Startups</span>
            </div>

            <div style={{ width: 1, alignSelf: "stretch", background: "var(--border)" }} />

            {/* Azure AI Foundry */}
            <div className="backer">
              <BsMicrosoft size={22} style={{ color: "#00a4ef" }} aria-hidden="true" />
              <span className="backer-name">Azure AI Foundry</span>
            </div>


          </div>
        </div>
        <p className="backers-note">
          &ldquo;Backed by&rdquo; refers to startup credits and program support received from these organisations; not equity investment.
        </p>
      </div>

      <div className="divider"><div className="grid-plane" /></div>

      {/* S3 UNIFIED INBOX */}
      <section className="sec">
        <div className="sec-ghost"><GhostRows /></div>
        <div className="wrap feat">
          <div className="feat-copy reveal">
            <div className="eyebrow">One inbox</div>
            <h2 className="hook">Three email apps open.<br /><span className="lo">Still missed the one</span><br />that mattered.</h2>
          </div>
          <div className="reveal d1 tilt">
            <div className="device">
              <div className="device-bar"><i /><i /><i /><span className="fn">kross — all mail</span></div>
              <Image src="/inbox.png" alt="Kross unified inbox" width={800} height={500} style={{ width: "100%", height: "auto" }} />
            </div>
          </div>
        </div>
        <div className="wrap" style={{ marginTop: 40 }}>
          <p className="truth reveal d2" style={{ marginLeft: "auto", textAlign: "left" }}>
            Gmail for work. Outlook for the client. iCloud for personal. Three tabs. Three notification sounds. Three different search histories that all come up empty. <strong>Kross puts Gmail and Outlook in a single inbox.</strong> One app. One search. One AI that knows all of it.
          </p>
        </div>
      </section>

      <div className="divider"><div className="grid-plane" /></div>

      {/* S4 CHAT VIEW */}
      <section className="sec">
        <div className="sec-ghost"><GhostRows /></div>
        <div className="wrap feat flip">
          <div className="feat-copy reveal">
            <div className="eyebrow">Conversation view</div>
            <h2 className="hook">Nobody told email<br />it could <em>look</em><br />like this.</h2>
            <p className="truth" style={{ marginTop: 28 }}>Email has been a list of subject lines since the Clinton administration. <strong>Kross turns every email thread into a conversation</strong> — grouped by person, displayed like a chat. Toggle back to classic when you need it. Your call. Your inbox.</p>
          </div>
          <div className="reveal d1 tilt">
            <div className="device">
              <div className="device-bar"><i /><i /><i /><span className="fn">kross — conversation</span></div>
              <Image src="/inbox-chat.png" alt="Kross chat-style conversation" width={800} height={500} style={{ width: "100%", height: "auto" }} />
            </div>
          </div>
        </div>
      </section>

      <div className="divider"><div className="grid-plane" /></div>

      {/* S5 AI */}
      <section className="sec ai-center">
        <div className="sec-ghost"><GhostRows /></div>
        <div className="wrap">
          <div className="reveal">
            <div className="eyebrow"><span className="spk">✦</span> Intelligence</div>
            <h2 className="hook">You have 47 unread.<br /><span className="lo">Three of them actually matter.</span><br /><em>Good luck</em> finding them.</h2>
          </div>
          <p className="truth reveal d1">Kross scores every email 1–100 for urgency. Surfaces the three that need you today. Summarises the 34-message thread in three sentences. Drafts three replies in different tones — <strong>Direct, Friendly, Diplomatic.</strong> Pick one. Send. Done. <strong>Your inbox, curated. Not just delivered.</strong></p>
          <div className="ai-device reveal d2 tilt">
            <div className="device">
              <div className="device-bar"><i /><i /><i /><span className="fn">kross — intelligence panel</span></div>
              <Image src="/inbox-chat.png" alt="Kross AI intelligence panel" width={1060} height={640} style={{ width: "100%", height: "auto" }} />
            </div>
          </div>
          <div className="callouts">
            <article className="callout reveal d1"><div className="ch"><span className="spk">✦</span> Priority scoring</div><p>97. That&apos;s your CEO&apos;s email. The newsletter is a <b>4.</b></p></article>
            <article className="callout reveal d2"><div className="ch"><span className="spk">✦</span> Thread summary</div><p>34 emails. 3 sentences. <b>You know everything.</b></p></article>
            <article className="callout reveal d3"><div className="ch"><span className="spk">✦</span> Reply drafts</div><p>Direct. Friendly. Diplomatic. <b>One click to send.</b></p></article>
          </div>
        </div>
      </section>

      <div className="divider"><div className="grid-plane" /></div>

      {/* S6 CALENDAR */}
      <section className="sec">
        <div className="sec-ghost"><GhostRows /></div>
        <div className="wrap feat flip">
          <div className="feat-copy reveal">
            <div className="eyebrow">Scheduling</div>
            <h2 className="hook" style={{ fontSize: "clamp(32px,4.4vw,58px)" }}>Can we find a time?<br /><span className="lo">What works for you?</span><br />How about Thursday?<br />I&apos;m free Thursday.<br /><em>Wait, not that Thursday.</em></h2>
            <p className="truth" style={{ marginTop: 28 }}>Kross has a scheduling link that lives inside your email client. No Calendly tab. No back-and-forth. Someone asks for a meeting — you send the link. They pick a time. It&apos;s on your calendar. <strong>You did nothing.</strong> Kross also reads your email history before every meeting so you walk in prepared.</p>
          </div>
          <div className="reveal d1 tilt">
            <div className="device">
              <div className="device-bar"><i /><i /><i /><span className="fn">kross — calendar</span></div>
              <Image src="/calendar.png" alt="Kross calendar" width={800} height={500} style={{ width: "100%", height: "auto" }} />
            </div>
          </div>
        </div>
      </section>

      <div className="divider"><div className="grid-plane" /></div>

      {/* S7 AGENTS */}
      <section className="sec">
        <div className="sec-ghost"><GhostRows /></div>
        <div className="wrap feat">
          <div className="feat-copy reveal">
            <div className="eyebrow"><span className="spk">✦</span> Agents</div>
            <h2 className="hook">You said you&apos;d<br />follow up.<br /><span className="lo">You didn&apos;t follow up.</span><br />You <em>know</em> you didn&apos;t<br />follow up.</h2>
          </div>
          <div className="reveal d1 tilt glow-in">
            <div className="device">
              <div className="device-bar"><i /><i /><i /><span className="fn">kross — ai insight</span></div>
              <Image src="/message-detail.png" alt="Kross message detail" width={800} height={500} style={{ width: "100%", height: "auto" }} />
              <div className="device-glow" />
            </div>
          </div>
        </div>
        <div className="wrap" style={{ marginTop: 42 }}>
          <p className="truth reveal d1" style={{ maxWidth: "70ch" }}>Kross watches your sent mail. No reply in 5 days — it drafts the follow-up and asks if you want to send it. Or describe any workflow in plain English and Kross builds an agent that runs it every time the trigger fires. <strong>No code. No Zapier.</strong> You described it once. It runs forever.</p>
          <div className="micro2">
            <div className="m reveal d1"><b>Built-in agents</b><p>Triage, scheduling, follow-up, meeting prep. Running before you open the app.</p></div>
            <div className="m reveal d2"><b>Custom agents</b><p>Type it in plain English. Kross builds it. It runs forever.</p></div>
          </div>
        </div>
      </section>

      <div className="divider"><div className="grid-plane" /></div>

      {/* S8 SEARCH */}
      <section className="sec search-sec">
        <div className="sec-ghost"><GhostRows /></div>
        <div className="wrap">
          <div className="reveal"><div className="eyebrow" style={{ justifyContent: "center" }}><span className="spk">✦</span> Second brain</div></div>
          <h2 className="hook reveal d1" style={{ textAlign: "center", maxWidth: "18ch", margin: "0 auto" }}>That invoice Marcus sent.<br /><span className="lo">Before the thing.</span><br />You know the one.</h2>
          <p className="truth reveal d1" style={{ margin: "28px auto 0", textAlign: "center", maxWidth: "64ch" }}>Kross searches your entire email history in plain English across every connected account. Not keyword search. <strong>Meaning search.</strong> It finds it even if it says &ldquo;please see attached statement&rdquo; and was sent December 22nd. Ask it what you agreed to with anyone. It knows.</p>
          <div className="search-stage reveal d2" id="searchStage" ref={searchStageRef}>
            <div className="search-bar">
              <svg className="si" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
              <div className="qt" id="qt" ref={qtRef}><span className="caret" /></div>
            </div>
            <div className="answer" id="answer" ref={answerRef}>
              <div className="alabel"><span className="spk">✦</span> Found it</div>
              <div id="answerRow" ref={answerRowRef} />
            </div>
          </div>
        </div>
      </section>

      <div className="divider"><div className="grid-plane" /></div>

      {/* S9 SECURITY */}
      <section className="sec security">
        <div className="sec-ghost"><GhostRows /></div>
        <div className="wrap">
          <div className="sec-head reveal">
            <div className="eyebrow" style={{ justifyContent: "center" }}>Security</div>
            <h2 className="hook" style={{ width: 300 }}>We built Kross so that <em>even we</em> can&apos;t read your emails.</h2>
          </div>
          <div className="sec-cards">
            <article className="sec-card reveal d1">
              <div className="sk"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg></div>
              <h3>Zero-knowledge encryption</h3>
              <p>Your key. Your emails. Mathematically unreadable without you.</p>
            </article>
            <article className="sec-card reveal d2">
              <div className="sk"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></svg></div>
              <h3>Self-hosted AI</h3>
              <p>Your email never touches OpenAI, Anthropic, or Google. It never leaves Kross infrastructure.</p>
            </article>
            <article className="sec-card reveal d3">
              <div className="sk"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" /></svg></div>
              <h3>GDPR compliant</h3>
              <p>EU data stays in eu-west-1. We didn&apos;t make you choose. You don&apos;t have to ask.</p>
            </article>
          </div>
        </div>
      </section>

      <div className="divider"><div className="grid-plane" /></div>

      {/* S10 ONBOARDING */}
      <section className="sec">
        <div className="sec-ghost"><GhostRows /></div>
        <div className="wrap feat">
          <div className="feat-copy reveal">
            <div className="eyebrow">Setup</div>
            <h2 className="hook">Three apps.<br />One sign-in.<br /><span className="lo">Takes 30 seconds.</span><br /><em>We timed it.</em></h2>
            <p className="truth" style={{ marginTop: 28 }}>Connect Gmail, Outlook, or both. Kross normalises everything into one workspace. Your emails look the same. Your AI works the same. Your data stays encrypted. <strong>Nothing changes except the chaos.</strong></p>
          </div>
          <div className="providers">
            <article className="prov s1">
              <div className="pic"><svg viewBox="0 0 24 24" width="32" height="32"><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.7-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z"/><path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1C3.4 21.3 7.4 24 12 24z"/><path fill="#FBBC05" d="M5.4 14.3c-.2-.7-.4-1.5-.4-2.3s.1-1.6.4-2.3V6.6H1.4C.5 8.2 0 10 0 12s.5 3.8 1.4 5.4l4-3.1z"/><path fill="#EA4335" d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4C17.9 1.2 15.2 0 12 0 7.4 0 3.4 2.7 1.4 6.6l4 3.1C6.3 6.9 8.9 4.8 12 4.8z"/></svg></div>
              <b>Google</b><span>Connect your Gmail accounts</span>
            </article>
            <article className="prov s2">
              <div className="pic"><svg viewBox="0 0 24 24" width="30" height="30"><rect x="1" y="1" width="10" height="10" fill="#F25022"/><rect x="13" y="1" width="10" height="10" fill="#7FBA00"/><rect x="1" y="13" width="10" height="10" fill="#00A4EF"/><rect x="13" y="13" width="10" height="10" fill="#FFB900"/></svg></div>
              <b>Microsoft</b><span>Connect Outlook or Office 365</span>
            </article>
            <article className="prov s3">
              <div className="pic"><svg viewBox="0 0 24 24" width="28" height="28" fill="#f4f3f7"><path d="M17.05 12.5c-.03-2.5 2.04-3.7 2.13-3.76-1.16-1.7-2.97-1.93-3.61-1.96-1.54-.16-3 .9-3.78.9-.78 0-1.98-.88-3.25-.86-1.67.02-3.21.97-4.07 2.47-1.74 3.02-.44 7.5 1.24 9.95.82 1.2 1.8 2.55 3.08 2.5 1.24-.05 1.7-.8 3.2-.8 1.49 0 1.91.8 3.21.78 1.33-.02 2.17-1.22 2.98-2.43.94-1.39 1.33-2.74 1.35-2.81-.03-.01-2.59-.99-2.62-3.94zM14.6 4.9c.68-.83 1.14-1.98.01-3.13-.99.07-2.19.66-2.89 1.48-.63.73-1.18 1.9-1.03 3.02 1.1.09 2.23-.56 2.9-1.37z"/></svg></div>
              <b>Apple</b><span>Connect iCloud Mail</span>
            </article>
          </div>
        </div>
        <div className="wrap reveal d1 tilt" style={{ marginTop: 60, maxWidth: 1000 }}>
          <div className="device">
            <div className="device-bar"><i /><i /><i /><span className="fn">kross — connect</span></div>
            <Image src="/onboarding.png" alt="Kross onboarding" width={1000} height={600} style={{ width: "100%", height: "auto" }} />
          </div>
        </div>
      </section>

      {/* S11 FINAL CTA */}
      <section className="final" id="waitlist">
        <div className="final-ghost"><GhostRows /></div>
        {/* chaos text fragments scattered around the card */}
        <div className="final-chaos-frags" aria-hidden="true">
          <span style={{ position: "absolute", top: "9%",    left: "6%" }}>Re: Q4 budget review (urgent)</span>
          <span style={{ position: "absolute", top: "16%",   right: "5%" }}>Fwd: Fwd: Fwd: Action required</span>
          <span style={{ position: "absolute", top: "28%",   left: "3%" }}>You have 847 unread emails</span>
          <span style={{ position: "absolute", top: "38%",   right: "3%" }}>Can we hop on a call?</span>
          <span style={{ position: "absolute", top: "10%",   left: "36%" }}>No subject</span>
          <span style={{ position: "absolute", bottom: "30%",left: "4%" }}>Meeting rescheduled again</span>
          <span style={{ position: "absolute", bottom: "22%",right: "6%" }}>RE: RE: RE: RE: Following up</span>
          <span style={{ position: "absolute", bottom: "14%",left: "16%" }}>URGENT: please respond</span>
          <span style={{ position: "absolute", bottom: "9%", right: "18%" }}>Unsubscribe from this list</span>
          <span style={{ position: "absolute", top: "70%",   right: "3%" }}>Your invoice is overdue</span>
          <span style={{ position: "absolute", top: "54%",   left: "2%" }}>Sorry for the delay—</span>
          <span style={{ position: "absolute", bottom: "40%",right: "14%" }}>just checking in</span>
        </div>
        <div className="final-card-area">
          {/* LEFT calm column */}
          <div className="final-pops-col" aria-hidden="true">
            <div className="calm-pop" style={{ animationDelay: "0s" }}>
              <span className="calm-icon">✦</span>
              <strong>Inbox Zero</strong>
              847 → 0. Finally.
            </div>
            <div className="calm-pop" style={{ animationDelay: "0.8s" }}>
              <span className="calm-icon">◉</span>
              <strong>Thread summarized</strong>
              34 emails → 3 lines.
            </div>
            <div className="calm-pop" style={{ animationDelay: "1.6s" }}>
              <span className="calm-icon">✓</span>
              <strong>Follow-up sent</strong>
              Kross handled it.
            </div>
          </div>

          {/* CARD */}
          <div className="final-card" ref={finalCardRef} onMouseMove={handleCardTilt} onMouseLeave={handleCardLeave}>
            <h2 className="reveal">Your inbox is<br />ready to <span className="em think-word">think.</span></h2>
            <p className="fsub reveal d1">Join the waitlist. Be first when Kross launches.</p>
            <form className="signup reveal d2" onSubmit={handleSignup}>
              <input
                type="email"
                placeholder="you@company.com"
                aria-label="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <button
                className="btn-primary"
                data-hot=""
                type="submit"
                disabled={signupLoading || signupDone}
                style={signupDone ? { background: "#3f8f5b" } : {}}
              >
                {signupDone ? "You're on the list ✦" : signupLoading ? "Joining…" : "Join the waitlist"}
              </button>
            </form>
            {signupError && (
              <p className="fineprint" style={{ marginTop: 12, color: "#c0392b" }}>{signupError}</p>
            )}
            <p className="fineprint reveal d2" style={{ marginTop: 18 }}>No spam. No credit card. Just early access.</p>
          </div>

          {/* RIGHT calm column */}
          <div className="final-pops-col" aria-hidden="true">
            <div className="calm-pop" style={{ animationDelay: "2.4s" }}>
              <span className="calm-icon">⏱</span>
              <strong>2 hrs back today</strong>
              Focus on what counts.
            </div>
            <div className="calm-pop" style={{ animationDelay: "3.2s" }}>
              <span className="calm-icon">◎</span>
              <strong>Meeting prepped</strong>
              10-min brief ready.
            </div>
            <div className="calm-pop" style={{ animationDelay: "4s" }}>
              <span className="calm-icon">✦</span>
              <strong>AI sorted 44</strong>
              3 actually need you.
            </div>
          </div>
        </div>
      </section>

      <footer className="foot">
        <div className="fb"><Image src="/logo.svg" alt="LiwiLabs" width={80} height={24} style={{ height: 22, width: "auto" }} unoptimized /></div>
        One inbox. Every account. Zero chaos.
      </footer>
    </>
  );
}
