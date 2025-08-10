import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export default function auth(req, res, next) {
  try {
    if (!JWT_SECRET) {
      return res.status(500).json({ message: "JWT_SECRET não configurado" });
    }

    const authHeader = req.headers["authorization"] || "";
    const [, token] = authHeader.split(" ");

    if (!token) {
      return res.status(401).json({ message: "Token não fornecido" });
    }

    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload?.id;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
}