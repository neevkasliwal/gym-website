# 🏋️ IronCore Gym: Full-Stack Gym Management Website

A gym website where visitors can browse classes and trainers, members can buy a membership by UPI and book classes, and admins run the whole gym from one dashboard.

**Built with:** Next.js 16 · React 19 · Express 5 · MongoDB (Mongoose) · JWT auth

---

## ✨ What can it do?

### 👀 For visitors (no login needed)
- Browse the **Home, About, Classes, Trainers, Memberships and Gallery** pages
- Send a message through the **Contact** form

### 🧑‍🤝‍🧑 For members
- Sign up and log in securely (passwords are hashed with bcrypt, sessions use JWT)
- **Buy a membership:** pick a plan, scan the UPI QR code, submit your UTR (transaction) number
- **Book and cancel classes.** Booking is blocked once a class hits its capacity
- See your **membership status, expiry date and payment history** on your dashboard

### 🛠️ For admins
- Review **pending payments** and approve or reject them with one click
- Add, edit and delete **classes, trainers and membership plans**
- View all **members** and all **payment history**
- Read messages sent through the contact form
- Admin login needs an extra **secret key**, so a stolen password alone is not enough

---

## 💳 How a membership purchase works

```
Member picks a plan
        │
        ▼
Scans the UPI QR and pays ──► Submits the UTR number on the site
                                      │
                                      ▼
                        Payment is saved as "pending"
                                      │
                                      ▼
                    Admin checks it in the dashboard
                       │                        │
                  ✅ Approve                ❌ Reject
                       │                        │
     Membership becomes active          Member sees the reason
     and the expiry date is set
```

Good to know:
- Each UTR number can only be submitted **once**, which blocks duplicate claims.
- If a member renews while still active, the new plan **extends from their current expiry date**, so no days are lost.

---

## 🗂️ Project structure

```
gym-website/
├── frontend/                 # Next.js app (App Router)
│   ├── src/app/              # Pages: home, about, classes, trainers,
│   │                         #   memberships, gallery, contact, auth, dashboard
│   ├── src/components/       # Navbar, Footer
│   ├── src/services/api.js   # One place for all calls to the backend
│   └── public/               # Images and the payment QR code
│
└── backend/                  # Express REST API
    ├── server.js             # Entry point, DB connection, seed data
    ├── routes/               # URL → controller mapping
    ├── controllers/          # Business logic
    ├── models/               # Mongoose schemas
    └── middleware/           # JWT auth (protect) and admin-only check
```

---

## 🚀 Getting started

### What you need
- [Node.js](https://nodejs.org/) 20 or newer
- A MongoDB database: a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster works, or a local install

### 1. Clone the repo

```bash
git clone https://github.com/neevkasliwal/gym-website.git
cd gym-website
```

### 2. Start the backend

```bash
cd backend
npm install
```

Create a file called `backend/.env`:

```env
MONGO_URI=mongodb://localhost:27017/gym        # or your Atlas connection string
JWT_SECRET=replace-with-a-long-random-string
ADMIN_SECRET_KEY=replace-with-your-admin-key
PORT=8000
```

Then run it:

```bash
npm run dev
```

You should see `MongoDB Connected` and `Server running on port 8000`.

### 3. Start the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:3000** 🎉

> **Heads up on ports:** the frontend calls `http://localhost:8000/api` by default, which is why the backend `PORT` is set to `8000` above. To use a different port, create `frontend/.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:<your-port>/api`.

---

## 🔑 Admin access

On first start, the backend creates a default admin account (`admin@ironcore.com`) and fills an empty database with sample plans, classes and trainers. To log in as admin you need that account's password (set in `backend/server.js`) plus the `ADMIN_SECRET_KEY` from your `.env`.

---

## 🔌 API overview

All routes start with `/api`. 🔓 means public, 🔒 means login required, and "admin" means admin only.

| Area | Endpoints |
|------|-----------|
| **Auth** | `POST /auth/register` 🔓 · `POST /auth/login` 🔓 · `GET /auth/me` 🔒 |
| **Classes** | `GET /classes` 🔓 · `POST` `PUT /:id` `DELETE /:id` (admin) |
| **Trainers** | `GET /trainers` 🔓 · `POST` `PUT /:id` `DELETE /:id` (admin) |
| **Plans** | `GET /plans` 🔓 · `GET /plans/all` `POST` `PUT /:id` `DELETE /:id` (admin) |
| **Bookings** | `POST /bookings` 🔒 · `GET /bookings/user` 🔒 · `PUT /bookings/:id/cancel` 🔒 · `GET /bookings/all` (admin) · `PUT /bookings/:id/status` (admin) |
| **Payments** | `POST /payments` 🔒 · `GET /payments/user` 🔒 · `GET /payments` (admin) · `PUT /payments/:id/approve` (admin) · `PUT /payments/:id/reject` (admin) |
| **Users** | `GET /users` (admin) · `PUT /users/:id` 🔒 (own profile, or any user for admins) · `DELETE /users/:id` (admin) |
| **Contact** | `POST /contact` 🔓 · `GET /contact` (admin) |

Protected routes expect the header `Authorization: Bearer <token>`.

---

## 🧱 Data models

| Model | Key fields |
|-------|-----------|
| **User** | name, email, role (`member` / `admin`), membershipStatus (`inactive` / `pending` / `active` / `expired`), membershipExpiry |
| **MembershipPlan** | name, price, durationDays, features, isPopular |
| **Class** | title, category, trainer, day, time, capacity, difficulty |
| **Trainer** | name, specialization, experience, certifications, bio |
| **Booking** | user, class, status (`confirmed` / `cancelled`) |
| **Payment** | user, plan, amount, transactionId (UTR), status (`pending` / `approved` / `rejected`) |
| **ContactMessage** | name, email, message |

---

## 👥 Contributors

Built by [Neev Kasliwal](https://github.com/neevkasliwal) and [Yash](https://github.com/yash75576-blip).

Contributions are welcome. Fork the repo, create a branch, and open a pull request.
