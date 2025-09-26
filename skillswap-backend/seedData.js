const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Course = require('./models/Course');
const Order = require('./models/Order');
const Cart = require('./models/Cart');
const Wishlist = require('./models/Wishlist');
const Enrollment = require('./models/Enrollment');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skillswap');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Sample data
const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@skillswap.com',
    password: 'admin123',
    role: 'admin',
    profile: {
      bio: 'Platform Administrator',
      phone: '+91 9876543210'
    }
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'student',
    profile: {
      bio: 'Web Developer and Student',
      phone: '+91 9876543211'
    }
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'instructor',
    profile: {
      bio: 'Senior React Developer and Instructor',
      phone: '+91 9876543212'
    }
  },
  {
    name: 'Mike Johnson',
    email: 'mike@example.com',
    password: 'password123',
    role: 'student',
    profile: {
      bio: 'Python Developer',
      phone: '+91 9876543213'
    }
  },
  {
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    password: 'password123',
    role: 'instructor',
    profile: {
      bio: 'Full Stack Developer and Tech Lead',
      phone: '+91 9876543214'
    }
  }
];

const sampleCourses = [
  {
    course_name: 'Complete React Development Course',
    description: 'Master React from basics to advanced concepts including hooks, context, and state management. Build real-world projects and learn best practices.',
    price: 2999,
    category: 'development',
    subcategory: 'frontend',
    course_image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop',
    instructor: 'Jane Smith',
    instructor_email: 'jane@example.com',
    duration: '40 hours',
    level: 'intermediate',
    language: 'English',
    isActive: true,
    enrolledCount: 150,
    rating: 4.8,
    reviewCount: 89
  },
  {
    course_name: 'Node.js Masterclass',
    description: 'Learn Node.js from scratch and build scalable web applications. Covers Express.js, MongoDB, authentication, and deployment.',
    price: 3999,
    category: 'development',
    subcategory: 'backend',
    course_image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=1000&auto=format&fit=crop',
    instructor: 'Sarah Wilson',
    instructor_email: 'sarah@example.com',
    duration: '50 hours',
    level: 'intermediate',
    language: 'English',
    isActive: true,
    enrolledCount: 89,
    rating: 4.7,
    reviewCount: 45
  },
  {
    course_name: 'Python for Beginners',
    description: 'Start your programming journey with Python. Learn syntax, data structures, functions, and object-oriented programming.',
    price: 1999,
    category: 'development',
    subcategory: 'python',
    course_image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?q=80&w=1000&auto=format&fit=crop',
    instructor: 'Mike Johnson',
    instructor_email: 'mike@example.com',
    duration: '30 hours',
    level: 'beginner',
    language: 'English',
    isActive: true,
    enrolledCount: 234,
    rating: 4.9,
    reviewCount: 156
  },
  {
    course_name: 'JavaScript Fundamentals',
    description: 'Master JavaScript from the ground up. Learn ES6+, DOM manipulation, async programming, and modern JavaScript features.',
    price: 2499,
    category: 'development',
    subcategory: 'javascript',
    course_image: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?q=80&w=1000&auto=format&fit=crop',
    instructor: 'Jane Smith',
    instructor_email: 'jane@example.com',
    duration: '35 hours',
    level: 'beginner',
    language: 'English',
    isActive: true,
    enrolledCount: 178,
    rating: 4.6,
    reviewCount: 92
  },
  {
    course_name: 'MongoDB Database Design',
    description: 'Learn MongoDB from basics to advanced. Database design, queries, indexing, aggregation, and performance optimization.',
    price: 1799,
    category: 'it',
    subcategory: 'mongodb',
    course_image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
    instructor: 'Sarah Wilson',
    instructor_email: 'sarah@example.com',
    duration: '25 hours',
    level: 'intermediate',
    language: 'English',
    isActive: true,
    enrolledCount: 67,
    rating: 4.5,
    reviewCount: 34
  },
  {
    course_name: 'UI/UX Design Principles',
    description: 'Learn modern UI/UX design principles, user research, wireframing, prototyping, and design tools like Figma.',
    price: 3299,
    category: 'design',
    subcategory: 'ui-ux',
    course_image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1000&auto=format&fit=crop',
    instructor: 'Alex Designer',
    instructor_email: 'alex@example.com',
    duration: '45 hours',
    level: 'beginner',
    language: 'English',
    isActive: true,
    enrolledCount: 123,
    rating: 4.7,
    reviewCount: 78
  },
  {
    course_name: 'Data Science with Python',
    description: 'Complete data science course covering pandas, numpy, matplotlib, seaborn, and machine learning basics.',
    price: 4999,
    category: 'data-science',
    subcategory: 'python',
    course_image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1000&auto=format&fit=crop',
    instructor: 'Dr. Data Scientist',
    instructor_email: 'data@example.com',
    duration: '60 hours',
    level: 'intermediate',
    language: 'English',
    isActive: true,
    enrolledCount: 95,
    rating: 4.8,
    reviewCount: 56
  },
  {
    course_name: 'AWS Cloud Computing',
    description: 'Master AWS services including EC2, S3, RDS, Lambda, and more. Learn cloud architecture and deployment strategies.',
    price: 4499,
    category: 'it',
    subcategory: 'aws',
    course_image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop',
    instructor: 'Cloud Expert',
    instructor_email: 'cloud@example.com',
    duration: '55 hours',
    level: 'intermediate',
    language: 'English',
    isActive: true,
    enrolledCount: 78,
    rating: 4.6,
    reviewCount: 42
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    await Order.deleteMany({});
    await Cart.deleteMany({});
    await Wishlist.deleteMany({});
    await Enrollment.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const users = [];
    for (const userData of sampleUsers) {
      // Let the User pre-save hook hash the password (avoid double-hashing)
      const user = new User({
        ...userData
      });
      await user.save();
      users.push(user);
      console.log(`Created user: ${user.name}`);
    }

    // Create courses
    const courses = [];
    for (const courseData of sampleCourses) {
      const course = new Course(courseData);
      await course.save();
      courses.push(course);
      console.log(`Created course: ${course.course_name}`);
    }

    // Create some orders
    const orders = [];
    const order1 = new Order({
      user: users[1]._id, // John Doe
      courses: [
        { course: courses[0]._id, price: courses[0].price },
        { course: courses[2]._id, price: courses[2].price }
      ],
      totalAmount: courses[0].price + courses[2].price,
      finalAmount: courses[0].price + courses[2].price,
      status: 'completed',
      paymentStatus: 'paid',
      paymentMethod: 'card',
      billingAddress: {
        street: '123 Main St',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001',
        country: 'India'
      }
    });
    await order1.save();
    orders.push(order1);

    const order2 = new Order({
      user: users[3]._id, // Mike Johnson
      courses: [
        { course: courses[1]._id, price: courses[1].price }
      ],
      totalAmount: courses[1].price,
      finalAmount: courses[1].price,
      status: 'pending',
      paymentStatus: 'pending',
      paymentMethod: 'upi',
      billingAddress: {
        street: '456 Oak Ave',
        city: 'Delhi',
        state: 'Delhi',
        zipCode: '110001',
        country: 'India'
      }
    });
    await order2.save();
    orders.push(order2);

    console.log(`Created ${orders.length} orders`);

    // Create enrollments
    const enrollment1 = new Enrollment({
      user: users[1]._id,
      course: courses[0]._id,
      order: order1._id,
      progress: 75,
      completionStatus: 'in-progress'
    });
    await enrollment1.save();

    const enrollment2 = new Enrollment({
      user: users[1]._id,
      course: courses[2]._id,
      order: order1._id,
      progress: 100,
      completionStatus: 'completed',
      completedAt: new Date()
    });
    await enrollment2.save();

    console.log('Created enrollments');

    // Create cart for John Doe
    const cart = new Cart({
      user: users[1]._id,
      courses: [
        { course: courses[3]._id, addedAt: new Date() }
      ]
    });
    await cart.save();
    console.log('Created cart');

    // Create wishlist for Mike Johnson
    const wishlist = new Wishlist({
      user: users[3]._id,
      courses: [
        { course: courses[4]._id, addedAt: new Date() },
        { course: courses[5]._id, addedAt: new Date() }
      ]
    });
    await wishlist.save();
    console.log('Created wishlist');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\nSample login credentials:');
    console.log('Admin: admin@skillswap.com / admin123');
    console.log('Student: john@example.com / password123');
    console.log('Instructor: jane@example.com / password123');
    console.log('Student: mike@example.com / password123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seed function
const runSeed = async () => {
  await connectDB();
  await seedDatabase();
};

runSeed();
