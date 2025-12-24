export default async function handler(req, res) {
  if (!(req.headers.cookie || "").includes("auth=1")) {
    return res.status(401).end();
  }

  const { slug } = req.query;
  if (!slug) return res.status(400).end();

  const response = await fetch(
    `https://api.airtable.com/v0/${process.env.BASE_ID}/tbleKBzmDOWxF0tRk?filterByFormula=${encodeURIComponent(
      `{Slug}="${slug}"`
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

  const f = record.fields;

  res.json({
    name: f["Name"],
    department: f["Département"],
    dateComite: f["DateComite"],
    photo: f["📷Photos"]?.[0]?.url || null,
    porteurs: f["Porteur(se) de projet"] || "",
    surface: f["📐Surface totale (ha)"] || null,
    montant: f["💵Montant total"] || null,
    parcellaire: f["🗺️Parcellaire"] || null,
    description: f["📃Résumé"] || ""
  });
}
