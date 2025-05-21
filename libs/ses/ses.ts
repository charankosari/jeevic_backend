// src/email.ts
import {
  SESClient,
  SendEmailCommand,
  SendRawEmailCommand,
} from "@aws-sdk/client-ses";
import { config } from "../../config/env";

const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

/**
 * Send a basic HTML email via SES.
 */
export async function sendEmail(
  recipientEmail: string,
  subject: string,
  bodyHtml: string
) {
  const command = new SendEmailCommand({
    Source: process.env.AWS_SES_EMAIL,
    Destination: { ToAddresses: [recipientEmail] },
    Message: {
      Subject: { Data: subject },
      Body: {
        Html: { Charset: "UTF-8", Data: bodyHtml },
      },
    },
  });

  return sesClient.send(command);
}

/**
 * Send an email with a PDF attachment via raw MIME.
 */
export async function sendEmailWithAttachment(
  recipientEmail: string,
  subject: string,
  bodyText: string,
  attachmentBuffer: Buffer,
  attachmentName: string
) {
  // Create a unique boundary
  const boundary = `----=_Part_${Date.now()}`;

  // Build the raw MIME message
  const rawLines = [
    `From: "SignBuddy" <${process.env.AWS_SES_EMAIL}>`,
    `To: ${recipientEmail}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: 7bit",
    "",
    bodyText,
    "",
    `--${boundary}`,
    `Content-Type: application/pdf; name="${attachmentName}"`,
    "Content-Transfer-Encoding: base64",
    `Content-Disposition: attachment; filename="${attachmentName}"`,
    "",
    attachmentBuffer.toString("base64"),
    "",
    `--${boundary}--`,
  ];

  const command = new SendRawEmailCommand({
    RawMessage: { Data: Buffer.from(rawLines.join("\r\n")) },
    Destinations: [recipientEmail],
    Source: process.env.AWS_SES_EMAIL,
  });

  return sesClient.send(command);
}
