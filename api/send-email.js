import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { to, playerName, sport, amount } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false,
      auth: {
        user: "apikey",
        pass: process.env.BREVO_SMTP_KEY,
      },
    });

    await transporter.sendMail({
      from: "Sports Portal <noreply@brevo.com>",
      to,
      subject: "Sports Entry Confirmation",
      html: `
        <h2>Entry Confirmed</h2>
        <p><strong>Player Name:</strong> ${playerName}</p>
        <p><strong>Sport:</strong> ${sport}</p>
        <p><strong>Amount:</strong> ₹${amount}</p>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Brevo email error:", error);
    return res.status(500).json({ error: "Failed to send email" });
  }
}
