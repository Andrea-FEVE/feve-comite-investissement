export default async function handler(req, res) {
  if (!(req.headers.cookie || "").includes("auth=1"))
    return res.status(401).end();

  const { slug, author, comment } = req.body;

  const pr = await fetch(
    `https://api.airtable.com/v0/${process.env.BASE_ID}/Projects?filterByFormula={Slug}='${slug}'`,
    { headers:{ Authorization:`Bearer ${process.env.AIRTABLE_TOKEN}` } }
  );

  const pid = (await pr.json()).records[0].id;

  await fetch(
    `https://api.airtable.com/v0/${process.env.BASE_ID}/Reviews`,
    {
      method:"POST",
      headers:{
        Authorization:`Bearer ${process.env.AIRTABLE_TOKEN}`,
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        fields:{
          Project:[pid],
          Author:author,
          Comment:comment
        }
      })
    }
  );

  res.json({ success:true });
}

