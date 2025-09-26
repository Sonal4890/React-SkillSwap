const { exec } = require('child_process');
const path = require('path');

console.log('🚀 Setting up SkillSwap Database...\n');

// Function to run commands
const runCommand = (command, cwd) => {
  return new Promise((resolve, reject) => {
    exec(command, { cwd }, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error: ${error.message}`);
        reject(error);
        return;
      }
      if (stderr) {
        console.error(`⚠️  Warning: ${stderr}`);
      }
      if (stdout) {
        console.log(stdout);
      }
      resolve();
    });
  });
};

const setupDatabase = async () => {
  try {
    console.log('📦 Installing backend dependencies...');
    await runCommand('npm install', path.join(__dirname, 'skillswap-backend'));
    
    console.log('\n🌱 Seeding database with sample data...');
    await runCommand('npm run seed', path.join(__dirname, 'skillswap-backend'));
    
    console.log('\n✅ Database setup complete!');
    console.log('\n📋 Sample login credentials:');
    console.log('   Admin: admin@skillswap.com / admin123');
    console.log('   Student: john@example.com / password123');
    console.log('   Instructor: jane@example.com / password123');
    console.log('   Student: mike@example.com / password123');
    
    console.log('\n🚀 To start the application:');
    console.log('   1. Backend: cd skillswap-backend && npm run dev');
    console.log('   2. Frontend: cd skillswap-frontend && npm install && npm run dev');
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
};

setupDatabase();
