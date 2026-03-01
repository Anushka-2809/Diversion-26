# Aqua Delight

A full-stack seafood e-commerce platform with AI-powered fish freshness analysis and recipe recommendations. Buyers can browse, purchase, and track orders for fresh seafood, while sellers can list products, manage inventory, and fulfill orders through a dedicated dashboard.

---

## Features

**Authentication and Authorization**
- Role-based authentication (Buyer / Seller) with JWT tokens
- Secure password hashing with bcrypt
- Protected routes on both frontend and backend
- Seller verification system with business license support

**Product Management**
- Sellers can create, update, and delete fish/seafood listings
- Image upload and storage via Cloudinary
- Product categories: Premium Fish, Premium Shrimp and Prawns, Premium Crabs, Exotic and Luxury Seafood, Local Fish
- Harvest date, origin, and availability tracking

**AI-Powered Fish Freshness Analysis**
- Automatic image analysis using Google Gemini 2.5 Flash Vision API
- Freshness score (0-100) with detailed breakdown: color, texture, transparency, eyes condition, and smell indicator
- Certification status and overall quality rating
- Actionable recommendations for each product

**AI-Generated Recipe Recommendations**
- Gemini-powered recipe suggestions for each fish product
- Automatic YouTube video search for matching recipe tutorials
- Thumbnails and video metadata displayed on product pages

**Shopping and Orders**
- Add-to-cart with persistent local storage
- Checkout with delivery address and multiple payment methods (Credit Card, Debit Card, UPI, Net Banking, Cash on Delivery)
- Order tracking with status progression: Pending, Confirmed, Processing, Shipped, Delivered, Cancelled
- Auto-generated order IDs and tracking numbers

**Dashboards**
- Buyer dashboard: order history, profile management
- Seller dashboard: product listings, order management, status updates, analytics with charts

**UI / UX**
- Animated landing page with Framer Motion
- Responsive design with Tailwind CSS v4
- Component library built on shadcn/ui and Radix UI primitives
- Toast notifications via Sonner

---

## Tech Stack

### Frontend

| Technology        | Purpose                          |
|-------------------|----------------------------------|
| React 19          | UI framework                     |
| Vite              | Build tool and dev server        |
| Tailwind CSS v4   | Utility-first styling            |
| React Router v7   | Client-side routing              |
| React Query       | Server state management          |
| Framer Motion     | Animations                       |
| Radix UI          | Accessible component primitives  |
| shadcn/ui         | Pre-built UI components          |
| Recharts          | Dashboard charts and analytics   |
| Zod               | Schema validation                |
| React Hook Form   | Form handling                    |
| Lucide React      | Icon library                     |

### Backend

| Technology              | Purpose                              |
|-------------------------|--------------------------------------|
| Node.js                 | Runtime environment                  |
| Express 5               | Web framework                        |
| MongoDB / Mongoose      | Database and ODM                     |
| JWT (jsonwebtoken)      | Authentication tokens                |
| bcryptjs                | Password hashing                     |
| express-validator       | Request validation                   |
| Cloudinary              | Image upload and CDN                 |
| Multer                  | Multipart file upload handling       |
| Sharp                   | Image processing                     |
| Google Generative AI    | Gemini Vision for freshness analysis |
| yt-search               | YouTube recipe video search          |

---

## Project Structure

```
Diversion-26/
|
|-- backend/
|   |-- server.js                 # Express app entry point
|   |-- config/
|   |   |-- db.js                 # MongoDB connection
|   |   |-- cloudinary.js         # Cloudinary configuration
|   |-- controllers/
|   |   |-- authController.js     # Buyer authentication
|   |   |-- adminController.js    # Seller/admin authentication
|   |   |-- fishController.js     # Product CRUD and AI analysis
|   |   |-- cartController.js     # Cart operations
|   |   |-- orderController.js    # Order management
|   |-- middleware/
|   |   |-- auth.js               # JWT authentication middleware
|   |   |-- upload.js             # Multer/Cloudinary upload middleware
|   |-- models/
|   |   |-- User.js               # Buyer model
|   |   |-- Admin.js              # Seller/admin model
|   |   |-- Fish.js               # Product model with ML analysis fields
|   |   |-- Cart.js               # Shopping cart model
|   |   |-- Order.js              # Order model with status tracking
|   |-- routes/
|   |   |-- auth.js               # Buyer auth routes
|   |   |-- admin.js              # Seller auth routes
|   |   |-- fish.js               # Product routes
|   |   |-- cart.js               # Cart routes
|   |   |-- order.js              # Order routes
|   |-- utils/
|       |-- geminiService.js      # Gemini AI and YouTube integration
|
|-- frontend/
    |-- index.html
    |-- vite.config.js
    |-- src/
        |-- App.jsx               # Root component with routing
        |-- main.jsx              # Entry point
        |-- context/
        |   |-- AuthContext.jsx    # Authentication state management
        |   |-- CartContext.jsx    # Cart state management
        |-- components/
        |   |-- Navbar.jsx
        |   |-- Hero.jsx
        |   |-- FeaturedFish.jsx
        |   |-- WhyChoose.jsx
        |   |-- Testimonials.jsx
        |   |-- Newsletter.jsx
        |   |-- Footer.jsx
        |   |-- RecipeSection.jsx
        |   |-- ProtectedRoute.jsx
        |   |-- ui/               # shadcn/ui components
        |-- pages/
        |   |-- Index.jsx         # Landing page
        |   |-- Explore.jsx       # Browse products
        |   |-- ProductDetails.jsx# Product page with AI analysis
        |   |-- ProductListing.jsx# Seller: list a new product
        |   |-- EditProduct.jsx   # Seller: edit product
        |   |-- Cart.jsx          # Shopping cart
        |   |-- Checkout.jsx      # Checkout flow
        |   |-- UserDashboard.jsx # Buyer dashboard
        |   |-- SellerDashboard.jsx# Seller dashboard
        |   |-- Login.jsx
        |   |-- Signup.jsx
        |   |-- About.jsx
        |   |-- Contact.jsx
        |   |-- Notfound.jsx      # 404 page
        |-- hooks/
        |-- lib/
        |-- assets/
```

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB instance (local or MongoDB Atlas)
- Cloudinary account
- Google Gemini API key

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

