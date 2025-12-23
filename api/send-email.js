export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const {
    email,
    entryType,
    collegeName,
    playerName,
    entrytakenby,
    gender,
    phone,
    department,
    year,
    sport,
    category,
    amount,
    
  } = req.body;

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
          email: "vcet.sports@vcet.edu.in",
        },
        to: [{ email }],
        subject: "Sports Entry Confirmation",
        htmlContent: `
          <h2>🏆 Sports Entry Confirmation</h2>
          <hr />

          <p><strong>Entry Type:</strong> ${entryType}</p>
          ${
            entryType === "Inter"
              ? `<p><strong>College Name:</strong> ${collegeName}</p>`
              : ""
          }

          <p><strong>Player / Captain Name:</strong> ${playerName}</p>
          <p><strong>Gender:</strong> ${gender}</p>
          <p><strong>Phone Number:</strong> ${phone}</p>
          <p><strong>Email:</strong> ${email}</p>

          <p><strong>Department:</strong> ${department}</p>
          <p><strong>Year:</strong> ${year}</p>

          <p><strong>Sport:</strong> ${sport}</p>
          <p><strong>Category:</strong> ${category}</p>

          <p><strong>Amount Paid:</strong> ₹${amount}</p>

          <hr />

          <p><strong>Entry Taken By:</strong> ${entrytakenby}</p>
         

          <br />
          <p>Thank you for registering for the sports event.</p>
          <p>Please keep this email for future reference.</p>
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
