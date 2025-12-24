export default async function handler(req, res) {
  // Read cookies
  const cookies = req.headers.cookie || "";

  // Check authentication
  if (!cookies.includes("auth=1")) {
    return res.status(401).end();
  }

  // Extract logged-in user name from cookie
  const userMatch = cookies.match(/user=([^;]+)/);
  const reviewer = userMatch
    ? decodeURIComponent(userMatch[1])
    : "Unknown";

  // Read request body (NO author field anymore)
  const { slug, comment } = req.body;

  // Find project by slug
  const projectRes = await fetch(
    `https://api.airtable.com/v0/${process.env.BASE_ID}/Projects?filterByFormula={Slug}='${slug}'`,
    {
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`
      }
    }
  );

  const projectData = await projectRes.json();
  const projectId = projectData.records[0].id;

  // Create review in Airtable with reviewer name
  await fetch(
    `https://api.airtable.com/v0/${process.env.BASE_ID}/Reviews`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fields: {
          Project: [projectId],
          Author: reviewer,
          Comment: comment
        }
      })
    }
  );

  // Done
  res.json({ success: true });
}
