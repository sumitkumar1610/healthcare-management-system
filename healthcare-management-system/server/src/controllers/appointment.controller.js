const prisma = require('../prisma/client');

const bookAppointment = async (req, res, next) => {
  try {
    const { doctorId, date, time } = req.body;
    const appointment = await prisma.appointment.create({
      data: {
        patientId: req.user.id,
        doctorId: parseInt(doctorId),
        date: new Date(date),
        time
      }
    });
    res.status(201).json(appointment);
  } catch (error) {
    next(error);
  }
};

const getAppointments = async (req, res, next) => {
  try {
    const { role, id } = req.user;
    let appointments = [];

    if (role === 'PATIENT') {
      appointments = await prisma.appointment.findMany({
        where: { patientId: id },
        include: { doctor: { include: { user: true } } }
      });
    } else if (role === 'DOCTOR') {
      const doctor = await prisma.doctor.findUnique({ where: { userId: id } });
      if (doctor) {
        appointments = await prisma.appointment.findMany({
          where: { doctorId: doctor.id },
          include: { patient: true }
        });
      }
    } else if (role === 'ADMIN') {
      appointments = await prisma.appointment.findMany({
        include: { patient: true, doctor: { include: { user: true } } }
      });
    }

    res.status(200).json(appointments);
  } catch (error) {
    next(error);
  }
};

const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = await prisma.appointment.update({
      where: { id: parseInt(id) },
      data: { status }
    });
    res.status(200).json(appointment);
  } catch (error) {
    next(error);
  }
};

module.exports = { bookAppointment, getAppointments, updateAppointmentStatus };
