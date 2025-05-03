
const express = require('express');
const { 
  authUser, 
  registerUser, 
  getUserProfile, 
  getUsers,
  getEvaluators,
  getVendors
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);
router.get('/', protect, admin, getUsers);
router.get('/evaluators', protect, admin, getEvaluators);
router.get('/vendors', protect, admin, getVendors);

module.exports = router;
