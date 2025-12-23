export default function handler(req, res) {
  res.json({
    authenticated: (req.headers.cookie || "").includes("auth=1")
  });
}
