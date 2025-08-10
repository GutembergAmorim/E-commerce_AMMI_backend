import 'dotenv/config';
import express from "express";
import publicRoutes from "./routes/public.js";
import privateRoutes from "./routes/private.js";
import auth from "./middleware/auth.js";

const app = express();
app.use(express.json());

// Public and private routes under a common API prefix
app.use("/api", publicRoutes);
app.use("/api", auth, privateRoutes);

// Healthcheck endpoint
app.get("/health", (_, res) => {
  res.status(200).json({ status: "ok" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
