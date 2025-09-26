# AMMI Backend

API em Node.js (Express 5) com Prisma e MongoDB.

## Requisitos
- Node.js 18+
- Banco MongoDB (connection string)

## Configuração
1. Crie um arquivo `.env` baseado em `.env.example`.
2. Instale as dependências:
   - `npm install`
3. Gere o client do Prisma:
   - `npm run prisma:generate`
4. Inicie o servidor:
   - `npm start`

## Variáveis de ambiente
- `PORT` (opcional, padrão 3000)
- `DATABASE_URL` (obrigatória)
- `JWT_SECRET` (obrigatória)

## Rotas
- `POST /api/register` — cadastro
- `POST /api/login` — autenticação (retorna JWT)
- `GET /api/users` — lista usuários (requer Bearer token)
- `GET /api/me` — dados do usuário autenticado (requer Bearer token)

## Notas
- Campos sensíveis (password) não são retornados nas respostas.
- Conflitos de CPF/email retornam HTTP 409.