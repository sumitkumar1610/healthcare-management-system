const express = require('express');
const router = express.Router();
const multer = require('multer');
const { addRecord, getRecords } = require('../controllers/record.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

router.post('/', authenticate, authorize(['DOCTOR']), upload.single('file'), addRecord);
router.get('/:patientId', authenticate, getRecords);

module.exports = router;
