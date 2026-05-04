# StyleCart 🛍️

A modern online clothing shopping website built using the MERN Stack.

## Live Demo
- Frontend: Coming Soon
- Backend API: Coming Soon

## Tech Stack
- **Frontend:** React.js, React Router, Axios, CSS
- **Backend:** Node.js, Express.js, JWT, Bcrypt
- **Database:** MongoDB Atlas (Cloud)
- **Deployment:** Vercel (Frontend) + Render (Backend)

## Features
- User Authentication (Login & Signup with JWT)
- Product Listing with Advanced Filters
- Shopping Cart with Real-time Price Calculation
- Secure Checkout with Multiple Payment Options
- User Profile Dashboard
- Order History Tracking
- Wishlist Management
- Protected Routes
- MongoDB Atlas Integration
- Responsive Design

## Project Structure

stylecart/
├── client/          → React.js Frontend
├── server/          → Node.js + Express Backend
├── README.md        → Project Documentation
└── .gitignore       → Git Ignore File

## How to Run Locally

### Backend
cd server
npm install
node server.js

### Frontend
cd client
npm install
npm start

### Environment Variables
Create a .env file in the server folder with:
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key

## API Endpoints

### Auth Routes
- POST /api/auth/register → Register new user
- POST /api/auth/login → Login user
- GET /api/auth/profile → Get user profile
- PUT /api/auth/profile → Update user profile
- DELETE /api/auth/profile → Delete user account

### Product Routes
- GET /api/products → Get all products
- GET /api/products/:id → Get single product
- POST /api/products → Create product
- PUT /api/products/:id → Update product
- DELETE /api/products/:id → Delete product

### Order Routes
- POST /api/orders → Place new order
- GET /api/orders → Get user orders
- PUT /api/orders/:id → Update order status
- DELETE /api/orders/:id → Delete order

## Team Members
- Sidharth SS — RA2311056010267
- [Member 2 Name] — [Register Number]
- [Member 3 Name] — [Register Number]

## Course
Full Stack Development — MERN Stack
SRM Institute of Science and Technology

## Live Demo
- Frontend: https://stylecart-bpfgfn3hr-sid-004ss-projects.vercel.app
- Backend API: https://stylecart-backend-xne0.onrender.com