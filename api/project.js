export default async function handler(req, res) {
  if (!(req.headers.cookie || "").includes("auth=1"))
    return res.status(401).end();

  const { slug } = req.query;

  const r = await fetch(
    `https://api.airtable.com/v0/${process.env.BASE_ID}/Projects?filterByFormula={Slug}='${slug}'`,
    { headers:{ Authorization:`Bearer ${process.env.AIRTABLE_TOKEN}` } }
  );

  const d = await r.json();
  const p = d.records[0].fields;

  res.json({ name:p.Name, description:p.Description });
}

