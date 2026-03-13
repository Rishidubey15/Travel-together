# Travel Together – Travel Buddy Finder

A minimal full-stack web application that helps users find travel companions from their organisation. It includes sign up/login, a home page, organisation verification (UI only), and a list of organisation rides (mock data).

---

## What This App Does

- **User accounts:** Users can sign up (name, email, password) and log in. Passwords are hashed and stored in MongoDB. Sessions are handled by Better Auth.
- **Home:** After login, users see the app name, a short description, and three platform services. A button takes them to organisation verification.
- **Organisation verification:** A page where users enter their work email. Clicking “Verify with Organisation Email” redirects to a dummy verification page (no real verification logic). From there they can go to the rides list.
- **Organisation rides:** A page that shows example rides (e.g. Delhi → Manali, Bangalore → Goa) with destination, date, budget, and “Request to Join”. Data is mock-only; no backend for booking or matching.

---

## Tech Stack

| Layer      | Technology |
|-----------|------------|
| Frontend  | React, TailwindCSS, Vite, React Router |
| Backend   | Node.js, Express |
| Database  | MongoDB |
| Auth      | Better Auth (email/password, sessions, hashed passwords) |
| API       | REST (auth via Better Auth at `/api/auth/*`) |

---

## Project Structure

```
major-project2/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── pages/           # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── VerifyOrganisation.jsx
│   │   │   └── OrganisationRides.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── RideCard.jsx
│   │   ├── lib/
│   │   │   └── auth-client.js   # Better Auth React client
│   │   ├── App.jsx             # Routes + protected/public guards
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js        # Dev server + proxy /api → backend
│   └── package.json
│
├── server/                  # Express backend
│   ├── auth.js              # Better Auth config + MongoDB adapter
│   ├── server.js            # Express app, CORS, mount /api/auth/*
│   ├── routes/
│   │   └── auth.js          # Optional auth-related routes (e.g. session)
│   ├── models/
│   │   └── User.js          # User schema reference (actual storage via Better Auth)
│   ├── .env                 # Secrets (create from .env.example)
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## How It Works (User Flow)

1. User opens the app → if not logged in, they are sent to **Login** (or can go to **Sign up**).
2. After **Sign up** or **Login**, they are redirected to **Home**.
3. On Home, they click **“Verify Organisation to View Rides”** → they land on **Verify Organisation**.
4. They enter an organisation email and click **“Verify with Organisation Email”** → they are redirected to a dummy page: “Redirecting to organisation verification service...”.
5. They click **“Continue to Rides”** → they see **Organisation Rides** (mock list). The “Request to Join” button is UI-only.

Protected routes (Home, Verify Organisation, Organisation Rides) require a valid session; otherwise the user is redirected to Login.

---

## Routes Overview

| Path | Description |
|------|-------------|
| `/login` | Login form (email, password). Redirects to Home on success. |
| `/signup` | Sign up form (name, email, password). Redirects to Home on success. |
| `/` | Home page (protected). |
| `/verify-organisation` | Organisation verification form (protected). |
| `/verify-organisation/external` | Dummy “redirecting…” page (protected). |
| `/organisation-rides` | List of mock rides (protected). |

All auth API calls go to `/api/auth/*` (handled by Better Auth on the server). The Vite dev server proxies `/api` to the backend so the browser talks to the same origin in development.

---

## Prerequisites

- **Node.js** 18 or newer
- **MongoDB** running locally (e.g. `mongodb://localhost:27017`) or a remote connection string  
  - Use a **standalone** MongoDB instance (no replica set required).

---

## Setup and Run

### 1. Clone and open the project

```bash
cd major-project2
```

### 2. Configure the server environment

```bash
cd server
cp .env.example .env
```

Edit `server/.env` and set:

| Variable | Description | Example |
|----------|-------------|---------|
| `BETTER_AUTH_SECRET` | Secret for auth (min 32 characters). | Generate with: `openssl rand -base64 32` |
| `BETTER_AUTH_URL` | Full URL of the backend (used for redirects/callbacks). | `http://localhost:5001` |
| `MONGODB_URI` | MongoDB connection string. | `mongodb://localhost:27017` |
| `DATABASE_NAME` | Database name for the app. | `travel_together` |

Example `.env`:

```env
BETTER_AUTH_SECRET=your-generated-secret-from-openssl-rand-base64-32
BETTER_AUTH_URL=http://localhost:5001
MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=travel_together
```

### 3. Install dependencies

**Backend:**

```bash
cd server
npm install
```

**Frontend:**

```bash
cd client
npm install
```

### 4. Run the app

You need two terminals.

**Terminal 1 – backend**

```bash
cd server
npm run dev
```

The API server will run at **http://localhost:5001**.

**Terminal 2 – frontend**

```bash
cd client
npm run dev
```

The React app will run at **http://localhost:5173**. In development, requests to `/api` are proxied to `http://localhost:5001`.

### 5. Use the app

1. Open **http://localhost:5173** in your browser.
2. Sign up with name, email, and password (or log in if you already have an account).
3. You’ll land on Home. Click **“Verify Organisation to View Rides”**.
4. Enter any work email and click **“Verify with Organisation Email”**.
5. On the next page, click **“Continue to Rides”** to see the mock organisation rides.

---

## Database (User Model)

Better Auth stores users and related data in MongoDB. The **user** document shape (conceptually) is:

- `id` – User ID (Better Auth)
- `name` – Display name
- `email` – Email (used for login)
- `emailVerified` – Whether email is verified (Better Auth)
- `isVerified` – Custom field (organisation verification; set in `server/auth.js` via `user.additionalFields`)
- `organisationDomain` – Custom field (organisation domain; optional)
- Passwords are hashed and stored in Better Auth’s account/credential storage, not as plain text in the user document.

Collections are created and managed by Better Auth (e.g. `user`, `session`, `account`). No manual migration is required for MongoDB.

---

## What Is *Not* Implemented (By Design)

This is a minimal app. The following are **not** implemented:

- Travel buddy matching logic  
- Chat or messaging  
- Admin dashboard  
- Real organisation verification (backend or email)  
- Booking or “Request to Join” backend logic  
- Travel plan creation  

---

## Troubleshooting

- **Port already in use:** If port 5001 (or 5173) is in use, either stop the other process or change the port (e.g. set `PORT=5002` in `server/.env` and update `BETTER_AUTH_URL` and the proxy target in `client/vite.config.js`).
- **MongoDB “Transaction numbers are only allowed on a replica set”:** The app is configured to work with a **standalone** MongoDB (no replica set). The Better Auth MongoDB adapter is used without the `client` option so transactions are disabled. Do not pass a replica-set-only URI unless you intend to use a replica set.
- **403 on `/api/auth/get-session` or sign up fails:** Ensure the backend is running on the port specified in `BETTER_AUTH_URL` and that the Vite proxy in `client/vite.config.js` points to the same port. Ensure `BETTER_AUTH_SECRET` is set and at least 32 characters.

---

## License

This project is for educational/demo use. Adjust as needed for your own use case.
