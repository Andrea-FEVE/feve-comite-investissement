export default async function handler(req, res) {
  // Auth check
  if (!(req.headers.cookie || "").includes("auth=1")) {
    return res.status(401).end();
  }

  // Fetch projects from specific table + view
  const response = await fetch(
    `https://api.airtable.com/v0/${process.env.BASE_ID}/tbleKBzmDOWxF0tRk?view=viwET6wrgoOEjsFKJ`,
    {
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`
      }
    }
  );

  const data = await response.json();

  const projects = data.records.map(record => {
    const fields = record.fields;

    return {
      name: fields["Name"],
      slug: fields["Slug"],
      department: fields["Département"] || "",
      dateComite: fields["📅Comité"] || "",
      photo: fields["📷Photos"]?.[0]?.url || null
    };
  });

  res.json(projects);
}
