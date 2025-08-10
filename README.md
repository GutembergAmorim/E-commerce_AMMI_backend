# E-commerce_AMMI_backend

Backend em Node.js/Express com Prisma (MongoDB) e JWT.

## Requisitos
- Node.js 18+
- MongoDB (Atlas ou local)

## Configuração
1. Instalar dependências:
   ```bash
   npm install
   ```
2. Configurar variáveis de ambiente:
   - Copie `.env.example` para `.env` e preencha:
     ```env
     DATABASE_URL="mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority"
     JWT_SECRET="sua-chave-secreta-muito-segura"
     PORT=3000
     ```
3. Gerar o Prisma Client:
   ```bash
   npx prisma generate
   ```
4. Iniciar o servidor:
   ```bash
   npm start
   ```

## Base URL
- A API está sob o prefixo `/api`.
- Healthcheck: `GET /health`

## Endpoints
- Auth/Public:
  - `POST /api/register` — Cria usuário (nome, cpf, email, password)
  - `POST /api/login` — Retorna token JWT
- Privado (requer `Authorization: Bearer <token>`):
  - `GET /api/users` — Lista usuários (sem senha)

## Notas
- Gere o client Prisma após alterar `schema.prisma`.
- As rotas privadas usam middleware JWT.