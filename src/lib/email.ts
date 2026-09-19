import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_mock_key");

export async function sendEmailNotification({
  to,
  subject,
  htmlContent,
}: {
  to: string;
  subject: string;
  htmlContent: string;
}) {
  try {
    const data = await resend.emails.send({
      from: "RelunoOS <noreply@reluno.com>",
      to,
      subject,
      html: htmlContent,
    });
    return { success: true, data };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error };
  }
}