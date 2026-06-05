# Kross — Full Feature List for Tweet Generation

App: Kross
Tagline: Cross-connect your email with AI. One inbox. Every account. Zero chaos.
Category: AI-powered email and calendar client
Target audience: Founders, PMs, developers, executives, remote teams, anyone drowning in email

---

## INSTRUCTIONS FOR TWEET AI

Generate tweets that are punchy, specific, and benefit-led. Lead with the pain, land on the feature.
Use real user scenarios wherever possible. Avoid generic tech buzzwords.
Kross tone: smart, confident, slightly irreverent. Think Linear meets Superhuman.
Each feature below includes: what it does, the use case, and a concrete example.
Write tweets in first or second person. Keep under 280 characters unless it is a thread.

---

## 1. CORE CONCEPT & UI

### Chat-style inbox (default view)
What it does: Displays emails as iMessage-style chat bubbles grouped by contact instead of a traditional list.
Use case: People who live in Slack and iMessage feel immediate familiarity. Email becomes a conversation, not a document.
Example: Instead of 47 subject lines from Marcus, you see one conversation thread with Marcus — exactly like texting him.
Tweet angle: Email has looked the same since 1995. We fixed that.

### Classic email toggle
What it does: One click switches between chat view and traditional email list view. State persists across sessions.
Use case: Users who need to switch context — scanning for a specific subject line, or forwarding to someone who needs a traditional format.
Example: You are in a meeting and need to quickly scan subject lines. One tap flips the inbox back to classic view. Tap again, back to chat.
Tweet angle: We didn't force you to commit. Toggle between chat and classic email anytime.

### Unified inbox across all providers
What it does: Gmail and Outlook both appear in a single inbox. No switching apps. No context switching.
Use case: Anyone with multiple email accounts — work Gmail, personal Outlook, side project email — all in one place.
Example: Your 9am standup invite is on Outlook. Your client's reply is on Gmail. Kross shows them both in one thread stream.
Tweet angle: Two email providers. One inbox. Finally.

### Per-account color indicators
What it does: Every thread and contact shows a small icon indicating which email provider it came from — Gmail or Outlook.
Use case: At a glance you always know which account to reply from, without opening the thread.
Example: You see a thread from Sarah with a small Gmail icon. You know immediately you are in your work account.
Tweet angle: You always know which hat you are wearing.

### Compose window with tone selector
What it does: When drafting a reply, a tone selector lets you choose between Formal, Friendly, and Direct before the AI drafts.
Use case: You need to write a rejection email to a vendor but a warm reply to a client in the same five minutes.
Example: Select "Diplomatic" and the AI drafts a polite decline. Select "Direct" and it writes two sentences. Same email, different energy.
Tweet angle: Pick the energy. Let Kross write the words.

### Large file sharing — no size cap
What it does: Attach and send files of any size via cloud-to-cloud transfer through S3. No 25MB Gmail limit. No Dropbox links.
Use case: Designers, video editors, lawyers, anyone who sends large assets or documents.
Example: Attach a 2GB design file directly in Kross. The recipient gets a secure link that streams directly from S3. No WeTransfer. No Dropbox.
Tweet angle: Stop sending Dropbox links. Kross has no file size limit.

### Real-time email push (WebSocket)
What it does: New emails appear instantly in the inbox the moment they arrive, like a chat message, without refreshing.
Use case: Anyone waiting on a time-sensitive reply — a job offer, a contract approval, a client decision.
Example: You are staring at your inbox waiting for a reply from your investor. The message appears mid-sentence as you type something else. No refresh.
Tweet angle: Email that arrives like a text message.

---

## 2. INBOX INTELLIGENCE

### Priority scoring
What it does: AI scores every email from 1–100 based on urgency, sender relationship, time sensitivity, and your historical reply patterns. Learns your habits over time.
Use case: Anyone who gets 200+ emails a day and needs to triage without reading everything.
Example: An email from your CEO with "urgent" in the subject scores 97. A newsletter from a SaaS tool you haven't opened in 6 months scores 4. The 97 is at the top. The 4 disappears.
Tweet angle: Your inbox ranked by what actually matters. Not by arrival time.

### Smart categorization
What it does: AI categorizes every thread into four buckets — Action Required, Waiting On Someone, FYI Only, and Noise. No manual labelling.
Use case: Weekly inbox zero reviews, daily triage, delegation decisions.
Example: The contract your lawyer sent sits in Action Required. The email you sent your designer sits in Waiting On Someone. The company all-hands invite sits in FYI. The product update email sits in Noise.
Tweet angle: Four buckets. Every email sorted. Zero effort.

