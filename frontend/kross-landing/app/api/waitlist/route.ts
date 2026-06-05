import { NextRequest, NextResponse } from "next/server";
import { resend } from "@/lib/resend";

const confirmationHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>You're on the Kross waitlist</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0d;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0d;padding:48px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

          <!-- Logo -->
          <tr>
            <td style="padding:0 0 36px 0;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background:linear-gradient(135deg,#aab0fc 0%,#6d6ff0 45%,#575dee 100%);border-radius:9px;width:32px;height:32px;text-align:center;vertical-align:middle;">
                    <span style="color:#fff;font-size:18px;font-weight:700;line-height:32px;">K</span>
                  </td>
                  <td style="padding-left:10px;color:#f4f3f7;font-size:18px;font-weight:700;vertical-align:middle;">
                    Kross
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main card -->
          <tr>
            <td style="background:linear-gradient(135deg,rgba(124,123,247,0.15) 0%,rgba(87,93,238,0.08) 100%);border:1px solid rgba(255,255,255,0.08);border-radius:18px;padding:48px 40px;">

              <p style="margin:0 0 8px 0;font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#7c7bf7;">
                ✦ &nbsp;You're early
              </p>

              <h1 style="margin:0 0 20px 0;font-size:36px;font-weight:700;line-height:1.1;color:#f4f3f7;letter-spacing:-0.01em;">
                Your inbox is<br />ready to think.
              </h1>

              <p style="margin:0 0 32px 0;font-size:17px;line-height:1.65;color:#a6a3b4;">
                You're on the Kross waitlist. We'll reach out the moment
                we launch — no spam, no noise, just the one email that matters.
              </p>

              <table cellpadding="0" cellspacing="0" style="margin-bottom:32px;border-top:1px solid rgba(255,255,255,0.06);padding-top:28px;width:100%;">
                <tr>
                  <td>
                    <p style="margin:0 0 12px 0;font-size:15px;color:#a6a3b4;line-height:1.6;">
                      <span style="color:#7c7bf7;">✦</span>&nbsp;&nbsp;
                      <strong style="color:#f4f3f7;">One inbox</strong> — Gmail and Outlook, unified.
                    </p>
                    <p style="margin:0 0 12px 0;font-size:15px;color:#a6a3b4;line-height:1.6;">
                      <span style="color:#7c7bf7;">✦</span>&nbsp;&nbsp;
                      <strong style="color:#f4f3f7;">AI that actually thinks</strong> — priority, drafts, follow-ups.
                    </p>
                    <p style="margin:0;font-size:15px;color:#a6a3b4;line-height:1.6;">
                      <span style="color:#7c7bf7;">✦</span>&nbsp;&nbsp;
                      <strong style="color:#f4f3f7;">Zero-knowledge encryption</strong> — even we can't read it.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:13px;color:#6e6b7c;font-family:'Courier New',monospace;letter-spacing:0.03em;">
                — The Kross team
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:28px 0 0 0;text-align:center;">
              <p style="margin:0;font-size:11px;font-family:'Courier New',monospace;color:#6e6b7c;letter-spacing:0.04em;">
                You're receiving this because you joined the Kross waitlist.<br />
                One inbox. Every account. Zero chaos.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export async function POST(req: NextRequest) {
  let email: string;

  try {
    const body = await req.json();
    email = (body.email ?? "").trim().toLowerCase();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  try {
    // Add to Resend Audience if configured
    const audienceId = process.env.RESEND_AUDIENCE_ID;
    if (audienceId) {
      await resend.contacts.create({ email, audienceId });
    }

    // Send confirmation email
    await resend.emails.send({
      from: "Kross <onboarding@resend.dev>",
      to: email,
      subject: "You're on the Kross waitlist ✦",
      html: confirmationHtml,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[waitlist] Resend error:", err);
    return NextResponse.json(
      { error: "Failed to join waitlist. Please try again." },
      { status: 500 }
    );
  }
}
