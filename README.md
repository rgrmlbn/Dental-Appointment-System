# DentalCare

A dental appointment management system with a Spring Boot backend and a React (Vite) frontend, fully containerized with Docker.

## Tech Stack

- **Backend:** Spring Boot (Java 21), Spring Data JPA, Spring Security (JWT)
- **Frontend:** React + Vite
- **Database:** MySQL 8.0
- **Cache:** Redis 7.2
- **Containerization:** Docker, Docker Compose

## Project Structure

```
dentalcare/
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
- (Optional, for local non-Docker backend dev) Java 21 and Maven
- (Optional, for local non-Docker frontend dev) Node.js 20+

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/rgrmlbn/Dental-Appointment-System.git
cd Dental-Appointment-System
```

### 2. Configure backend environment variables

```bash
cd backend
cp .env.example .env
```

Open `backend/.env` and fill in your own values:

```
DB_USERNAME=root
DB_PASSWORD=your_own_db_password
JWT_SECRET=a_long_random_string
MAIL_USERNAME=your_gmail_address
MAIL_PASSWORD=your_gmail_app_password
```

> Note: `MAIL_PASSWORD` must be a [Gmail App Password](https://myaccount.google.com/apppasswords), not your regular Gmail login password.

### 3. Configure frontend environment variables

```bash
cd ../frontend
cp .env.example .env
```

Default values work out of the box for local Docker use:

```
VITE_API_URL=http://localhost:8080
```

### 4. Run the full stack with Docker

From the project root:

```bash
docker-compose up --build
```

This starts:
- MySQL on `localhost:3306`
- Redis on `localhost:6379`
- Backend API on `localhost:8080`
- Frontend on `localhost:5173`

### 5. Access the app

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:8080](http://localhost:8080)
- Swagger docs: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

## Running the Backend Locally (without Docker)

Useful for active backend development with hot reload / debugging in an IDE.

1. Start just the database and cache:
   ```bash
   docker-compose -f docker-compose.dev.yml up
   ```
2. Open the `backend/` folder in your IDE (e.g. IntelliJ) as its own project.
3. Make sure `backend/.env` is filled in — it's read automatically via `spring-dotenv`.
4. Run the Spring Boot application (`dev` profile is active by default).

## Running the Frontend Locally (without Docker)

```bash
cd frontend
npm install
npm run dev
```

Runs on [http://localhost:5173](http://localhost:5173) by default, pointing at whatever `VITE_API_URL` is set in `frontend/.env`.

## Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `DB_USERNAME` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `JWT_SECRET` | Secret key used to sign JWT tokens |
| `MAIL_USERNAME` | Gmail address used for sending emails |
| `MAIL_PASSWORD` | Gmail App Password (not your regular password) |

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API |

## Notes

- Never commit `.env` files — only `.env.example` files are tracked in git.
- `application-dev.properties` and `application-docker.properties` are safe to commit; they only reference environment variables (`${VAR}`), never real values.
- To reset the database to a clean state, stop containers and remove volumes:
  ```bash
  docker-compose down -v
  ```
