import crypto from "crypto";

export default function handler(req, res) {
  const { user, password } = req.body;

  const users = process.env.SITE_USERS
    .split(",")
    .map(u => u.split(":")); // [ [name, hash], ... ]

  const found = users.find(([name]) => name === user);
  if (!found) return res.status(401).end();

  const hash = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");

  if (hash !== found[1]) return res.status(401).end();

  res.setHeader(
    "Set-Cookie",
    [
      "auth=1; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict",
      `user=${encodeURIComponent(user)}; Path=/; Max-Age=86400; SameSite=Strict`
    ]
  );

  res.end();
}
