// Simple test to verify frontend dependencies
const fs = require('fs');
const path = require('path');

console.log('Testing frontend setup...');

// Check if package.json exists
const packageJsonPath = path.join(__dirname, 'skillswap-frontend', 'package.json');
if (fs.existsSync(packageJsonPath)) {
  console.log('✅ package.json found');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  console.log('✅ Dependencies:', Object.keys(packageJson.dependencies || {}).length);
} else {
  console.log('❌ package.json not found');
}

// Check if main files exist
const filesToCheck = [
  'skillswap-frontend/src/App.jsx',
  'skillswap-frontend/src/main.jsx',
  'skillswap-frontend/src/store/index.js',
  'skillswap-frontend/src/pages/Home.jsx',
  'skillswap-frontend/src/pages/Shop.jsx',
  'skillswap-frontend/src/pages/Cart.jsx',
  'skillswap-frontend/src/pages/About.jsx',
  'skillswap-frontend/src/pages/CourseDetails.jsx',
  'skillswap-frontend/src/pages/auth/Login.jsx',
  'skillswap-frontend/src/pages/auth/Register.jsx',
  'skillswap-frontend/src/pages/admin/Dashboard.jsx',
  'skillswap-frontend/src/pages/admin/Users.jsx',
  'skillswap-frontend/src/pages/admin/Courses.jsx',
  'skillswap-frontend/src/pages/admin/Orders.jsx',
  'skillswap-frontend/src/components/ProtectedRoute.jsx',
  'skillswap-frontend/src/components/AdminRoute.jsx',
  'skillswap-frontend/src/store/slices/authSlice.js',
  'skillswap-frontend/src/store/slices/coursesSlice.js',
  'skillswap-frontend/src/store/slices/cartSlice.js',
  'skillswap-frontend/src/store/slices/wishlistSlice.js',
  'skillswap-frontend/src/store/slices/orderSlice.js',
  'skillswap-frontend/src/lib/api.js',
  'skillswap-frontend/index.html',
  'skillswap-frontend/vite.config.js',
  'skillswap-frontend/tailwind.config.js'
];

let allFilesExist = true;
filesToCheck.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

if (allFilesExist) {
  console.log('\n🎉 All frontend files are present!');
  console.log('\nTo start the frontend:');
  console.log('1. cd skillswap-frontend');
  console.log('2. npm install');
  console.log('3. npm run dev');
} else {
  console.log('\n❌ Some files are missing. Please check the errors above.');
}
