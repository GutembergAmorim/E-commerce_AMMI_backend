import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, cpf: true, email: true },
    });

    return res.status(200).json({ message: "Usuários encontrados", users });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Falha no servidor", error: error.message });
  }
});

// Dados do usuário autenticado
router.get("/me", async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ message: "Não autenticado" });
    }
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, cpf: true, email: true },
    });
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Falha no servidor", error: error.message });
  }
});

export default router;
