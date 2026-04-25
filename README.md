# Portal de Agendamento de Exames

Sistema completo para agendamento de exames laboratoriais, com portal web para pacientes e API RESTful.

## Stack

- **API**: NestJS 11, TypeORM, PostgreSQL 16, Redis 7, JWT (cookies httpOnly)
- **Web**: Next.js 16 (App Router), TypeScript, Chakra UI, React Query, React Hook Form + Zod
- **Infra**: Docker Compose, GitHub Actions CI

---

## Rodando com Docker (recomendado)

> Pré-requisito: [Docker](https://docs.docker.com/get-docker/) e [Docker Compose](https://docs.docker.com/compose/)

```bash
# Clone o repositório
git clone <repo-url>
cd take-home

# Suba todos os serviços (API, Web, PostgreSQL, Redis)
docker compose up --build
```

Aguarde todos os containers ficarem saudáveis. Acesse:

| Serviço    | URL                            |
| ---------- | ------------------------------ |
| 🌐 Web     | http://localhost:3000          |
| 🔌 API     | http://localhost:8080/api      |
| 📚 Swagger | http://localhost:8080/api/docs |

O banco de dados é inicializado automaticamente com **10 exames** via migration do TypeORM.

---

## Rodando em modo desenvolvimento

### Pré-requisitos

- Node.js 20+
- PostgreSQL rodando localmente
- Redis rodando localmente

### 1. API (take-home-api)

```bash
cd take-home-api

# Copie o env de exemplo
cp .env.example .env
# Edite o .env com suas credenciais do banco

# Instale as dependências
npm install

# Rode em modo dev (com hot reload)
npm run start:dev
```

A API estará disponível em `http://localhost:3001/api`.  
Swagger em `http://localhost:3001/api/docs`.

### 2. Web (take-home-web)

```bash
cd take-home-web

# O .env já está configurado para desenvolvimento local
# NEXT_PUBLIC_API_URL=http://localhost:8080/api

# Instale as dependências
npm install

# Rode em modo dev
npm run dev
```

O portal estará disponível em `http://localhost:3000`.

---

## Variáveis de Ambiente

### API (`take-home-api/.env`)

| Variável              | Descrição                  | Padrão                   |
| --------------------- | -------------------------- | ------------------------ |
| `APP_PORT`            | Porta da API               | `3001`                   |
| `DB_HOST`             | Host do PostgreSQL         | `localhost`              |
| `DB_PORT`             | Porta do PostgreSQL        | `5432`                   |
| `DB_USER`             | Usuário do banco           | `postgres`               |
| `DB_PASSWORD`         | Senha do banco             | —                        |
| `DB_SCHEMA`           | Nome do banco de dados     | `take-home`              |
| `REDIS_URL`           | URL do Redis               | `redis://localhost:6379` |
| `JWT_SECRET`          | Secret do access token     | —                        |
| `JWT_REFRESH_SECRET`  | Secret do refresh token    | —                        |
| `JWT_EXPIRES`         | Expiração do access token  | `30m`                    |
| `JWT_REFRESH_EXPIRES` | Expiração do refresh token | `45m`                    |
| `CORS_ORIGIN`         | Origem permitida pelo CORS | `http://localhost:3000`  |

### Web (`take-home-web/.env`)

| Variável              | Descrição       |
| --------------------- | --------------- |
| `NEXT_PUBLIC_API_URL` | URL base da API |

---

## Funcionalidades

### API

| Método | Endpoint                  | Autenticação | Descrição                                            |
| ------ | ------------------------- | ------------ | ---------------------------------------------------- |
| POST   | `/api/auth/login`         | Público      | Login — seta cookies httpOnly                        |
| POST   | `/api/auth/refresh-token` | Público      | Renova o access token via cookie                     |
| POST   | `/api/auth/logout`        | Autenticado  | Logout — limpa cookies                               |
| POST   | `/api/user`               | Público      | Criar usuário                                        |
| POST   | `/api/exams`              | Admin        | Criar exame                                          |
| GET    | `/api/exams`              | Público      | Listar exames (busca + paginação + cache Redis 5min) |
| GET    | `/api/exams/:id`          | Público      | Detalhes de um exame                                 |
| PATCH  | `/api/exams/:id`          | Admin        | Editar exame                                         |
| POST   | `/api/appointments`       | Autenticado  | Criar agendamento                                    |
| GET    | `/api/appointments`       | Autenticado  | Listar agendamentos do usuário                       |
| PATCH  | `/api/appointments/:id`   | Autenticado  | Atualizar agendamento (owner only)                   |

### Portal Web

| Rota            | Acesso      | Descrição                      |
| --------------- | ----------- | ------------------------------ |
| `/login`        | Público     | Tela de login                  |
| `/register`     | Público     | Cadastro de usuário            |
| `/exams`        | Autenticado | Listagem com busca e paginação |
| `/exams/[id]`   | Autenticado | Detalhes + botão agendar       |
| `/appointments` | Autenticado | Meus agendamentos              |
| `/create-exams` | Admin       | Formulário de criação de exame |

---

## Decisões técnicas

### Agendamento de horários

O cliente envia uma string ISO 8601 (`scheduled_at`) para o backend. Essa abordagem é mais flexível que slots fixos, permitindo que o frontend use qualquer seletor de data/hora. O backend valida que o horário não está no passado e que não há conflito para o mesmo usuário.

### Autenticação com cookies seguros

Os tokens JWT (access + refresh) são armazenados como cookies `httpOnly`, protegendo contra ataques XSS. O JwtStrategy aceita tokens tanto via cookie quanto via `Authorization: Bearer` header (para compatibilidade com Swagger).

### Cache Redis

A listagem de exames (`GET /api/exams`) usa `CacheInterceptor` do NestJS com TTL de 5 minutos via Redis. Ao criar ou editar exames, o cache é invalidado automaticamente.

### Rate Limiting

Implementado via `@nestjs/throttler` com limite de 100 requisições por minuto por IP.

---

## Criando um usuário admin

Para criar um usuário admin, use a rota `POST /api/user` passando `"role": "admin"`:

```bash
curl -X POST http://localhost:8080/api/user \
  -H "Content-Type: application/json" \
  -d '{"name": "Admin", "email": "admin@example.com", "password": "senha123", "role": "admin"}'
```
