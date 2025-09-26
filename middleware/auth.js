import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export default function authenticate(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Token ausente ou inválido" });
  }

  if (!JWT_SECRET) {
    return res.status(500).json({ message: "JWT_SECRET não configurado" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.id;
    return next();
  } catch (_) {
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
}

