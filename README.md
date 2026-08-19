# DentalCare

A dental appointment management system with a Spring Boot backend and a React (Vite) frontend, fully containerized with Docker.

## Tech Stack

- **Backend:** Spring Boot (Java 21), Spring Data JPA, Spring Security (JWT)
- **Frontend:** React + Vite
- **Database:** MySQL 8.0
- **Cache:** Redis 7.2
- **Containerization:** Docker, Docker Compose
- **API Docs:** springdoc-openapi (Swagger UI)

## Project Structure

```
dentalcare/
├── .env.template              # Root-level template (Docker Compose vars)
├── docker-compose.yml         # Full stack (backend, frontend, MySQL, Redis)
├── docker-compose.dev.yml     # Just MySQL + Redis, for local dev without Docker
├── backend/
│   ├── src/
│   ├── .env.example           # Template for backend secrets
│   ├── application.properties
│   ├── application-dev.properties
│   ├── application-docker.properties
│   └── Dockerfile
└── frontend/
    ├── src/
    ├── .env.example            # Template for frontend config
    └── Dockerfile
```

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/rgrmlbn/Dental-Appointment-System.git
cd Dental-Appointment-System
```

### 2. Configure root environment variables (for Docker Compose)

```bash
cp .env.template .env
```

Open `.env` and set:

```
DB_PASSWORD=your_own_db_password
```

This feeds `${DB_PASSWORD}` inside `docker-compose.yml`, which sets MySQL's root password when the container starts.

### 3. Configure backend environment variables

```bash
cd backend
cp .env.example .env
```

Open `backend/.env` and fill in your own values:

```
DB_USERNAME=root
DB_PASSWORD=your_own_db_password
JWT_SECRET=a_long_random_string
RESEND_API_KEY=re_your_resend_api_key
OWNER_EMAIL=your_gmail_address
```

> `DB_PASSWORD` here should match the value you set in the root `.env` — the root file configures MySQL itself, this one tells Spring Boot what password to connect with.

### 4. Configure frontend environment variables

```bash
cd ../frontend
cp .env.example .env
```

Default values work out of the box for local Docker use:

```
VITE_API_URL=http://localhost:8080
```

### 5. Run the full stack with Docker

From the project root:

```bash
docker-compose up --build
```

This starts:
- MySQL on `localhost:3306`
- Redis on `localhost:6379`
- Backend API on `localhost:8080`
- Frontend on `localhost:5173`

### 6. Access the app

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:8080](http://localhost:8080)
- Swagger docs: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

## Running the Backend Locally (without Docker)

Useful for active backend development with hot reload / debugging in an IDE.

1. Start just the database and cache:
   
   ```bash
   docker-compose -f docker-compose.dev.yml up
   ```
3. Open the `backend/` folder in your IDE (e.g. IntelliJ) as its own project.
4. Make sure `backend/.env` is filled in — it's read automatically via `spring-dotenv`.
5. Run the Spring Boot application (`dev` profile is active by default).

## Running the Frontend Locally (without Docker)

```bash
cd frontend
npm install
npm run dev
```

Runs on [http://localhost:5173](http://localhost:5173) by default, pointing at whatever `VITE_API_URL` is set in `frontend/.env`.

## Environment Variables Reference

### Root (`.env`)

| Variable | Description |
|---|---|
| `DB_PASSWORD` | MySQL root password (used by Docker Compose to configure the `mysql` service) |

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `DB_USERNAME` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `JWT_SECRET` | Secret key used to sign JWT tokens |
| `RESEND_API_KEY` | Resend API key used for sending emails |
| `OWNER_EMAIL` | Gmail address used for receiving emails) |

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API |

## Notes

- Never commit `.env` files — only `.env.template` files are tracked in git.
- `application-dev.properties` and `application-docker.properties` are safe to commit; they only reference environment variables (`${VAR}`), never real values.
- Rate limiting for login attempts is configured via `app.rate-limit.login.*` in the properties files and backed by Redis.
- To reset the database to a clean state, stop containers and remove volumes:
  
  ```bash
  docker-compose down -v
  ```
- Remember to generate a fresh, unique `JWT_SECRET` for every real project you spin off from this template — never reuse the same secret across projects.
