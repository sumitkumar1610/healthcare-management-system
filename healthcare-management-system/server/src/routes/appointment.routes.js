const express = require('express');
const router = express.Router();
const { bookAppointment, getAppointments, updateAppointmentStatus } = require('../controllers/appointment.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.post('/', authenticate, authorize(['PATIENT']), bookAppointment);
router.get('/', authenticate, getAppointments);
router.put('/:id', authenticate, authorize(['DOCTOR', 'ADMIN']), updateAppointmentStatus);

module.exports = router;
