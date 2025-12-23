export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { to, playerName, sport, amount } = req.body;

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          name: "Sports Portal",
          email: "vcet.sports@vcet.edu.in", // shared sender (allowed)
        },
        to: [{ email: to }],
        subject: "Sports Entry Confirmation",
        htmlContent: `
          <h2>Entry Confirmed</h2>
          <p><strong>Player Name:</strong> ${playerName}</p>
          <p><strong>Sport:</strong> ${sport}</p>
          <p><strong>Amount:</strong> ₹${amount}</p>
        `,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Brevo API error:", data);
      return res.status(500).json({ error: "Email send failed" });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
