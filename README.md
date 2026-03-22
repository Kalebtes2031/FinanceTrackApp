# FinanceTrackApp

Personal Finance Dashboard for tracking balances, transactions, and spending across multiple accounts (bank, mobile money, cash). Built with Django REST Framework on the backend and React Native (Expo) on the frontend.

**Highlights**
- Multi‑account support per user
- Income, expense, and transfer transactions
- Real‑time balance updates
- Category‑based spending summary
- JWT authentication with refresh flow
- Secure token storage on device
- Clean architecture with modular Django apps

---

## Features

**Accounts**
- Create and manage bank, mobile money, and cash accounts
- Soft‑delete (archive) accounts to preserve history

**Transactions**
- Income, expense, and transfer flows
- Automatic balance updates on create/update/delete
- Data integrity enforced at the model level

**Dashboard**
- Total balance
- Balance per account
- Recent transactions
- Spending by category (with chart)

**Categories**
- Split by income and expense
- Add, edit, and delete categories

**Security**
- JWT access + refresh tokens
- Device‑side secure storage (Expo Secure Store)
- DRF throttling and input validation

---

## Tech Stack

**Backend**
- Django + Django REST Framework
- Djoser + SimpleJWT
- SQLite (development), PostgreSQL (production)

**Frontend**
- React Native (Expo)
- TanStack React Query
- Zustand (auth + toast state)

---

## Project Structure

```
backend/
  apps/
    accounts/
    transactions/
    categories/
    dashboard/
    users/
  core/
  config/

frontend/
  app/
  api/
  components/
  hooks/
  store/
```

---

## Backend Setup

```bash
cd backend
pipenv install
pipenv shell
cp .env.example .env
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 0.0.0.0:8000
```

---

## Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:
```
EXPO_PUBLIC_API_URL=http://<YOUR_LAN_IP>:8000/api
```

Run:
```bash
npm start
```

---

## Environment Variables

**Backend (`backend/.env`)**
- `DEBUG`
- `SECRET_KEY`
- `ALLOWED_HOSTS`
- `DATABASE_URL`
- `CORS_ALLOW_ALL`
- `ALLOW_NEGATIVE_BALANCES`
- `THROTTLE_ANON`
- `THROTTLE_USER`
- `TIME_ZONE`
- `ACCESS_TOKEN_MINUTES`
- `REFRESH_TOKEN_DAYS`

**Frontend (`frontend/.env`)**
- `EXPO_PUBLIC_API_URL`

---

## API Endpoints (Summary)

**Auth**
- `POST /api/auth/users/` Register
- `POST /api/auth/jwt/create/` Login
- `POST /api/auth/jwt/refresh/` Refresh token
- `GET /api/auth/users/me/` Profile

**Core**
- `/api/accounts/`
- `/api/transactions/`
- `/api/categories/`
- `/api/dashboard/`

---

## Useful Commands

**Recalculate all balances**
```bash
python manage.py recalculate_balances
```

---

## Notes
- Use HTTPS in production.
- Use PostgreSQL for production.
- For soft‑deleted accounts, data is preserved but hidden from lists.

---

## License

MIT (or replace with your preferred license)