### Thread summarization
What it does: Long back-and-forth threads are collapsed with a 2-3 sentence AI summary at the top before you read them.
Use case: Returning from vacation, catching up on a thread you were CC'd on, deciding whether to read the full chain.
Example: A 34-message thread about the Q3 roadmap shows: "The team agreed to delay the mobile feature to Q4. Marcus is leading the API work. Decision pending on the design timeline." You know everything without reading anything.
Tweet angle: 34 emails summarized in 3 sentences. You are welcome.

### Noise detection and auto-cleanup
What it does: AI identifies newsletters, automated notifications, and low-engagement emails you never open, and quietly moves them out of your main view.
Use case: Anyone subscribed to 40 newsletters they haven't read since 2022.
Example: Kross notices you have not opened a single email from five SaaS product newsletters in three months. It moves them to a Noise folder and asks if you want to unsubscribe. One click, done.
Tweet angle: Kross noticed you never read those emails. It handled it.

---

## 3. COMPOSITION & REPLIES

### AI reply suggestions with tone options
What it does: For every received email, Kross surfaces three draft replies — Direct, Friendly, and Diplomatic — that you can send, edit, or reject with one click.
Use case: High-volume email days, decision fatigue, awkward conversations you keep putting off.
Example: A client emails asking why the deliverable is late. Kross surfaces: (1) a direct explanation with the revised date, (2) a warmer version with an apology and context, (3) a diplomatic version asking for a quick call. You pick one and send in 10 seconds.
Tweet angle: Three replies waiting for you. Pick one, send, done.

### Tone matching per contact
What it does: AI learns how you write to each specific person — your register, vocabulary, typical length — and matches it when drafting replies on your behalf.
Use case: You write to your investors differently than your team. You write to clients differently than your co-founder. Kross learns that.
Example: You always write to Tom in short punchy sentences with no pleasantries. Kross drafts all Tom replies the same way without you telling it to.
Tweet angle: Kross writes like you. For every person, in every tone.

### Follow-up reminders with drafted follow-up
What it does: If you sent an email and got no reply after a set number of days, Kross surfaces a drafted follow-up and asks if you want to send it.
Use case: Sales follow-ups, contractor reminders, client approvals sitting in limbo.
Example: You sent a proposal to a client 5 days ago. No reply. Kross surfaces: "Hi James, just circling back on the proposal I sent last Tuesday — happy to jump on a call if easier." One click to send.
Tweet angle: You forgot to follow up. Kross didn't.

---

## 4. DOCUMENT INTELLIGENCE

### Attachment summarization
What it does: Any PDF, Word doc, or spreadsheet attached to an email is automatically summarized in plain English before you open it.
Use case: Lawyers reviewing contracts, executives reviewing proposals, anyone sent a 40-page document.
Example: A vendor sends a 60-page contract. Kross shows: "Standard SaaS agreement. Key points: 12-month term, auto-renews, 30-day cancellation notice, includes data processing addendum." You know if it is worth your time before opening it.
Tweet angle: 60-page contract. 4-sentence summary. Kross read it so you don't have to.

### Action extraction from documents
What it does: AI reads attachments and automatically extracts tasks, deadlines, and commitments.
Use case: Project briefs, meeting notes, contracts with obligations, investor updates requiring response.
Example: A project brief lands in your inbox. Kross extracts: "Deliver wireframes by June 14. Review brand guidelines by June 7. Sign NDA before kickoff." Three tasks surfaced. Nothing missed.
Tweet angle: The document said you had three deadlines. Kross found them before you did.

### Document comparison
What it does: Upload two versions of a document and get a plain-English summary of what changed between them.
Use case: Contract redlines, proposal revisions, updated specs from a client.
Example: Your lawyer sends the revised contract. Kross compares v1 and v2 and tells you: "Liability cap changed from $50k to $100k. Payment terms changed from Net30 to Net15. Section 8.3 removed entirely." You see exactly what changed without reading both.
Tweet angle: They sent back the redlines. Kross told you what actually changed.

### Chat Q&A against attachments ("ask your docs")
What it does: Ask natural language questions about any attachment in your inbox and get an instant answer without opening the file.
Use case: Finding specific clauses in a contract, checking numbers in a report, understanding a technical spec.
Example: "What is the termination clause in the contract Sarah sent?" Kross: "Either party can terminate with 30 days written notice. Immediate termination is permitted for material breach." You never opened the file.
Tweet angle: "What does clause 14 say?" Kross: "Here's the answer." You never opened the PDF.

