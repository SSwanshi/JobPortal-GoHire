# GoHire (Admin + Recruiter + Applicant)

This repo contains **3 separate apps**:

- **Admin**: `goHire/admin` (React/Vite frontend + Node/Express backend)
- **Recruiter**: `goHire/recruiter` (React/Vite frontend + Node/Express backend)
- **Applicant**: `goHire/applicant` (React/Vite frontend + Node/Express backend)

## Prerequisites

- **Node.js** (recommended: current LTS)
- **npm** (ships with Node)
- **MongoDB** running locally (or MongoDB Atlas connection strings)

## One-time setup (install deps)

Run `npm install` inside each service folder.

```bash
cd "React GoHire/goHire/admin/backend" && npm install
cd "React GoHire/goHire/admin/frontend" && npm install

cd "React GoHire/goHire/recruiter/backend" && npm install
cd "React GoHire/goHire/recruiter/frontend" && npm install

cd "React GoHire/goHire/applicant/backend" && npm install
cd "React GoHire/goHire/applicant/frontend" && npm install
```

## Environment variables

Create the `.env` files below (paths are relative to this `README.md`).

### Admin

**`goHire/admin/backend/.env`**

```env
PORT=9000
MONGO_URI_ADMIN=mongodb://localhost:27017/admin_db
MONGO_URI_RECRUITERS=mongodb://localhost:27017/recruiter_db
MONGO_URI_APPLICANT=mongodb://localhost:27017/applicant_db
SESSION_SECRET=admin-secret-key-change-me
FRONTEND_URL=http://localhost:5173
```

**`goHire/admin/frontend/.env`**

```env
VITE_API_BASE=http://localhost:9000
```

### Recruiter

**`goHire/recruiter/backend/.env`** (minimum)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/recruiter_db
FRONTEND_URL=http://localhost:5175
```

> Note: `recruiter/backend` can optionally connect to the applicant DB if you set `MONGO_URI_APPLICANT`.

**`goHire/recruiter/frontend/.env`**

```env
VITE_API_BASE=http://localhost:5000
```

### Applicant

**`goHire/applicant/backend/.env`** (minimum)

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/applicant_db
FRONTEND_URL=http://localhost:5174
```

**`goHire/applicant/frontend/.env`**

```env
VITE_API_BASE=http://localhost:3000
```

## Run all 3 apps locally (6 terminals)

Each “server” below is an app: **Admin**, **Applicant**, **Recruiter**.
Start **backend first**, then **frontend**.

### 1) Admin (port 9000 + 5173)

```bash
cd "React GoHire/goHire/admin/backend" && npm run dev
```

```bash
cd "React GoHire/goHire/admin/frontend" && npm run dev
```

- **Admin API**: `http://localhost:9000/api/health`
- **Admin UI**: `http://localhost:5173`

### 2) Applicant (port 3000 + 5174)

```bash
cd "React GoHire/goHire/applicant/backend" && npm run dev
```

```bash
cd "React GoHire/goHire/applicant/frontend" && npm run dev
```

- **Applicant API**: `http://localhost:3000/api/health`
- **Applicant UI**: `http://localhost:5174`

### 3) Recruiter (port 5000 + 5175)

```bash
cd "React GoHire/goHire/recruiter/backend" && npm run dev
```

```bash
cd "React GoHire/goHire/recruiter/frontend" && npm run dev
```

- **Recruiter API**: `http://localhost:5000/api/health`
- **Recruiter UI**: `http://localhost:5175`

## Common issues

- **Vite “Port is already in use”**: these frontends use `strictPort: true`:
  - Admin: `5173`
  - Applicant: `5174`
  - Recruiter: `5175`
  Stop the process using the port, or change the port in the relevant `vite.config.js`.

- **CORS errors**: ensure each backend `.env` has the correct `FRONTEND_URL` matching the UI you’re running.

- **Mongo connection errors**: confirm MongoDB is running and the `MONGO_URI*` values point to valid databases.

