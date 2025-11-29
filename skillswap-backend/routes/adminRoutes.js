const express = require('express');
const router = express.Router();
const { isLoggedInAdmin, isAdmin } = require('../middleware/auth');
const { validateObjectId } = require('../middleware/objectId');
const { listUsers, toggleBlockUser, deleteUser, getStats } = require('../controllers/adminController');

router.use(isLoggedInAdmin, isAdmin);

// Users
router.get('/users', listUsers);
router.put('/users/:id/block', validateObjectId('id'), toggleBlockUser);
router.delete('/users/:id', validateObjectId('id'), deleteUser);

// Stats
router.get('/stats', getStats);

module.exports = router;