---

## 5. CALENDAR & SCHEDULING

### Unified calendar (Google + Microsoft)
What it does: All your Google and Microsoft calendar events appear in a single calendar view inside Kross. No switching between Google Calendar and Outlook calendar.
Use case: Professionals with both a Google workspace and a Microsoft workspace — common in enterprise, consulting, and agency contexts.
Example: Your Google Calendar standup and your Outlook client review appear side by side in Kross. One view. No conflicts hidden in a different app.
Tweet angle: Your Google calendar and your Outlook calendar. Finally in the same place.

### Native Calendly-style scheduling links
What it does: Generate a personal scheduling link inside Kross. Share it in any email. Recipients pick a slot from your real-time availability. Meeting auto-created.
Use case: Sales calls, onboarding sessions, 1:1s with new contacts — any meeting where you normally play email ping-pong to find a time.
Example: Instead of "what works for you?" back and forth, you type "Here's my link: kross.app/meet/you" at the bottom of an email. They pick Thursday 3pm. Done.
Tweet angle: No more "does Tuesday work for you?" — just send your Kross link.

### AI availability suggestions
What it does: When someone asks to meet, Kross suggests genuinely good meeting times — not just open slots, but slots that account for your buffer preferences, existing meeting context, and the scheduling habits it has learned over time.
Use case: Anyone who blocks focus time, hates back-to-back meetings, or has a preference for calls at specific times of day.
Example: Someone asks to meet. Kross suggests Thursday at 2pm — not Monday morning because you never take calls then, not right before your existing 4pm, but a clean slot with buffer on both sides.
Tweet angle: Kross doesn't just find an open slot. It finds the right one.

### Auto-scheduling from email detection
What it does: Kross detects phrases like "let's find a time" or "can we schedule a call" in any email and automatically offers to handle the entire scheduling flow — without you leaving the thread.
Use case: Any email that leads to a meeting. Which is most emails.
Example: Client emails: "Can we get 30 minutes this week?" Kross highlights the email and shows: "Schedule a meeting with this person? Here are your available slots." You click confirm. Done. You never left the inbox.
Tweet angle: They said "let's find a time." Kross handled it.

### Meeting prep briefs
What it does: Ten minutes before any meeting, Kross surfaces a brief with the relevant email thread, shared documents, last conversation with that person, and any open action items.
Use case: Back-to-back call days where you have no time to context-switch between meetings.
Example: Three minutes before your call with a client you haven't spoken to in a month, Kross surfaces: "Last email: you promised to send revised pricing. Open item: proposal follow-up. Last call note: they mentioned a Q3 budget freeze."
Tweet angle: You have a call in 3 minutes. Kross already read your email history.

### Smart buffer management
What it does: Kross learns how long you need between meetings and automatically protects that time when scheduling new events.
Use case: Anyone who has back-to-back calls and always runs late, forgets to eat, or has no thinking time.
Example: You always need 15 minutes after a client call to write notes. Kross starts protecting a 15-minute block after every external call without you asking.
Tweet angle: Kross noticed you always run late. It started adding buffers automatically.

---

## 6. SEARCH & MEMORY

### Natural language search
What it does: Search your entire inbox using plain English questions instead of keywords. Kross understands meaning, not just exact matches.
Use case: Finding emails when you remember context but not the exact words used.
Example: "Find the invoice Marcus sent before the holidays" — Kross finds it even if the email says "please see attached statement" and was sent December 22nd.
Tweet angle: You remember what the email was about. Kross finds it.

### Cross-account unified search
What it does: One search query searches across all your connected accounts — Gmail and Outlook — simultaneously.
Use case: When you can't remember which account a specific email came through.
Example: "That proposal from TechCorp" — Kross searches both accounts at once and finds it in your Outlook inbox you forgot you checked.
Tweet angle: One search. Every inbox. Every email.

### Relationship memory per contact
What it does: Kross maintains a running memory of every contact — projects you have worked on together, commitments made, tone of the relationship, and context from past threads.
Use case: Before a call, before replying to someone you haven't spoken to in months, before delegating a project.
Example: You are about to email a vendor you last spoke to six months ago. Kross shows: "Last discussed: renewal pricing. You agreed to revisit in Q2. They mentioned a headcount freeze in March."
Tweet angle: You forgot who this person was. Kross remembered everything.

### Second brain — longitudinal memory
What it does: Ask Kross questions about your entire communication history in plain English and get accurate, sourced answers.
Use case: CYA moments, contract disputes, project handoffs, forgetting what you agreed to.
Example: "What did I agree to with the TechCorp team last month?" — Kross: "In your March 14th email you committed to delivering the API spec by end of Q1 and agreed to waive the setup fee in exchange for a 12-month contract."
Tweet angle: "What exactly did I promise them?" — Kross knows.

