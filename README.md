# Seanghai Phone Shop

E-commerce phone shop inspired by a Cambodian retail layout, branded as **Seanghai Phone Shop**.

## Stack

- **Backend:** Java 21, Spring Boot 4, Spring Security (JWT), Spring Data JPA
- **Database:** PostgreSQL 16
- **User storefront:** Next.js 15, React 19, Tailwind CSS (`user-frontend`, port 3000)
- **Admin dashboard:** Next.js 15, React 19, Tailwind CSS (`admin-frontend`, port 3001)

```
Seanghai_Phone_Shop/
├── backend/           Spring Boot REST API
├── user-frontend/     Customer website
├── admin-frontend/    Admin dashboard
└── docker-compose.yml PostgreSQL
```

## Run locally

### 1. Database

```bash
docker compose up -d
```

PostgreSQL is published on **localhost:5433** so it does not clash with a local Postgres install on 5432.

### 2. Backend

```bash
cd backend
./mvnw spring-boot:run
```

On Windows:

```bash
cd backend
.\mvnw.cmd spring-boot:run
```

API: `http://localhost:8080/api`

If port 5432 is already used on your machine, this project uses **5433** by default.

### 3. Storefront

```bash
cd user-frontend
npm install
npm run dev
```

Open `http://localhost:3000`

### 4. Admin

```bash
cd admin-frontend
npm install
npm run dev
```

Open `http://localhost:3001`

## Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@seanghaiphone.com` | `Admin@123` |
| Customer | `customer@seanghaiphone.com` | `Customer@123` |

## Storefront features

- Homepage with hero slider, brand strip, featured products, Apple/Samsung/OPPO/Xiaomi/Vivo sections, secondhand, accessories
- Category, brand, search, product detail, cart, guest checkout
- Telegram chat button, Facebook announcement, store locations, KHQR/ABA payment badges

## Admin features

- Dashboard stats
- Product / brand / category / banner CRUD
- Order status updates
- Customers and shop settings
