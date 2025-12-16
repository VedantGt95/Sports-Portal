import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { to, playerName, sport, amount } = req.body;

    await resend.emails.send({
      from: "Sports Portal <onboarding@resend.dev>",
      to: to,
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
    console.error("Email error:", error);
    return res.status(500).json({ error: "Failed to send email" });
  }
}