---

## 7. AI AGENTS

### Reactive built-in agents
What it does: Pre-built AI agents that run automatically in the background on known workflows — triage, reply drafting, scheduling, document review, follow-ups, meeting prep.
Use case: Removing the repetitive cognitive overhead of email management entirely.
Example: Every morning, the triage agent has already sorted your inbox, scored every thread, surfaced the three emails needing action today, and drafted replies for the two most urgent ones.
Tweet angle: Kross worked your inbox before you opened it.

### Dynamic agent creation — plain English automations
What it does: You describe a workflow in plain English. Kross generates an AI agent that runs that workflow automatically every time the trigger fires. No code. No Zapier.
Use case: Any repetitive email workflow unique to your specific job or industry.
Example: You type: "Every time I get an email from a new vendor, research their company and add a summary to my contacts." Kross creates that agent. It runs every time. Forever. You described it once.
Tweet angle: You described it once. It runs forever. That's Kross agents.

### Human-in-the-loop approval
What it does: For any irreversible action — sending an email, creating a calendar event, archiving threads — Kross proposes the action and waits for your approval before executing.
Use case: Using AI assistance without anxiety about things going wrong autonomously.
Example: Kross drafts a reply to a client complaint and shows you the card: "Ready to send this to James? Approve / Edit / Reject." You review it, change one word, approve. It sends.
Tweet angle: Kross does the work. You keep the control.

### Agent execution logs
What it does: Every step of every agent action is logged with full reasoning — what the agent saw, what it decided, what it did. Fully auditable.
Use case: Compliance, debugging, understanding why the agent took a specific action.
Example: The follow-up agent sent a reminder to a client. You check the log: "Saw no reply after 5 days. Drafted follow-up based on original email context. Sent at 9:03am after approval." Complete trail.
Tweet angle: Every AI action. Every reason. Every step. Logged.

### Scheduling agent
What it does: Detects scheduling intent in any email, checks your calendar, finds optimal slots, proposes times to the sender, and creates the event — all without you touching the thread.
Use case: High-volume meeting schedulers, sales teams, consultants, executives with an EA-level workflow.
Example: A prospect emails "Would love to connect this week." The scheduling agent detects intent, finds three slots on Thursday and Friday that fit your preferences, sends them back, and when the prospect picks one, creates the event and sends a confirmation. You did nothing.
Tweet angle: They asked for a meeting. You didn't lift a finger. It's on your calendar.

### Document agent
What it does: Automatically processes every incoming attachment — summarizes it, extracts action items, answers your pre-set questions about it — and surfaces the output in the thread before you even open the file.
Use case: Legal reviews, investor updates, RFP responses, any inbox-heavy role with document-heavy workflows.
Example: Every contract that arrives in your inbox is automatically checked against five questions you set: termination clause, payment terms, liability cap, IP ownership, governing law. Answers surfaced in the thread.
Tweet angle: Five questions. Every contract. Answered before you open the file.

---

## 8. LARGE FILE & MEDIA

### No-cap file transfers
What it does: Send files of any size directly from the composer. Files transfer cloud-to-cloud via S3. No size limits, no third-party links, no expiry.
Use case: Video files, design assets, database exports, legal document bundles.
Example: A 4GB video export attached directly in Kross. Sent. Received. Stored. No WeTransfer. No "link expired in 7 days."
Tweet angle: No size limit. No expiry. No Dropbox link. Just attach it.

### Video transcription and summary
What it does: Any video file sent to you is automatically transcribed and summarized. You get the key points without watching it.
Use case: Recorded demos, team updates, design walkthroughs, video briefs.
Example: A designer sends you a 12-minute walkthrough of the new design. Kross transcribes it and surfaces: "Proposed three layout changes. Wants your feedback on the navigation. Flagged an accessibility issue on mobile." 12 minutes to 3 bullet points.
Tweet angle: 12-minute video. 3 bullet points. You're welcome.

### Smart compression suggestions
What it does: Before you send a large attachment, Kross analyzes it and suggests whether to compress, link, or chunk it based on file type, size, and recipient.
Use case: Anyone who regularly sends large files to recipients with email size limits.
Example: You attach a 180MB Figma export. Kross: "This is 180MB. Want to compress it to ~22MB with no visible quality loss, or send as a cloud link instead?" You pick. It handles it.
Tweet angle: Kross: "That file is too big. Let me fix it." Done.

