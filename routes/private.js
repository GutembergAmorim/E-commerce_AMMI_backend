import express from "express";
import { PrismaClient } from "../generated/prisma/index.js";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({ omit: { password: true } });

    res.status(200).json({ messeger: "Usuarios encontratos", users });
  } catch (error) {
    res
      .status(500)
      .json({ messeger: "Falha no servidor", error: error.messeger });
  }
});

export default router;
