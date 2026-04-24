const express = require('express');
const router = express.Router();
const { getUsers, getDoctors } = require('../controllers/user.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.get('/', authenticate, authorize(['ADMIN']), getUsers);
router.get('/doctors', getDoctors);

module.exports = router;