---

## 9. PRIVACY & SECURITY

### Zero-knowledge architecture
What it does: All email content is encrypted with a per-user key that only you control. Even Kross cannot read your stored emails. A breach of Kross servers exposes nothing readable.
Use case: Executives, lawyers, founders, anyone whose email contains genuinely sensitive business information.
Example: Your emails are encrypted with your personal key before they are stored. The plaintext exists only in memory during AI processing and is discarded immediately after. The stored data is mathematically unreadable without your key.
Tweet angle: We built Kross so that even we can't read your emails.

### Self-hosted AI (Gemma 4)
What it does: The AI model powering Kross is self-hosted within Kross's own infrastructure. Your email content never reaches an external AI API — not OpenAI, not Anthropic, not Google.
Use case: Enterprise compliance, GDPR, HIPAA-adjacent industries, anyone who cannot allow email data to be processed by a third-party AI provider.
Example: Every AI summary, every reply suggestion, every document analysis — processed entirely within Kross's own AWS environment on dedicated GPU nodes. Your data never touches an external AI service.
Tweet angle: The AI runs inside Kross's own infrastructure. Your emails never reach an external AI API.

### GDPR-compliant data residency
What it does: EU users' data stays in EU servers. US users' data stays in US servers. You choose at signup.
Use case: EU-based companies with GDPR obligations, global companies with data residency requirements.
Example: You sign up from Berlin. Your data lives in eu-west-1. It never crosses to a US data center. Full GDPR compliance. No legal headaches.
Tweet angle: EU user? Your data stays in the EU. Full stop.

### One-click account deletion with full data destruction
What it does: Deleting your Kross account triggers cryptographic key deletion — making every stored email, attachment, and memory permanently and mathematically unreadable. Not archived. Destroyed.
Use case: GDPR right to erasure, switching tools, ending a contract, peace of mind.
Example: You delete your account. Your encryption key is destroyed. Your stored email content is now a pile of encrypted data no one can ever decode. Not us, not AWS, not anyone.
Tweet angle: Delete your account. Your data doesn't just disappear — it becomes permanently unreadable. Cryptographically.

---

## 10. MULTI-ACCOUNT WORKSPACE

### Gmail + Outlook in one place
What it does: Connect Gmail and Outlook simultaneously. Kross normalizes them into a single unified experience with consistent UI, AI features, and search across both.
Use case: Founders with a personal Gmail and company Google Workspace. Consultants with a client Outlook and a personal Gmail. Anyone living across multiple email identities.
Example: Your work Google Workspace and your Outlook account. All in Kross. One inbox. One search. One AI.
Tweet angle: Gmail and Outlook. One app. Finally.

### Per-account reply identity
What it does: Kross automatically replies from the correct account based on which account the original email arrived on. No accidentally replying from the wrong address.
Use case: Anyone managing multiple identities — work vs personal, client-facing vs internal.
Example: A client emails your work Gmail. You reply inside Kross. The reply comes from your work Gmail, not the Outlook account you were just browsing.
Tweet angle: You never accidentally replied from the wrong email account again.

### Unified contact graph
What it does: Kross merges your contacts across all connected providers into a single relationship graph. One person, one contact card, all history from all accounts.
Use case: A contact who emails you on both Gmail and Outlook — Kross shows you one view of that relationship, not two.
Example: Marcus has emailed your Gmail three times and your Outlook twice. Kross shows one contact card for Marcus with all five threads visible in one conversation history.
Tweet angle: One contact card. All your emails with them. Regardless of which account they hit.

---

## PRODUCT POSITIONING LINES FOR TWEETS

These are punchy one-liners the tweet AI can use as hooks or closers:

- Email was broken. We didn't patch it. We rebuilt the mental model.
- Kross is what email looks like when someone actually thinks about it.
- Your inbox has a PhD. It just hasn't been acting like it.
- We took everything that is right about iMessage and applied it to email.
- The AI does the work. You keep the control.
- All your email accounts. One brain. That's Kross.
- Kross doesn't organize your email. It thinks about it.
- The email app that reads before you do.
- Email from 2025. Finally.
- You described the workflow once. It runs forever.
- Kross: where emails become conversations and conversations get things done.
- Your second brain finally learned to read email.
- Built for people who cannot afford to miss what matters.
- The scheduling link that lives inside your email client.
- You never have to leave your inbox to schedule a meeting again.
- Your emails never reach an external AI API. Ever.
- We built Kross so even we can't read your emails.
- The email client for people who treat their inbox like a workspace.
