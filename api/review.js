export default async function handler(req, res) {
  if (!(req.headers.cookie || "").includes("auth=1")) {
    return res.status(401).end();
  }

  const body = JSON.parse(req.body);

  await fetch(
    `https://api.airtable.com/v0/${process.env.BASE_ID}/tblyGpOePsDWwDWaR`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        fields: {
          "Utilisateur": [body.user],
          "DateComite": body.dateComite,
          "🗨️Que pensez-vous de l'opportunité d'investissement dans cette ferme vis à vis de la mission de la foncière ?": body.opportunite,
          "Risque revente": body.risque,
          "Facilité nouveau locataire": body.locataire,
          "Décision": body.decision,
          "🗨️Précisez vos éventuelles conditions suspensives à l'acquisition": body.conditions,
          "🗨️Donnez ici votre avis général sur la ferme, le projet ou posez vos questions": body.avis
        }
      })
    }
  );

  res.json({ ok: true });
}
document.getElementById("reviewForm").addEventListener("submit", e => {
  e.preventDefault();

  const form = e.target;

  const payload = {
    user: currentMember.recordId,
    dateComite: document.getElementById("dateComiteField").value,
    opportunite: form.opportunite.value,
    risque: document.querySelector('[data-name="risque"]').dataset.value,
    locataire: document.querySelector('[data-name="locataire"]').dataset.value,
    decision: document.querySelector('[data-name="decision"]').dataset.value,
    conditions: form.conditions?.value || "",
    avis: form.avis.value
  };

  fetch("/api/review", {
    method: "POST",
    body: JSON.stringify(payload)
  }).then(() => {
    alert("Merci pour votre avis.");
    form.reset();
  });
});
