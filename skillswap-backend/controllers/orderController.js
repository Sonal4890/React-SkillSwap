const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

const dedupeOrderCourses = (courses = []) => {
  const seen = new Set();
  return courses.filter(item => {
    const courseId = item?.course?._id?.toString() || item?.course?.toString();
    if (!courseId) return false;
    if (seen.has(courseId)) return false;
    seen.add(courseId);
    return true;
  });
};

const sanitizeOrders = (orders = []) => {
  const seenOrders = new Set();
  const result = [];
  for (const order of orders) {
    const plain = order?.toObject ? order.toObject() : order;
    const id = plain?._id?.toString();
    if (!id || seenOrders.has(id)) continue;
    seenOrders.add(id);
    if (Array.isArray(plain.courses)) {
      plain.courses = dedupeOrderCourses(plain.courses);
    }
    result.push(plain);
  }
  return result;
};

// Place order from current user's cart
const placeOrder = async (req, res) => {
  try {
    const { 
      billingAddress, 
      paymentMethod = 'card',
      discount = 0,
      notes 
    } = req.body;

    const cart = await Cart.findOne({ user: req.user.id })
      .populate('courses.course', 'course_name price instructor');
    
    if (!cart || cart.courses.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cart is empty' 
      });
    }

    // Build courses array with course data
    const courses = cart.courses.map(item => ({
      course: item.course._id,
      price: item.course.price
    }));

    const uniqueCourses = dedupeOrderCourses(courses);
    if (uniqueCourses.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid courses found to place an order'
      });
    }

    const totalAmount = uniqueCourses.reduce((sum, item) => sum + item.price, 0);
    const finalAmount = Math.max(0, totalAmount - discount);

    const order = await Order.create({ 
      user: req.user.id, 
      courses: uniqueCourses,
      totalAmount,
      discount,
      finalAmount,
      billingAddress,
      paymentMethod,
      notes,
      status: 'active',
      paymentStatus: 'pending'
    });

    // Clear cart after order
    cart.courses = [];
    await cart.save();

    res.status(201).json({ 
      success: true, 
      message: 'Order placed successfully', 
      order 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error placing order', 
      error: error.message 
    });
  }
};

// Process payment and complete order
const processPayment = async (req, res) => {
  try {
    const { orderId, paymentId, transactionId } = req.body;

    const order = await Order.findOne({
      _id: orderId,
      user: req.user.id,
      status: 'active'
    }).populate('courses.course');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found or already processed'
      });
    }

    // Update order with payment information
    order.paymentStatus = 'paid';
    order.status = 'completed';
    order.paymentId = paymentId;
    order.transactionId = transactionId;
    await order.save();

    // Create enrollments for each course
    for (const courseItem of order.courses) {
      await Enrollment.create({
        user: req.user.id,
        course: courseItem.course._id,
        order: order._id
      });

      // Update course enrolled count
      await Course.findByIdAndUpdate(courseItem.course._id, {
        $inc: { enrolledCount: 1 }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment processed successfully',
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error processing payment',
      error: error.message
    });
  }
};

// Get current user's orders
const getMyOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ user: req.user.id })
      .populate('courses.course', 'course_name course_image instructor')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const cleanedOrders = sanitizeOrders(orders);
    const total = await Order.countDocuments({ user: req.user.id });

    res.status(200).json({ 
      success: true, 
      count: cleanedOrders.length,
      total,
      currentPage: Number(page),
      orders: cleanedOrders
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching orders', 
      error: error.message 
    });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({
      _id: orderId,
      user: req.user.id
    }).populate('courses.course', 'course_name course_image instructor description');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const cleanOrder = order?.toObject ? order.toObject() : order;
    if (cleanOrder && Array.isArray(cleanOrder.courses)) {
      cleanOrder.courses = dedupeOrderCourses(cleanOrder.courses);
    }

    res.status(200).json({
      success: true,
      order: cleanOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching order',
      error: error.message
    });
  }
};

// Admin: get all orders
const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, paymentStatus } = req.query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .populate('courses.course', 'course_name course_image instructor')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const cleanedOrders = sanitizeOrders(orders);
    const total = await Order.countDocuments(filter);

    res.status(200).json({ 
      success: true, 
      count: cleanedOrders.length,
      total,
      currentPage: Number(page),
      orders: cleanedOrders
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching all orders', 
      error: error.message 
    });
  }
};

// Admin: update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    
    if (status && !['active', 'completed'].includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid order status' 
      });
    }

    if (paymentStatus && !['pending', 'paid', 'failed', 'refunded'].includes(paymentStatus)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid payment status' 
      });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('user', 'name email')
      .populate('courses.course', 'course_name course_image instructor');

    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }

    const cleanOrder = order?.toObject ? order.toObject() : order;
    if (cleanOrder && Array.isArray(cleanOrder.courses)) {
      cleanOrder.courses = dedupeOrderCourses(cleanOrder.courses);
    }

    res.status(200).json({ 
      success: true, 
      message: 'Order updated successfully', 
      order: cleanOrder
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error updating order', 
      error: error.message 
    });
  }
};

// Get order statistics
const getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const completedOrders = await Order.countDocuments({ status: 'completed' });
    const activeOrders = await Order.countDocuments({ status: 'active' });
    const totalRevenue = await Order.aggregate([
      { $match: { status: 'completed', paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$finalAmount' } } }
    ]);

    const monthlyRevenue = await Order.aggregate([
      { 
        $match: { 
          status: 'completed', 
          paymentStatus: 'paid',
          createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
        } 
      },
      { $group: { _id: null, total: { $sum: '$finalAmount' } } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        completedOrders,
        activeOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        monthlyRevenue: monthlyRevenue[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching order statistics',
      error: error.message
    });
  }
};

module.exports = { 
  placeOrder, 
  processPayment,
  getMyOrders, 
  getOrderById,
  getAllOrders, 
  updateOrderStatus,
  getOrderStats
};
