export default async function handler(req, res) {
  if (!(req.headers.cookie || "").includes("auth=1")) {
    return res.status(401).end();
  }

  const cookies = Object.fromEntries(
    (req.headers.cookie || "").split("; ").map(c => c.split("="))
  );

  const userId = cookies.user;
  if (!userId) return res.status(400).end();

  const response = await fetch(
    `https://api.airtable.com/v0/${process.env.BASE_ID}/tblT9I7XHoEQ12B5Z/viwzw7T6gEJjgOB9h?filterByFormula=${encodeURIComponent(
      `{Login}="${user}"`
    )}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`
      }
    }
  );

  const data = await response.json();
  const record = data.records?.[0];
  if (!record) return res.status(404).end();

  res.json({
    recordId: record.id,
    fullName: record.fields["Nom complet"]
  });
}
