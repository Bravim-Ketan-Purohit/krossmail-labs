import { describe, it, expect } from "vitest";
import {
  gmailPayload,
  expectedGmailThread,
  expectedGmailMessage,
  outlookPayload,
  expectedOutlookThread,
  expectedOutlookMessage,
} from "./index.js";

/**
 * Contract guard: the expected normalized objects must stay consistent with their
 * source payloads. Stage 2's normalizers will be tested AGAINST these same fixtures,
 * so this locks the shape both sides agree on.
 */
describe("provider fixture contract", () => {
  it("gmail expected thread maps key fields from the payload", () => {
    expect(expectedGmailThread.provider).toBe("gmail");
    expect(expectedGmailThread.providerThreadId).toBe(gmailPayload.threadId);
    expect(expectedGmailThread.isRead).toBe(false); // has UNREAD label
    expect(expectedGmailThread.priorityScore).toBeNull(); // unscored pre-Stage 3
    expect(expectedGmailMessage.providerMessageId).toBe(gmailPayload.id);
    expect(expectedGmailMessage.body).toBe(gmailPayload.payload.bodyText);
    expect(new Date(expectedGmailThread.lastMessageAt).getTime()).toBe(
      Number(gmailPayload.internalDate),
    );
  });

  it("outlook expected thread maps key fields from the payload", () => {
    expect(expectedOutlookThread.provider).toBe("outlook");
    expect(expectedOutlookThread.providerThreadId).toBe(outlookPayload.conversationId);
    expect(expectedOutlookThread.isRead).toBe(outlookPayload.isRead);
    expect(expectedOutlookMessage.fromAddress).toBe(
      outlookPayload.from.emailAddress.address,
    );
    expect(expectedOutlookMessage.body).toBe(outlookPayload.body.content);
  });

  it("only gmail and outlook providers exist (no apple)", () => {
    const providers = [expectedGmailThread.provider, expectedOutlookThread.provider];
    expect(providers).toEqual(["gmail", "outlook"]);
    expect(providers).not.toContain("apple");
  });
});
