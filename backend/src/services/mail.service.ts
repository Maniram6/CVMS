import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export async function sendMail(
  to: string[],
  subject: string,
  html: string,
  cc?: string[]
) {
  // Create a mail transporter (using your SMTP config)
  const transporter = nodemailer.createTransport({
    service: "gmail", // or use your SMTP provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    // to: Array.isArray(to) ? to.join(", ") : to, // join multiple recipients with commas
    // cc: cc ? (Array.isArray(cc) ? cc.join(", ") : cc) : undefined,
    to: to.join(", "),
    cc: cc ? cc.join(", ") : undefined,
    subject,
    html,
  });
}
