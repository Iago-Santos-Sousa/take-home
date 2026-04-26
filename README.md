# Portal de Agendamento de Exames

Sistema completo para agendamento de exames laboratoriais.

## Stack

- API: NestJS 11, TypeORM, PostgreSQL, Redis, JWT com cookie httpOnly
- Web: Next.js 16 (App Router), Tailwind CSS, React Hook Form, Zod, date-fns, React Query
- Infra: Docker Compose + GitHub Actions (CI)

## Como rodar com Docker

```bash
docker compose up --build
```

Serviços:

- Web: http://localhost:3000
- API: http://localhost:8080/api
- Swagger: http://localhost:8080/api/docs
- PostgreSQL: localhost:5432
- Redis: localhost:6379

## Credenciais de Seed

A migration `1700000000001-SeedUsers.ts` insere dois usuários de teste. Utilize as credenciais abaixo para autenticação:

| Nome            | E-mail                       | Senha       | Perfil |
| --------------- | ---------------------------- | ----------- | ------ |
| Luana Klein     | luana.klein@takehome.com     | Luana@123   | user   |
| Gabriel Feitosa | gabriel.feitosa@takehome.com | Gabriel@123 | admin  |

## Variáveis de ambiente

### API (take-home-api/.env)

- APP_PORT=3001
- DB_HOST=localhost
- DB_PORT=5432
- DB_USER=postgres
- DB_PASSWORD=postgres123
- DB_SCHEMA=takehome
- DB_SYNCHRONIZE=false
- REDIS_URL=redis://localhost:6379
- JWT_SECRET=...
- JWT_REFRESH_SECRET=...
- JWT_EXPIRES=30m
- JWT_REFRESH_EXPIRES=45m
- CORS_ORIGIN=http://localhost:3000

### Web (take-home-web/.env)

- NEXT_PUBLIC_API_URL=http://localhost:8080/api

## Regras de negócio implementadas

### Exames

- CRUD de exames na API
- `POST /exams` e `PATCH /exams/:id` apenas para admin
- Página de edição de exame no front-end: `/exams/[id]/edit` (usa `useUpdateExam`)
- Inputs de criação/edição:
  - `duration_minutes`: apenas inteiro
  - `price`: máscara monetária no formato `99,99`
- Validação em 2 etapas:
  - Front-end (Zod)
  - Back-end (class-validator)

### Agendamentos

- `GET /appointments` paginado (page/take/order/status)
- Cache Redis aplicado na listagem paginada de agendamentos (TTL 5 min)
- Cache invalidado ao criar/atualizar agendamento
- Conflito de horário considera duração do exame:
  - Duração do exame definida em `duration_minutes`
  - Quando não informada, duração padrão de 60 minutos
- Horário comercial obrigatório:
  - Início entre 08:00 e 17:30
  - Fim do exame deve permanecer dentro do horário comercial
- Front-end valida horário comercial no modal de agendamento

### Autenticação

- Login com cookies httpOnly
- Middleware no Next injeta headers do usuário para layout autenticado
- Rotas administrativas protegidas no back-end e por checagem de role no front-end

## Migrações (TypeORM + PostgreSQL)

Fluxo adotado (recomendado):

1. Migration de criação de tabelas (`1699999999999-CreateTables.ts`)
2. Migration de seed (`1700000000000-SeedExams.ts`)

`data-source.ts` está com:

- `synchronize: false`
- `migrationsRun: true`

Assim, ao subir a API no Docker, as tabelas são criadas por migration e o seed de exames é executado em seguida.

## Testes

### API

```bash
cd take-home-api
npm run test
```

Type-check da API:

```bash
npx tsc --noEmit
```

### Web

Type-check do front-end:

```bash
cd take-home-web
npx tsc --noEmit
```

## CI (GitHub Actions)

Arquivo: `.github/workflows/ci.yml`

Pipeline executa:

- Lint da API
- Lint do Web
- Build da API
- Build do Web

Objetivo: impedir merge de código quebrado (erro de lint/build) e manter qualidade mínima automaticamente em push/PR.
