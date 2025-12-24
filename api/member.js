export default async function handler(req, res) {
  try {
    console.log("➡️ /api/member called");

    const cookieHeader = req.headers.cookie || "";
    console.log("🍪 Cookies:", cookieHeader);

    if (!cookieHeader.includes("auth=1")) {
      console.log("❌ Not authenticated");
      return res.status(401).end();
    }

    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map(c => c.split("="))
    );

    const userId = cookies.user;
    console.log("👤 User ID from cookie:", userId);

    if (!userId) {
      console.log("❌ No user cookie");
      return res.status(400).json({ error: "No user cookie" });
    }

    const url =
      `https://api.airtable.com/v0/${process.env.BASE_ID}/Members` +
      `?filterByFormula=${encodeURIComponent(`{UserID}="${userId}"`)}`;

    console.log("🌐 Airtable URL:", url);

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`
      }
    });

    console.log("📡 Airtable status:", response.status);

    const data = await response.json();
    console.log("📦 Airtable response:", JSON.stringify(data));

    const record = data.records?.[0];
    if (!record) {
      console.log("❌ No member found");
      return res.status(404).json({ error: "Member not found" });
    }

    res.json({
      recordId: record.id,
      fullName: record.fields["Nom complet"]
    });
  } catch (err) {
    console.error("🔥 member.js error:", err);
    res.status(500).json({ error: "Internal error" });
  }
}
