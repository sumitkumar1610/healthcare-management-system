const prisma = require('../prisma/client');

const getUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        doctor: true,
        createdAt: true
      }
    });
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const getDoctors = async (req, res, next) => {
  try {
    const doctors = await prisma.doctor.findMany({
      include: { user: { select: { name: true, email: true } } }
    });
    res.status(200).json(doctors);
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, getDoctors };
