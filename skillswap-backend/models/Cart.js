const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
    unique: true
  },
  courses: [{
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: [true, 'Course is required']
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  totalItems: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate totals before saving
cartSchema.pre('save', async function(next) {
  this.updatedAt = Date.now();
  
  if (this.courses.length > 0) {
    // Populate courses to get prices
    await this.populate('courses.course');
    this.totalItems = this.courses.length;
    this.totalAmount = this.courses.reduce((total, item) => {
      return total + (item.course ? item.course.price : 0);
    }, 0);
  } else {
    this.totalItems = 0;
    this.totalAmount = 0;
  }
  
  next();
});

// Ensure one cart per user
cartSchema.index({ user: 1 }, { unique: true });

module.exports = mongoose.model('Cart', cartSchema);
