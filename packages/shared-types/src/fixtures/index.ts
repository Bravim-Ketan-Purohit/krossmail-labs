/**
 * Canonical provider fixtures — one Gmail and one Outlook payload plus the
 * Thread/Message they MUST normalize into. Reused at every test layer so
 * "normalize to Thread" is verified identically everywhere (Stage 2 builds the
 * actual normalizers; these fixtures are their contract).
 */
import type {
  GmailMessagePayload,
  OutlookMessagePayload,
  Thread,
  Message,
} from "../index.js";

export const gmailPayload: GmailMessagePayload = {
  threadId: "gmail-thread-001",
  id: "gmail-msg-001",
  snippet: "Hi Alex, let's look at the quarterly projections and optimize the AI loop",
  internalDate: "1716200460000", // 2024-05-20T10:21:00Z
  labelIds: ["INBOX", "UNREAD"],
  payload: {
    headers: [
      { name: "Subject", value: "Q3 Strategy Alignment" },
      { name: "From", value: "Julian Vance <julian@vance.io>" },
      { name: "To", value: "alex@nexusmail.ai" },
    ],
    bodyText: "Hi Alex, let's look at the quarterly projections and optimize the AI loop.",
    hasAttachments: false,
  },
};

export const expectedGmailThread: Omit<Thread, "id" | "userId" | "createdAt"> = {
  provider: "gmail",
  providerThreadId: "gmail-thread-001",
  subject: "Q3 Strategy Alignment",
  snippet: "Hi Alex, let's look at the quarterly projections and optimize the AI loop",
  isRead: false,
  isStarred: false,
  priorityScore: null,
  category: null,
  lastMessageAt: "2024-05-20T10:21:00.000Z",
};

export const expectedGmailMessage: Omit<
  Message,
  "id" | "threadId" | "userId"
> = {
  providerMessageId: "gmail-msg-001",
  fromAddress: "julian@vance.io",
  toAddresses: ["alex@nexusmail.ai"],
  ccAddresses: [],
  body: "Hi Alex, let's look at the quarterly projections and optimize the AI loop.",
  hasAttachments: false,
  sentAt: "2024-05-20T10:21:00.000Z",
};

export const outlookPayload: OutlookMessagePayload = {
  conversationId: "outlook-thread-001",
  id: "outlook-msg-001",
  bodyPreview: "We are looking at a 15-minute downtime on Sunday at 02:00 UTC",
  receivedDateTime: "2024-05-20T11:06:00Z",
  isRead: true,
  subject: "Server Maintenance: Upcoming window for Nexus-7",
  from: { emailAddress: { address: "james@devops.work" } },
  toRecipients: [{ emailAddress: { address: "alex@nexusmail.ai" } }],
  ccRecipients: [],
  body: { content: "We are looking at a 15-minute downtime on Sunday at 02:00 UTC." },
  hasAttachments: false,
};

export const expectedOutlookThread: Omit<Thread, "id" | "userId" | "createdAt"> = {
  provider: "outlook",
  providerThreadId: "outlook-thread-001",
  subject: "Server Maintenance: Upcoming window for Nexus-7",
  snippet: "We are looking at a 15-minute downtime on Sunday at 02:00 UTC",
  isRead: true,
  isStarred: false,
  priorityScore: null,
  category: null,
  lastMessageAt: "2024-05-20T11:06:00.000Z",
};

export const expectedOutlookMessage: Omit<
  Message,
  "id" | "threadId" | "userId"
> = {
  providerMessageId: "outlook-msg-001",
  fromAddress: "james@devops.work",
  toAddresses: ["alex@nexusmail.ai"],
  ccAddresses: [],
  body: "We are looking at a 15-minute downtime on Sunday at 02:00 UTC.",
  hasAttachments: false,
  sentAt: "2024-05-20T11:06:00.000Z",
};
