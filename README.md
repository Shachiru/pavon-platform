# Pavon Platform

A full-stack MERN (MongoDB, Express, React, Node.js) e-commerce platform with authentication, product management, shopping cart, and order processing capabilities.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Admin Login](#admin-login)
- [API Endpoints](#api-endpoints)
- [Models](#models)
- [Authentication](#authentication)
- [Middleware](#middleware)
- [License](#license)

## ✨ Features

### Authentication & Authorization
- User registration and login with JWT tokens
- Google OAuth 2.0 integration
- Role-based access control (User/Admin)
- Secure password hashing with bcrypt
- Cookie-based authentication

### Product Management
- Create, read, update, and delete products (CRUD)
- Product image upload with Cloudinary integration
- Product search and filtering
- Category-based organization
- Stock management

### Shopping Cart
- Add/remove items from cart
- Update item quantities
- Persistent cart storage
- Cart management per user

### Order Management
- Place orders from cart
- Order status tracking (Pending, Processing, Shipped, Delivered, Cancelled)
- Order history for users
- Admin order management

### Security & Performance
- Rate limiting to prevent abuse
- Helmet.js for security headers
- Input validation with Zod
- Error handling middleware
- Request logging with Pino
- CORS configuration

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Passport.js, JWT, bcryptjs
- **File Upload**: Multer, Cloudinary
- **Validation**: Zod
- **Logging**: Pino
- **Security**: Helmet, express-rate-limit, CORS

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui, Lucide React
- **HTTP Client**: Axios
- **Utilities**: clsx, tailwind-merge, class-variance-authority

## 📁 Project Structure

```
pavon-platform/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── cloudinary.ts      # Cloudinary configuration
│   │   │   └── passport.ts        # Passport strategies
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── cartController.ts
│   │   │   ├── orderController.ts
│   │   │   └── productController.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts            # Authentication middleware
│   │   │   ├── errorHandler.ts    # Global error handler
│   │   │   ├── rateLimiter.ts     # Rate limiting
│   │   │   └── validate.ts        # Validation middleware
│   │   ├── models/
│   │   │   ├── Cart.ts
│   │   │   ├── Order.ts
│   │   │   ├── Product.ts
│   │   │   └── User.ts
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   ├── cartRoutes.ts
│   │   │   ├── orderRoutes.ts
│   │   │   └── productRoutes.ts
│   │   ├── utils/
│   │   │   ├── AppError.ts        # Custom error class
│   │   │   ├── catchAsync.ts      # Async error wrapper
│   │   │   ├── isAdminEmail.ts    # Admin role checker
│   │   │   └── jwt.ts             # JWT utilities
│   │   ├── validators/
│   │   │   ├── authValidator.ts
│   │   │   └── productValidator.ts
│   │   ├── server.ts              # Application entry point
│   │   └── types.ts               # TypeScript types
│   ├── uploads/                   # Local file uploads
│   ├── logs/                      # Application logs
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx    # Authentication context
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── LandingPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   └── SignupPage.tsx
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
└── package.json                   # Root package (concurrently scripts)
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git**

## 🚀 Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd pavon-platform
```

### 2. Install dependencies

Install root dependencies:
```bash
npm install
```

Install backend dependencies:
```bash
cd backend
npm install
```

Install frontend dependencies:
```bash
cd frontend
npm install
```

## 🔐 Environment Variables

### Backend (.env)

Create a `.env` file in the `backend` directory:

```env
# Server
PORT=5001
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/pavon-platform
# Or use MongoDB Atlas:
# MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/pavon-platform

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5001/api/auth/google/callback

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Admin Emails (comma-separated)
ADMIN_EMAILS=admin@example.com,admin2@example.com
```

### Frontend (.env)

Create a `.env` file in the `frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:5001/api
```

## ▶️ Running the Application

### Run both frontend and backend concurrently (from root):

```bash
npm run dev
```

### Run backend only:

```bash
cd backend
npm run dev
```

### Run frontend only:

```bash
cd frontend
npm run dev
```

### Build for production:

```bash
# From root directory
npm run build

# Start production server
npm start
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5001

## 🔐 Admin Login

### Default Admin Credentials

After setting up the admin user, use these credentials to login:

```
Email:    admin@example.com
Password: Admin123!
```

### Creating the Admin User

Before you can login as admin, you need to create the admin user in the database:

```bash
cd backend
npm run create-admin
```

This will create an admin user with the default credentials above.

### Resetting Admin Password

If you forget the admin password or need to reset it:

```bash
cd backend
npm run reset-admin-password
```

This will reset the password back to `Admin123!`

### How Admin Access Works

1. **Admin Email Whitelist**: Users who sign up with emails listed in the `ADMIN_EMAILS` environment variable automatically receive admin role
2. **Default Admin Emails**: `admin@example.com`, `superadmin@example.com`
3. **Add More Admins**: Edit the `ADMIN_EMAILS` variable in `backend/.env`:
   ```env
   ADMIN_EMAILS=admin@example.com,superadmin@example.com,newemail@example.com
   ```
4. **Login**: Go to http://localhost:5173/login and use the admin credentials

### Admin vs Regular Users

| Feature | Regular User | Admin |
|---------|-------------|-------|
| Browse Products | ✅ | ✅ |
| Add to Cart | ✅ | ✅ |
| Place Orders | ✅ | ✅ |
| View Own Orders | ✅ | ✅ |
| Create Products | ❌ | ✅ |
| Update Products | ❌ | ✅ |
| Delete Products | ❌ | ✅ |
| Manage All Orders | ❌ | ✅ |
| Update Order Status | ❌ | ✅ |

### Troubleshooting Admin Login

**Problem: "Invalid email or password"**
- Run `npm run reset-admin-password` in the backend directory
- Ensure the backend server is running
- Check that MongoDB is connected

**Problem: User exists but not admin**
- Verify the email is listed in `ADMIN_EMAILS` in `backend/.env`
- Restart the backend server after changing `.env`
- Emails are case-insensitive

**Problem: Cannot create admin user**
- Ensure MongoDB is running and connected
- Check `MONGO_URI` in `backend/.env`
- Verify the backend dependencies are installed

## 🔌 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/signup` | Register new user | No |
| POST | `/login` | Login user | No |
| POST | `/logout` | Logout user | Yes |
| GET | `/me` | Get current user | Yes |
| GET | `/google` | Google OAuth login | No |
| GET | `/google/callback` | Google OAuth callback | No |

### Products (`/api/products`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all products | No |
| GET | `/:id` | Get product by ID | No |
| POST | `/` | Create product | Admin |
| PUT | `/:id` | Update product | Admin |
| DELETE | `/:id` | Delete product | Admin |

### Cart (`/api/cart`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get user cart | Yes |
| POST | `/` | Add item to cart | Yes |
| PUT | `/:itemId` | Update cart item | Yes |
| DELETE | `/:itemId` | Remove item from cart | Yes |
| DELETE | `/` | Clear cart | Yes |

### Orders (`/api/orders`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get user orders | Yes |
| GET | `/:id` | Get order by ID | Yes |
| POST | `/` | Create order | Yes |
| PUT | `/:id/status` | Update order status | Admin |

## 📊 Models

### User
```typescript
{
  name: string
  email: string (unique)
  password: string (hashed)
  role: 'user' | 'admin'
  googleId?: string
  avatar?: string
  timestamps: true
}
```

### Product
```typescript
{
  name: string
  description: string
  price: number
  category: string
  stock: number
  images: string[]
  seller: ObjectId (ref: User)
  timestamps: true
}
```

### Cart
```typescript
{
  user: ObjectId (ref: User)
  items: [{
    product: ObjectId (ref: Product)
    quantity: number
  }]
  timestamps: true
}
```

### Order
```typescript
{
  user: ObjectId (ref: User)
  items: [{
    product: ObjectId (ref: Product)
    quantity: number
    price: number
  }]
  totalAmount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  timestamps: true
}
```

## 🔒 Authentication

The application uses a hybrid authentication approach:

### JWT-based Authentication
- Access tokens stored in HTTP-only cookies
- Token expiration: 7 days (configurable)
- Automatic token refresh on requests

### Google OAuth 2.0
- Sign in with Google account
- Automatic user creation on first login
- Profile data synchronization

### Protected Routes
- Frontend: AuthContext manages authentication state
- Backend: `auth` middleware verifies JWT tokens
- Admin routes: Additional role check

## 🛡️ Middleware

### Authentication (`auth.ts`)
- Verifies JWT tokens from cookies
- Attaches user to request object
- Handles token expiration

### Error Handler (`errorHandler.ts`)
- Centralized error handling
- Consistent error response format
- Development vs production error details

### Rate Limiter (`rateLimiter.ts`)
- Prevents brute force attacks
- Configurable limits per endpoint
- IP-based tracking

### Validation (`validate.ts`)
- Request body validation with Zod schemas
- Type-safe validation
- Automatic error responses

## 🧪 Development

### Backend Development
```bash
cd backend
npm run dev  # Runs with ts-node-dev (auto-reload)
```

### Frontend Development
```bash
cd frontend
npm run dev  # Runs with Vite (hot reload)
```

### TypeScript Compilation
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

### Linting
```bash
cd frontend
npm run lint
```

## 📝 Scripts

### Root Package Scripts
- `npm run dev` - Run both frontend and backend concurrently
- `npm run build` - Build both frontend and backend
- `npm start` - Start production server

### Backend Scripts
- `npm run dev` - Development mode with auto-reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production build

### Frontend Scripts
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run preview` - Preview production build
- `npm run lint` - Lint source files

## 🔧 Configuration Files

### Backend
- `tsconfig.json` - TypeScript configuration
- `.env` - Environment variables

### Frontend
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Vite configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `eslint.config.js` - ESLint configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- React team for the amazing framework
- Express.js community
- MongoDB team
- Tailwind CSS
- Shadcn/ui for beautiful components
- All open-source contributors

## 📞 Support

For support, email support@pavon-platform.com or open an issue in the repository.

---

**Built with ❤️ using the MERN stack**

