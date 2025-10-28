import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export async function sendMail(to: string, subject: string, html: string) {
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
    to,
    subject,
    html,
  });
}
