const prisma = require('../prisma/client');

const addRecord = async (req, res, next) => {
  try {
    const { patientId, diagnosis, prescription } = req.body;
    let fileUrl = null;
    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
    }

    const doctor = await prisma.doctor.findUnique({ where: { userId: req.user.id } });
    if (!doctor) return res.status(403).json({ error: 'Doctor profile not found' });

    const record = await prisma.medicalRecord.create({
      data: {
        patientId: parseInt(patientId),
        doctorId: doctor.id,
        diagnosis,
        prescription,
        fileUrl
      }
    });

    res.status(201).json(record);
  } catch (error) {
    next(error);
  }
};

const getRecords = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    
    // Authorization: only the patient, admin, or doctor can view
    const { role, id } = req.user;
    if (role === 'PATIENT' && parseInt(patientId) !== id) {
       return res.status(403).json({ error: 'Forbidden. You can only view your own records.' });
    }

    const records = await prisma.medicalRecord.findMany({
      where: { patientId: parseInt(patientId) },
      include: { doctor: { include: { user: true } } }
    });
    res.status(200).json(records);
  } catch (error) {
    next(error);
  }
};

module.exports = { addRecord, getRecords };
