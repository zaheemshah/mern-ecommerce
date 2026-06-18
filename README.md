# MERN E-Commerce Application

A full-stack production-ready e-commerce web application built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

### User Features
- Home page with featured products, new arrivals, and best sellers
- Product browsing with search, filtering, sorting, and pagination
- Product details with reviews, ratings, and related products
- Shopping cart and wishlist
- Secure checkout and order history
- User dashboard and profile management
- Dark / light mode toggle

### Authentication
- User registration and login
- JWT authentication with Remember Me
- Forgot password and reset password
- Protected routes

### Admin Features
- Admin dashboard with sales statistics and revenue charts
- Product management (CRUD with image upload)
- Category management (CRUD)
- User management
- Order management

### Security
- JWT authentication
- bcrypt password hashing
- Rate limiting
- CORS configuration
- Input validation (express-validator)
- Helmet security headers
- MongoDB injection protection (express-mongo-sanitize)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, React Router, Axios, Vite |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT, bcrypt |
| Upload | Multer |

## Project Structure

```
mern-ecommerce/
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/            # Axios instance & API services
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Auth & Theme context
│   │   ├── pages/          # Route pages
│   │   │   └── admin/      # Admin panel pages
│   │   └── utils/          # Helper functions
│   └── vercel.json         # Frontend deployment config
├── server/                 # Express backend
│   ├── config/             # Database config
│   ├── controllers/        # Route controllers (MVC)
│   ├── middleware/         # Auth, upload, validation, errors
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── utils/              # Token, email, API features
│   ├── uploads/            # Uploaded product images
│   └── seeder.js           # Sample data seeder
└── README.md
```

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone and install

```bash
cd mern-ecommerce

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment variables

**Server** — copy `server/.env.example` to `server/.env`:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/mern-ecommerce
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7
CLIENT_URL=http://localhost:5173
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_pass
EMAIL_FROM=noreply@mernshop.com
```

**Client** — copy `client/.env.example` to `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed the database

```bash
cd server
npm run seed
```

Default accounts:
- **Admin:** admin@shop.com / admin123
- **User:** user@shop.com / user123

### 4. Run the application

```bash
# Terminal 1 — Backend
cd server
npm run dev

# Terminal 2 — Frontend
cd client
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |
| POST | /api/auth/logout | Logout user |
| GET | /api/auth/me | Get current user |
| POST | /api/auth/forgot-password | Send reset email |
| PUT | /api/auth/reset-password/:token | Reset password |
| GET | /api/products | Get all products |
| GET | /api/products/featured | Featured products |
| GET | /api/products/new-arrivals | New arrivals |
| GET | /api/products/best-sellers | Best sellers |
| GET | /api/products/search/suggestions | Search suggestions |
| GET/POST/PUT/DELETE | /api/categories | Category CRUD |
| GET/POST/PUT/DELETE | /api/cart | Cart operations |
| GET/POST/DELETE | /api/wishlist | Wishlist operations |
| POST/GET | /api/orders | Order operations |
| GET/POST/DELETE | /api/reviews | Review operations |
| GET | /api/admin/dashboard | Admin statistics |
| GET/PUT/DELETE | /api/admin/users | User management |

## Deployment

### Frontend (Vercel / Netlify)
1. Build: `cd client && npm run build`
2. Deploy the `client/dist` folder
3. Set `VITE_API_URL` to your production API URL

### Backend (Render / Railway / Heroku)
1. Set all environment variables from `.env.example`
2. Start command: `node server.js`
3. Set `CLIENT_URL` to your frontend URL

## License

MIT
