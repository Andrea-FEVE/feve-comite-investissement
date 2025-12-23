export default async function handler(req, res) {
  if (!(req.headers.cookie || "").includes("auth=1"))
    return res.status(401).end();

  const r = await fetch(
    `https://api.airtable.com/v0/${process.env.BASE_ID}/Projects`,
    { headers:{ Authorization:`Bearer ${process.env.AIRTABLE_TOKEN}` } }
  );

  const d = await r.json();
  res.json(d.records.map(r => ({
    name: r.fields.Name,
    slug: r.fields.Slug
  })));
}

