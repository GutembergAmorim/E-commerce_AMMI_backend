import express from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

//Cadastro de usuário
router.post("/register", async (req, res) => {
  try {
    const user = req.body;

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(user.password, salt);

    const newUser = await prisma.user.create({
      data: {
        name: user.name,
        cpf: user.cpf,
        email: user.email,
        password: hashPassword,
      },
    });
    // Removendo a senha da resposta para não expor o hash
    const { password, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao cadastrar usuário", error: error.message });
  }
});

//Login de usuário
router.post("/login", async (req, res) => {
  try {
    const userInfo = req.body;

    // Verifica se o usuário existe
    const user = await prisma.user.findUnique({
      where: { email: userInfo.email },
    });

    // Se o usuário não existir, retorna erro
    if (!user) {
      return res.status(404).json({ message: "Email ou senha inválidos" });
    }

    // Verifica se a senha está correta
    const validPassword = await bcrypt.compare(
      userInfo.password,
      user.password
    );

    // Se a senha estiver incorreta, retorna erro
    if (!validPassword) {
      return res.status(401).json({ message: "Email ou senha inválidos" });
    }

    // Gerar token JWT e remover a senha da resposta
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1m" });
    const { password, ...userWithoutPassword } = user;
    res.status(200).json({ message: "Login bem-sucedido", token, user: userWithoutPassword });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao fazer login", error: error.message });
  }
});

export default router;
