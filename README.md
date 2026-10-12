# Seanghai Phone Shop

**Modern e-commerce platform for Seanghai Phone Shop** — a Cambodian retailer specializing in smartphones, tablets, watches, computers, and accessories.

Full-stack monorepo with a customer storefront, admin dashboard, and Spring Boot REST API backed by PostgreSQL.

[![Java](https://img.shields.io/badge/Java-21-ED8B00?logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.1-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-Private-lightgrey)](#license)

---

## Overview

| Surface | URL | Description |
|---------|-----|-------------|
| **Storefront** | http://localhost:3000 | Customer-facing shop, catalog, cart, checkout, About & Support |
| **Admin** | http://localhost:3001 | Dashboard, catalog CRUD, orders, customers, settings |
| **API** | http://localhost:8080/api | JWT-secured REST API |
| **Database** | localhost:5433 | PostgreSQL 16 (Docker) |

---

## Features

### Storefront
- Homepage with hero slider, brand strip, featured products, and category sections
- Catalog by brand, category, search, and certified pre-owned
- Product detail, cart, guest checkout, and customer accounts
- Animated **About Seanghai** and **Support** experiences
- Store locations, Telegram / Facebook contact, KHQR & local payment badges

### Admin
- Dashboard with sales and order metrics
- Products, brands, categories, and banners CRUD
- Order management and status updates
- Customer list and shop settings

### Backend
- JWT authentication (admin & customer roles)
- Catalog, orders, accounts, and public home endpoints
- Demo seed data for products, brands, stores, and sample sales

---

## Architecture

```
┌─────────────────┐     ┌─────────────────┐
│  Storefront     │     │  Admin Dashboard│
│  Next.js :3000  │     │  Next.js :3001  │
└────────┬────────┘     └────────┬────────┘
         │                       │
         └───────────┬───────────┘
                     ▼
           ┌─────────────────┐
           │  Spring Boot    │
           │  REST API :8080 │
           └────────┬────────┘
                    ▼
           ┌─────────────────┐
           │  PostgreSQL     │
           │  :5433 (Docker) │
           └─────────────────┘
```

```
SeanghaiPhoneShop/
├── backend/              # Spring Boot 4 · Java 21 · JWT · JPA
├── user-frontend/        # Customer storefront (port 3000)
├── admin-frontend/       # Admin dashboard (port 3001)
├── docker-compose.yml    # PostgreSQL 16
└── README.md
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| API | Java 21, Spring Boot 4.1, Spring Security, Spring Data JPA |
| Auth | JWT (JJWT) |
| Database | PostgreSQL 16 |
| Storefront & Admin | Next.js 15, React 19, TypeScript, Tailwind CSS |
| Icons | Lucide React |
| Infra | Docker Compose |

---

## Prerequisites

- **JDK 21+**
- **Node.js 20+** and npm
- **Docker** (for PostgreSQL)
- Git

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/kalapak-team/SeanghaiPhoneShop.git
cd SeanghaiPhoneShop
```

### 2. Start the database

```bash
docker compose up -d
```

PostgreSQL listens on **port 5433** (mapped from container `5432`) to avoid conflicts with a local Postgres install.

| Setting | Value |
|---------|-------|
| Host | `127.0.0.1` |
| Port | `5433` |
| Database | `seanghai_phone_shop` |
| User | `seanghai` |
| Password | `seanghai123` |

### 3. Run the API

```bash
cd backend
./mvnw spring-boot:run
```

Windows:

```bash
cd backend
.\mvnw.cmd spring-boot:run
```

API base URL: `http://localhost:8080/api`

### 4. Run the storefront

```bash
cd user-frontend
npm install
npm run dev
```

→ http://localhost:3000

### 5. Run the admin dashboard

```bash
cd admin-frontend
npm install
npm run dev
```

→ http://localhost:3001

---

## Demo Accounts

Seeded on first API start when `app.seed` is enabled:

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@seanghaiphone.com` | `Admin@123` |
| Customer | `customer@seanghaiphone.com` | `Customer@123` |

> Use these credentials only in local / demo environments.

---

## Configuration

Backend defaults live in `backend/src/main/resources/application.yml`:

| Key | Default | Notes |
|-----|---------|-------|
| `server.port` | `8080` | API port |
| `spring.datasource.url` | `jdbc:postgresql://127.0.0.1:5433/...` | Matches Docker Compose |
| `app.jwt.secret` | (dev value) | **Change for production** |
| `app.cors.allowed-origins` | `localhost:3000`, `:3001` | Frontends |
| `app.seed` | `true` | Demo catalog & sales data |

Storefront API URL (optional): create `user-frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

Admin proxies `/api` to the backend via `admin-frontend/next.config.ts` (`NEXT_PUBLIC_API_URL=/api`).

---

## API Overview

| Area | Prefix | Access |
|------|--------|--------|
| Public catalog & home | `/api/home`, `/api/products`, `/api/brands`, … | Public |
| Auth | `/api/auth/login`, `/api/auth/register` | Public |
| Orders | `/api/orders` | Authenticated / checkout |
| Account | `/api/account/*` | Customer |
| Admin | `/api/admin/*` | Admin role |

---

## Scripts

| Package | Command | Description |
|---------|---------|-------------|
| `backend` | `./mvnw spring-boot:run` | Start API |
| `user-frontend` | `npm run dev` | Storefront (3000) |
| `user-frontend` | `npm run build` | Production build |
| `admin-frontend` | `npm run dev` | Admin (3001) |
| `admin-frontend` | `npm run build` | Production build |
| Root | `docker compose up -d` | Start Postgres |

---

## Team

Maintained by **[kalapak-team](https://github.com/kalapak-team)**.

---

## License

Private repository. All rights reserved unless otherwise stated by kalapak-team.

---

## Deploy API on Railway (Neon PostgreSQL)

The backend is ready for [Railway](https://railway.app) with a Neon Postgres `DATABASE_URL`.

### 1. Push latest code

Ensure `backend/` (Dockerfile, `railway.toml`, env-based config) is on GitHub.

### 2. Create a Railway service

1. New Project → **Deploy from GitHub** → `kalapak-team/SeanghaiPhoneShop`
2. Set **Root Directory** to `backend`
3. Railway will build with the `Dockerfile`

### 3. Set variables (Variables tab)

| Variable | Value |
|----------|--------|
| `DATABASE_URL` | Your Neon URL (`postgresql://…?sslmode=require`) |
| `APP_JWT_SECRET` | Long random string (32+ characters) |
| `APP_CORS_ALLOWED_ORIGINS` | Your frontend URLs, comma-separated (e.g. `https://your-store.vercel.app,https://your-admin.vercel.app`) |
| `APP_SEED` | `true` on first deploy (demo data), then set to `false` |

`PORT` is set by Railway automatically.

Optional instead of `DATABASE_URL`:

```
SPRING_DATASOURCE_URL=jdbc:postgresql://HOST/neondb?sslmode=require
SPRING_DATASOURCE_USERNAME=neondb_owner
SPRING_DATASOURCE_PASSWORD=********
```

### 4. Verify

- Health: `https://<your-service>.up.railway.app/api/health` → `{"status":"UP"}`
- Public API: `https://<your-service>.up.railway.app/api/home`

Point storefront / admin `NEXT_PUBLIC_API_URL` to that Railway API URL.

> **Security:** Never commit Neon passwords or JWT secrets. Set them only in Railway Variables. If a connection string was shared in chat or email, rotate the Neon password afterward.

---

## Support

For issues or contributions related to this project, open an issue on GitHub or contact the kalapak-team maintainers.
