import crypto from "crypto";

export default function handler(req, res) {
  const hash = crypto.createHash("sha256")
    .update(req.body.password)
    .digest("hex");

  if (hash !== process.env.SITE_PASSWORD_HASH)
    return res.status(401).end();

  res.setHeader(
    "Set-Cookie",
    "auth=1; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict"
  );

  res.end();
}

