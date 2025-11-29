


# Database Setup Guide

## Quick Setup

### Option 1: Automated Setup (Recommended)
```bash
node setup-database.js
```

### Option 2: Manual Setup

1. **Install Backend Dependencies**
   ```bash
   cd skillswap-backend
   npm install
   ```

2. **Set up Environment Variables**
   Create `.env` file in `skillswap-backend` directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/skillswap
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
   JWT_EXPIRE=7d
   PORT=5000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:5173
   ```

3. **Start MongoDB**
   Make sure MongoDB is running on your system.

4. **Seed the Database**
   ```bash
   cd skillswap-backend
   npm run seed
   ```

## Sample Data Included

### Users (5 users)
- **Admin**: admin@skillswap.com / admin123
- **Student**: john@example.com / password123
- **Instructor**: jane@example.com / password123
- **Student**: mike@example.com / password123
- **Instructor**: sarah@example.com / password123

### Courses (8 courses)
- Complete React Development Course (₹2,999)
- Node.js Masterclass (₹3,999)
- Python for Beginners (₹1,999)
- JavaScript Fundamentals (₹2,499)
- MongoDB Database Design (₹1,799)
- UI/UX Design Principles (₹3,299)
- Data Science with Python (₹4,999)
- AWS Cloud Computing (₹4,499)

### Sample Data
- **Orders**: 2 sample orders with different statuses
- **Enrollments**: Sample course enrollments with progress
- **Cart**: Sample cart with courses
- **Wishlist**: Sample wishlist items

## Database Structure

### Collections Created
- `users` - User accounts and profiles
- `courses` - Course information and metadata
- `orders` - Order and payment information
- `enrollments` - Course enrollments and progress
- `carts` - Shopping cart data
- `wishlists` - User wishlists

### Sample Relationships
- John Doe has enrolled in React and Python courses
- Mike Johnson has a pending order for Node.js course
- John Doe has JavaScript course in his cart
- Mike Johnson has MongoDB and UI/UX courses in his wishlist

## Testing the Setup

1. **Start Backend**
   ```bash
   cd skillswap-backend
   npm run dev
   ```

2. **Test API Endpoints**
   - GET http://localhost:5000/api/courses - List all courses
   - GET http://localhost:5000/api/courses/latest - Latest courses
   - GET http://localhost:5000/api/courses/trending - Trending courses

3. **Start Frontend**
   ```bash
   cd skillswap-frontend
   npm install
   npm run dev
   ```

4. **Access Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env` file
- Verify MongoDB is accessible on default port 27017

### Port Conflicts
- Backend runs on port 5000 by default
- Frontend runs on port 5173 by default
- Change ports in respective `.env` files if needed

### Permission Issues
- Ensure you have write permissions in the project directory
- Run commands with appropriate user permissions

## Resetting Database

To clear and reseed the database:
```bash
cd skillswap-backend
npm run seed
```

This will:
- Clear all existing data
- Create fresh sample data
- Maintain the same sample credentials