GEMINI_API_KEY=your_google_gemini_api_key
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

The server starts on `http://localhost:5000` by default.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The development server starts on `http://localhost:5173` by default.

---

## API Endpoints

### Authentication (Buyers)

| Method | Endpoint            | Description          | Auth     |
|--------|---------------------|----------------------|----------|
| POST   | /api/auth/register  | Register new buyer   | No       |
| POST   | /api/auth/login     | Login buyer          | No       |
| GET    | /api/auth/profile   | Get buyer profile    | Required |
| PUT    | /api/auth/profile   | Update buyer profile | Required |

### Authentication (Sellers / Admins)

| Method | Endpoint              | Description            | Auth     |
|--------|-----------------------|------------------------|----------|
| POST   | /api/admin/register   | Register new seller    | No       |
| POST   | /api/admin/login      | Login seller           | No       |
| GET    | /api/admin/profile    | Get seller profile     | Required |
| PUT    | /api/admin/profile    | Update seller profile  | Required |
| GET    | /api/admin/dashboard  | Seller dashboard data  | Verified |

### Products (Fish)

| Method | Endpoint           | Description                              | Auth     |
|--------|--------------------|------------------------------------------|----------|
| GET    | /api/fish          | Get all available fish                   | No       |
| GET    | /api/fish/:id      | Get fish by ID (triggers recipe gen)     | No       |
| POST   | /api/fish          | Add new fish listing                     | Seller   |
| PUT    | /api/fish/:id      | Update fish listing                      | Seller   |
| DELETE | /api/fish/:id      | Delete fish listing                      | Seller   |

### Cart

| Method | Endpoint           | Description              | Auth     |
|--------|--------------------|--------------------------|----------|
| GET    | /api/cart          | Get user cart            | Required |
| POST   | /api/cart          | Add item to cart         | Required |
| PUT    | /api/cart/:itemId  | Update cart item qty     | Required |
| DELETE | /api/cart/:itemId  | Remove item from cart    | Required |

### Orders

| Method | Endpoint                    | Description              | Auth     |
|--------|-----------------------------|--------------------------|----------|
| POST   | /api/order                  | Create order from cart   | Required |
| GET    | /api/order                  | Get user orders          | Required |
| GET    | /api/order/:id              | Get order by ID          | Required |
| GET    | /api/order/seller/orders    | Get seller orders        | Seller   |
| PUT    | /api/order/:id/status       | Update order status      | Seller   |
| PUT    | /api/order/:id/payment      | Update payment status    | Seller   |

---

## AI / ML Features

### Fish Freshness Analysis

When a seller uploads a product image, the backend asynchronously sends the image to the Google Gemini 2.5 Flash Vision API. The model evaluates the fish image and returns:

- **Freshness Score** (0-100): Overall freshness rating
- **Color Analysis Score**: Evaluates natural coloring
- **Texture Analysis Score**: Assesses firmness and consistency
- **Transparency Score**: Checks flesh clarity
- **Eyes Condition**: Evaluates eye clarity (for whole fish)
- **Smell Indicator**: AI-estimated smell quality
- **Overall Quality**: Summary rating (Excellent / Good / Fair / Poor)
- **Certification**: Whether the fish meets quality standards
- **Recommendations**: Actionable storage and handling suggestions

The analysis includes retry logic with exponential backoff for rate limiting, a 30-second timeout, and graceful fallback results if the API is unavailable.

### Recipe Video Recommendations

When a user views a product detail page, the backend uses Gemini to generate three recipe suggestions tailored to that specific fish type. It then searches YouTube via the `yt-search` library to find matching tutorial videos. Results include video title, thumbnail, channel name, and direct YouTube link.

---

## Deployment

The application is deployed on Vercel:

- **Frontend**: https://aqua-delight.vercel.app
- **Backend**: https://aqua-delight-backend.vercel.app

---

## License

ISC
