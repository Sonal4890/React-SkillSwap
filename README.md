# SkillSwap - Modern Learning Platform

A full-stack e-learning platform built with React, Node.js, and MongoDB. SkillSwap allows users to browse, purchase, and enroll in courses with a modern, responsive design inspired by platforms like Udemy and Physics Wallah.

## 🚀 Features

### User Features
- **User Authentication**: Register, login, and logout with JWT tokens
- **Course Browsing**: Search, filter, and sort courses by category, price, and popularity
- **Course Details**: Detailed course information with instructor details and curriculum
- **Shopping Cart**: Add courses to cart and manage items
- **Wishlist**: Save courses for later purchase
- **Enrollment**: Enroll in courses after successful payment
- **Responsive Design**: Mobile-first design that works on all devices

### Admin Features
- **Dashboard**: Analytics and overview of platform metrics
- **User Management**: View and manage user accounts
- **Course Management**: Create, edit, and delete courses
- **Order Management**: Track and manage orders and payments
- **Analytics**: Revenue, enrollment, and user statistics

### Technical Features
- **Modern UI**: Built with React 18, Vite, and Tailwind CSS
- **State Management**: Redux Toolkit for predictable state management
- **API**: RESTful API with Express.js and MongoDB
- **Authentication**: JWT-based authentication with role-based access control
- **Payment Integration**: Ready for Stripe integration (mock implementation)
- **Responsive**: Mobile-first design with smooth animations

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Font Awesome** - Icons

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd skillswap-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   ```env
   MONGODB_URI=mongodb://localhost:27017/skillswap
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d
   PORT=5000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:5173
   ```

5. **Start the server**
   ```bash
   npm run dev
   ```

The backend will be running on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd skillswap-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables**
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The frontend will be running on `http://localhost:5173`

## 🗄️ Database Schema

### Users
- `name`: String (required)
- `email`: String (required, unique)
- `password`: String (required, hashed)
- `role`: String (student, instructor, admin)
- `isAdmin`: Boolean
- `profile`: Object (avatar, bio, phone, address)
- `preferences`: Object (notifications, theme)
- `enrolledCourses`: Array of course IDs

### Courses
- `course_name`: String (required)
- `description`: String (required)
- `price`: Number (required)
- `category`: String (required)
- `subcategory`: String
- `course_image`: String (required)
- `instructor`: String (required)
- `instructor_email`: String (required)
- `duration`: String
- `level`: String (beginner, intermediate, advanced)
- `language`: String
- `isActive`: Boolean
- `enrolledCount`: Number
- `rating`: Number
- `reviewCount`: Number

### Orders
- `user`: ObjectId (ref: User)
- `courses`: Array of course objects
- `totalAmount`: Number
- `discount`: Number
- `finalAmount`: Number
- `status`: String (pending, processing, completed, cancelled, refunded)
- `paymentStatus`: String (pending, paid, failed, refunded)
- `paymentMethod`: String
- `transactionId`: String
- `billingAddress`: Object

### Enrollments
- `user`: ObjectId (ref: User)
- `course`: ObjectId (ref: Course)
- `order`: ObjectId (ref: Order)
- `progress`: Number (0-100)
- `completed`: Boolean
- `certificateIssued`: Boolean

### Cart
- `user`: ObjectId (ref: User, unique)
- `courses`: Array of course objects
- `totalItems`: Number
- `totalAmount`: Number

### Wishlist
- `user`: ObjectId (ref: User, unique)
- `courses`: Array of course objects

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/logout` - Logout user

### Courses
- `GET /api/courses` - Get all courses (with filtering, search, pagination)
- `GET /api/courses/latest` - Get latest courses
- `GET /api/courses/trending` - Get trending courses
- `GET /api/courses/search` - Search courses
- `GET /api/courses/category/:category` - Get courses by category
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create course (Admin/Instructor)
- `PUT /api/courses/:id` - Update course (Admin/Instructor)
- `DELETE /api/courses/:id` - Delete course (Admin)

### Cart
- `GET /api/cart` - Get user's cart
- `GET /api/cart/count` - Get cart item count
- `POST /api/cart` - Add course to cart
- `DELETE /api/cart/:courseId` - Remove course from cart
- `DELETE /api/cart` - Clear entire cart

### Orders
- `POST /api/orders` - Place order from cart
- `POST /api/orders/payment` - Process payment
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:orderId` - Get order by ID
- `GET /api/orders/admin/all` - Get all orders (Admin)
- `PUT /api/orders/:id` - Update order status (Admin)
- `GET /api/orders/stats` - Get order statistics (Admin)

### Enrollments
- `POST /api/enrollments` - Enroll in course
- `GET /api/enrollments` - Get user's enrollments
- `GET /api/enrollments/:enrollmentId` - Get enrollment by ID
- `PUT /api/enrollments/:enrollmentId/progress` - Update progress
- `GET /api/enrollments/check/:courseId` - Check enrollment status

### Wishlist
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist` - Add course to wishlist
- `DELETE /api/wishlist/:courseId` - Remove from wishlist
- `DELETE /api/wishlist` - Clear wishlist
- `GET /api/wishlist/check/:courseId` - Check if in wishlist

## 🎨 UI Components

### Pages
- **Home**: Hero section, categories, latest courses, trending courses
- **Shop**: Course listing with search, filters, and pagination
- **Course Details**: Course information, enrollment, and related courses
- **Cart**: Shopping cart management
- **Login/Register**: Authentication forms
- **Admin Dashboard**: Analytics and management interface

### Key Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Smooth Animations**: CSS transitions and hover effects
- **Modern UI**: Clean, professional design inspired by Udemy
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Performance**: Optimized with React 18 features

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or use a MongoDB hosting service
2. Configure environment variables for production
3. Deploy to platforms like Heroku, Railway, or DigitalOcean
4. Set up CORS for your frontend domain

### Frontend Deployment
1. Build the production version: `npm run build`
2. Deploy to platforms like Vercel, Netlify, or AWS S3
3. Configure environment variables for production API URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support, email support@skillswap.com or create an issue in the repository.

## 🔄 Migration from PHP

This project was migrated from a PHP-based system. Key improvements include:

- **Modern Frontend**: React with component-based architecture
- **Better State Management**: Redux for predictable state updates
- **Improved API**: RESTful API with proper error handling
- **Enhanced Security**: JWT authentication with role-based access
- **Better Performance**: Optimized database queries and caching
- **Responsive Design**: Mobile-first approach with modern CSS
- **Developer Experience**: Hot reload, TypeScript support, and better tooling

## 📊 Performance

- **Frontend**: Optimized with Vite for fast builds and hot reload
- **Backend**: Express.js with proper middleware and error handling
- **Database**: MongoDB with optimized queries and indexing
- **Caching**: Implemented where appropriate for better performance
- **Images**: Optimized and responsive image loading

---

**Built with ❤️ using React, Node.js, and MongoDB**