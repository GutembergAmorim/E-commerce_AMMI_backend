import express from "express";
import bcrypt from "bcrypt";
import { PrismaClient, Prisma } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// Cadastro de usuário
router.post("/register", async (req, res) => {
  try {
    const { name, cpf, email, password } = req.body || {};

    if (!name || !cpf || !email || !password) {
      return res
        .status(400)
        .json({ message: "Campos obrigatórios: name, cpf, email, password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.user.create({
      data: { name, cpf, email, password: hashPassword },
    });

    const { password: _password, ...userWithoutPassword } = newUser;
    return res.status(201).json(userWithoutPassword);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return res.status(409).json({ message: "CPF ou email já cadastrados" });
    }
    return res
      .status(500)
      .json({ message: "Erro ao cadastrar usuário", error: error.message });
  }
});

// Login de usuário
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Campos obrigatórios: email e password" });
    }

    if (!JWT_SECRET) {
      return res.status(500).json({ message: "JWT_SECRET não configurado" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Email ou senha inválidos" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Email ou senha inválidos" });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "15m" });
    const { password: _password, ...userWithoutPassword } = user;
    return res
      .status(200)
      .json({ message: "Login bem-sucedido", token, user: userWithoutPassword });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erro ao fazer login", error: error.message });
  }
});

export default router;
