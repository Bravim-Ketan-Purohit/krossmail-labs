/**
 * Kross shared type contract — the single source of truth that every provider
 * (Gmail, Outlook) is normalized INTO before any UI or business logic touches it.
 * Mirrors the Aurora schema in CLAUDE.md. Apple/iCloud is intentionally excluded.
 */

export type Provider = "gmail" | "outlook";

/** AI categorization buckets for a thread. */
export type ThreadCategory = "action" | "waiting" | "fyi" | "noise";

/** SQS event types emitted by the sync pipeline. */
export type SyncEventType =
  | "email.received"
  | "email.updated"
  | "email.deleted"
  | "thread.updated";

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  krossIdentityProvider: Provider;
  createdAt: string;
}

export interface AccountConnection {
  id: string;
  userId: string;
  provider: Provider;
  /** Tokens never live here as plaintext — only a Secrets Manager reference. */
  tokenExpiresAt: string;
  scopes: string[];
  createdAt: string;
}

export interface Thread {
  id: string;
  userId: string;
  provider: Provider;
  providerThreadId: string;
  subject: string;
  snippet: string;
  isRead: boolean;
  isStarred: boolean;
  /** Null until the AI service scores it (Stage 3). */
  priorityScore: number | null;
  category: ThreadCategory | null;
  lastMessageAt: string;
  createdAt: string;
}

export interface Message {
  id: string;
  threadId: string;
  userId: string;
  providerMessageId: string;
  fromAddress: string;
  toAddresses: string[];
  ccAddresses: string[];
  /** Stored KMS-encrypted at rest; plaintext only in transit/in-memory. */
  body: string;
  hasAttachments: boolean;
  sentAt: string;
}

export interface Attachment {
  id: string;
  messageId: string;
  userId: string;
  filename: string;
  mimeType: string;
  s3Key: string;
  extractedText: string | null;
  sizeBytes: number;
  createdAt: string;
}

/** A normalized thread plus its messages — what the BFF returns to the frontend. */
export interface ThreadWithMessages extends Thread {
  messages: Message[];
}

/** Raw provider payload shapes (minimal subset the normalizer consumes). */
export interface GmailMessagePayload {
  threadId: string;
  id: string;
  snippet: string;
  internalDate: string; // epoch ms as string
  labelIds: string[];
  payload: {
    headers: { name: string; value: string }[];
    bodyText: string;
    hasAttachments: boolean;
  };
}

export interface OutlookMessagePayload {
  conversationId: string;
  id: string;
  bodyPreview: string;
  receivedDateTime: string; // ISO 8601
  isRead: boolean;
  subject: string;
  from: { emailAddress: { address: string } };
  toRecipients: { emailAddress: { address: string } }[];
  ccRecipients: { emailAddress: { address: string } }[];
  body: { content: string };
  hasAttachments: boolean;
}
