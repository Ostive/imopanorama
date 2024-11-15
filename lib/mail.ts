import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  try {
    const confirmLink = `http://localhost:3000/verify-email?token=${token}`;
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Confirm your email",
      html: `<p>Click <a href="${confirmLink}">here</a> to confirm your email</p>`,
    });
    console.log(`Verification email sent to ${email} in email.ts file`);
  } catch (error) {
    console.error(`Failed to send verification email to ${email}:`, error);
  }
};
