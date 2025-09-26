# SkillSwap Setup Guide

## Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd skillSwap
```

### 2. Backend Setup
```bash
cd skillswap-backend
npm install
```

Create `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/skillswap
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

Start backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd skillswap-frontend
npm install
```

Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:5000
```

Start frontend:
```bash
npm run dev
```

### 4. Database Setup
Make sure MongoDB is running on your system. The application will create the necessary collections automatically.

### 5. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Default Admin Account

After starting the backend, you can create an admin account by making a POST request to `/api/auth/register` with:
```json
{
  "name": "Admin User",
  "email": "admin@skillswap.com",
  "password": "admin123",
  "role": "admin"
}
```

## Sample Data

You can add sample courses through the admin dashboard or by making API calls to `/api/courses`.

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the MONGODB_URI in your .env file

2. **CORS Error**
   - Make sure CORS_ORIGIN in backend .env matches your frontend URL

3. **Port Already in Use**
   - Change the PORT in backend .env file
   - Update VITE_API_BASE_URL in frontend .env accordingly

4. **Module Not Found**
   - Run `npm install` in both frontend and backend directories
   - Clear node_modules and package-lock.json, then reinstall

### Development Tips

- Use the browser developer tools to debug API calls
- Check the backend console for server logs
- Use MongoDB Compass to view database data
- Test API endpoints with Postman or similar tools

## Production Deployment

### Backend
1. Set up MongoDB Atlas or production MongoDB
2. Configure production environment variables
3. Deploy to Heroku, Railway, or similar platform
4. Set up proper CORS for your domain

### Frontend
1. Build production version: `npm run build`
2. Deploy to Vercel, Netlify, or similar platform
3. Update API URL for production

## Support

If you encounter any issues, please check:
1. All dependencies are installed
2. Environment variables are set correctly
3. MongoDB is running and accessible
4. Ports are not being used by other applications

For additional help, create an issue in the repository.
