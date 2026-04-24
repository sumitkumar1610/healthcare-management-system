const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);

  // Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@smarthealth.com' },
    update: {},
    create: {
      email: 'admin@smarthealth.com',
      name: 'System Admin',
      password,
      role: 'ADMIN',
    },
  });

  // Doctor
  const doctorUser = await prisma.user.upsert({
    where: { email: 'doctor@smarthealth.com' },
    update: {},
    create: {
      email: 'doctor@smarthealth.com',
      name: 'Dr. Sarah Jenkins',
      password,
      role: 'DOCTOR',
    },
  });

  const doctor = await prisma.doctor.upsert({
    where: { userId: doctorUser.id },
    update: {},
    create: {
      userId: doctorUser.id,
      specialization: 'Cardiologist',
      experience: 10,
      bio: 'Expert in heart-related conditions.'
    }
  });

  // Patient
  const patient = await prisma.user.upsert({
    where: { email: 'patient@smarthealth.com' },
    update: {},
    create: {
      email: 'patient@smarthealth.com',
      name: 'John Doe',
      password,
      role: 'PATIENT',
    },
  });

  console.log('Database seeded with test accounts successfully:');
  console.log({ admin: admin.email, doctor: doctorUser.email, patient: patient.email });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
