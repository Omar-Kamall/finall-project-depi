# JinStore - E-Commerce Platform

A full-stack e-commerce application built with React (Vite) and Node.js (Express), featuring product management, user authentication, shopping cart, order processing, and vendor dashboard.

## 🚀 Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Icons** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (via Mongoose)
- **JWT** - Authentication
- **Cloudinary** - Image storage
- **Nodemailer** - Email service
- **Bcrypt** - Password hashing
- **Multer** - File upload handling

## 📋 System Requirements

### Software Dependencies

1. **Node.js** (v16.x or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

3. **MongoDB** 
   - Install MongoDB locally or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cloud database)
   - MongoDB Community Server: [mongodb.com/download](https://www.mongodb.com/try/download/community)

4. **Git** (optional, for version control)
   - Download from [git-scm.com](https://git-scm.com/)

### Accounts Needed

1. **Cloudinary Account** (for image uploads)
   - Sign up at [cloudinary.com](https://cloudinary.com/)
   - Required: Cloud name, API Key, API Secret

2. **Email Service** (Gmail or other SMTP service)
   - For sending emails via Nodemailer

## 📦 Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd finall-project-depi
```

### 2. Backend Setup

```bash
# Navigate to Backend directory
cd Backend

# Install dependencies
npm install

# Create .env file (see Configuration section)
```

### 3. Frontend Setup

```bash
# Navigate to Frontend directory (from project root)
cd Frontend

# Install dependencies
npm install
```

## ⚙️ Configuration Instructions

### Backend Environment Variables

Create a `.env` file in the `Backend` directory with the following variables:

```env
# Server Port
PORT=5050

# MongoDB Connection String
# For local MongoDB:
DB_URL=mongodb://localhost:27017/jinstore
# For MongoDB Atlas (cloud):
# DB_URL=mongodb+srv://username:password@cluster.mongodb.net/jinstore?retryWrites=true&w=majority

# JWT Secret (generate a strong random string)
JWT_SECRET=your_super_secret_jwt_key_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

**Important Notes:**
- Replace all placeholder values with your actual credentials
- Never commit the `.env` file to version control (already in `.gitignore`)
- For JWT_SECRET, use a long random string (you can generate one using: `openssl rand -base64 32`)

### Frontend Configuration

The frontend API base URL is configured in `Frontend/src/api/Products.js` and `Frontend/src/api/auth.js`:

```javascript
const Api = "http://localhost:5050/api";
```

If your backend runs on a different port or domain, update these files accordingly.

### Email Configuration

Update the email service in `Backend/service/mailer.service.js`:

```javascript
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "your_email@gmail.com",
    pass: "your_app_password", // Use Gmail App Password, not regular password
  },
});
```

**For Gmail:**
- Enable 2-Factor Authentication
- Generate an App Password: [Google Account Security](https://myaccount.google.com/apppasswords)

## 🏃 Execution Guide

### Running Locally

#### 1. Start MongoDB

**Local MongoDB:**
```bash
# Windows
net start MongoDB

# macOS/Linux
mongod --config /usr/local/etc/mongod.conf
# OR use: brew services start mongodb-community
```

**MongoDB Atlas:**
- No local setup needed, just ensure your connection string in `.env` is correct

#### 2. Start Backend Server

```bash
# Navigate to Backend directory
cd Backend

# Development mode (with nodemon - auto-restart on changes)
npm run dev

# OR standard mode
node app.js
```

Backend will run on: `http://localhost:5050`

#### 3. Start Frontend Development Server

```bash
# Navigate to Frontend directory (in a new terminal)
cd Frontend

# Start development server
npm run dev
```

Frontend will run on: `http://localhost:5173`

### Access the Application

Open your browser and navigate to:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5050/api

### Build for Production

#### Frontend Build

```bash
cd Frontend
npm run build
```

The production build will be in `Frontend/dist` directory.

#### Preview Production Build

```bash
cd Frontend
npm run preview
```

## 📚 API Documentation

### Base URL
```
http://localhost:5050/api
```

### Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### API Endpoints

#### User Authentication

**Register User**
```
POST /api/users/register
Content-Type: application/json

Body:
{
  "name": "string",
  "email": "string",
  "password": "string",
  "city": "string",
  "phone": "string",
  "address": "string",
  "role": "user" | "vendor" | "admin"
}
```

**Login**
```
POST /api/users/login
Content-Type: application/json

Body:
{
  "email": "string",
  "password": "string"
}

Response:
{
  "token": "jwt_token",
  "data": { user_object }
}
```

**Update Profile**
```
PUT /api/users/updateProfile/:email
Authorization: Bearer <token>
Content-Type: application/json

Body: { updated_user_data }
```

**Delete Account**
```
DELETE /api/users/deleteAccount/:email
Authorization: Bearer <token>
```

#### Products

**Get All Products** (Protected)
```
GET /api/products
Authorization: Bearer <token>
```

**Get Single Product**
```
GET /api/product/:id
```

**Get Products by Category** (Protected)
```
GET /api/products/category/:category
Authorization: Bearer <token>
```

**Get Categories**
```
GET /api/products/categories
```

**Create Product** (Protected)
```
POST /api/product
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body (FormData):
- title: string
- price: number
- oldPrice: number
- description: string
- category: string
- count: number
- image: file
```

**Update Product** (Protected)
```
PUT /api/product/:id
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body (FormData): { product_data }
```

**Delete Product** (Protected)
```
DELETE /api/product/:id
Authorization: Bearer <token>
```

#### Cart

**Get Cart Items** (Protected)
```
GET /api/cart/getCartItems
Authorization: Bearer <token>
```

**Add Product to Cart** (Protected)
```
POST /api/cart/addProductToCart
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "productId": "string",
  "quantity": number
}
```

**Update Product Quantity** (Protected)
```
PUT /api/cart/updateProductQuantity/:id
Authorization: Bearer <token>
Content-Type: application/json

Body: { quantity: number }
```

**Remove Product from Cart** (Protected)
```
DELETE /api/cart/removeProductFromCart/:id
Authorization: Bearer <token>
```

**Clear Cart** (Protected)
```
DELETE /api/cart/clearProductsFromCart
Authorization: Bearer <token>
```

#### Orders

**Get Orders** (Protected)
```
GET /api/order
Authorization: Bearer <token>
```

**Create Order** (Protected)
```
POST /api/order
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "fname": "string",
  "lname": "string",
  "email": "string",
  "phone": "string",
  "country": "string",
  "city": "string",
  "address": {
    "street": "string",
    "apartment": "string"
  },
  "products": [
    {
      "productId": "string",
      "quantity": number
    }
  ]
}
```

#### Contact

**Get Contact Messages** (Protected - Admin)
```
GET /api/contact
Authorization: Bearer <token>
```

**Submit Contact Form**
```
POST /api/contact
Content-Type: application/json

Body:
{
  "name": "string",
  "email": "string",
  "message": "string"
}
```

## 🌐 Deployed Web

*Note: Deployment URLs should be added here when the application is deployed.*

### Deployment Options

#### Frontend Deployment
- **Vercel:** Recommended for React/Vite apps
- **Netlify:** Easy deployment with Git integration
- **GitHub Pages:** Free hosting for static sites

#### Backend Deployment
- **Heroku:** Easy Node.js deployment
- **Railway:** Modern deployment platform
- **DigitalOcean:** VPS or App Platform
- **AWS/Azure/GCP:** Enterprise solutions

### Environment Variables for Deployment

When deploying, ensure all environment variables from the Configuration section are set in your deployment platform's environment settings.

### Production Build Commands

**Frontend:**
```bash
cd Frontend
npm run build
# Deploy the 'dist' folder
```

**Backend:**
```bash
cd Backend
# Ensure NODE_ENV=production
# Deploy with process manager (PM2, etc.)
```

## 📁 Project Structure

```
finall-project-depi/
├── Backend/
│   ├── config/
│   │   └── db.js              # Database configuration
│   ├── controller/            # Route controllers
│   ├── middleware/            # Auth, file upload middleware
│   ├── model/                 # Mongoose models
│   ├── routes/                # API routes
│   ├── service/               # External services (email)
│   ├── utils/                 # Utilities (Cloudinary)
│   ├── app.js                 # Express app entry point
│   └── package.json
│
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/               # API service functions
│   │   ├── components/        # React components
│   │   ├── context/           # React Context providers
│   │   ├── Layout/            # Layout components
│   │   ├── pages/             # Page components
│   │   ├── App.jsx            # Main app component
│   │   └── main.jsx           # Entry point
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

## 🔧 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check `DB_URL` in `.env` file
   - Verify network access for MongoDB Atlas

2. **Port Already in Use**
   - Change `PORT` in Backend `.env`
   - Or kill the process using the port

3. **CORS Errors**
   - Update CORS origin in `Backend/app.js` to match your frontend URL

4. **Cloudinary Upload Fails**
   - Verify Cloudinary credentials in `.env`
   - Check file size limits

5. **Authentication Not Working**
   - Ensure JWT_SECRET is set in `.env`
   - Check token expiration settings

## 📝 Additional Notes

- The application uses JWT tokens stored in localStorage for authentication
- Image uploads are handled via Cloudinary
- Password hashing is done with bcrypt
- Email notifications use Nodemailer (currently configured for Gmail)
- The project uses role-based access control (user, vendor, admin)

## 👥 Contributors

We would like to thank all the contributors who have helped make this project possible:

- **[Ahmed Diaa](https://github.com/TheAhmedDiaa/)**
- **[Mohammed Ali](https://github.com/MoohammedAli)**
- **[Omar Kamal](https://github.com/Omar-Kamall)**
- **[Ahmed Samy](https://github.com/ahmedsamy13)**

---

For more information or support, please open an issue in the repository.
