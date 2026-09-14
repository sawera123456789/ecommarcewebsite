# Full-Stack E-Commerce Website

This project contains a production-ready full-stack ecommerce application with:

- Frontend: React + Vite
- Backend: Node.js + Express + MongoDB + Mongoose
- Authentication: JWT + bcrypt
- REST API with MongoDB persistence
- Responsive UI
- Admin and user roles

## Folder Structure

```text
 ecommerce/
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── utils/
│   ├── uploads/
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   └── utils/seed.js
├── README.md
└── .gitignore
```

## Prerequisites

- Node.js 18+
- MongoDB running locally or MongoDB Atlas
- npm

## Backend Setup

1. Go to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill values:
   ```bash
   cp .env.example .env
   ```
4. Start MongoDB.
5. Run the backend:
   ```bash
   npm run dev
   ```
6. Seed the database:
   ```bash
   npm run seed
   ```

## Frontend Setup

1. Go to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with:
   ```bash
   VITE_API_URL=http://localhost:5000/api
   ```
4. Run the frontend:
   ```bash
   npm run dev
   ```

## Default Admin Account

Use the seeded admin account from `.env`:

- Email: admin@example.com
- Password: Admin@123

## Deployment Notes

- Frontend: deploy on Vercel
- Backend: deploy on Render or Railway
- Database: MongoDB Atlas

## Important Notes

- This project includes a real backend API, JWT auth, MongoDB persistence, and a responsive frontend.
- Some placeholder pages are included for pages where a fully custom workflow would require additional services (email, payment, image hosting).
- The app is structured to be extended with real payment and cloud storage integrations.
