export default async function handler(req, res) {
  // Auth check
  if (!(req.headers.cookie || "").includes("auth=1")) {
    return res.status(401).end();
  }

  const response = await fetch(
    `https://api.airtable.com/v0/${process.env.BASE_ID}/tbleKBzmDOWxF0tRk?view=viwET6wrgoOEjsFKJ`,
    {
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`
      }
    }
  );

  const data = await response.json();

  const projects = data.records
    .map(record => {
      const fields = record.fields;

      // ❌ Exclude invalid records
      if (!fields["Name"] || !fields["📅Comité"]) return null;

      return {
        name: fields["Name"],
        slug: fields["Slug"],
        department: fields["Département"] || "",
        dateComite: fields["DateComite"],
        photo: fields["📷Photos"]?.[0]?.url || null
      };
    })
    .filter(Boolean); // remove nulls

  res.json(projects);
}
