import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getPandals,
  getPandalById,
  createPandal,
  updatePandalMedia,
  deletePandal,
  getViewModes
} from '../controllers/sceneController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `pandal-media-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

const pandalUploadFields = upload.fields([
  { name: 'cardImage', maxCount: 1 },
  { name: 'exterior360', maxCount: 1 },
  { name: 'interior360', maxCount: 1 },
  { name: 'panorama', maxCount: 1 }
]);

const handleUploadOrJson = (req, res, next) => {
  const contentType = req.headers['content-type'] || '';
  if (contentType.includes('multipart/form-data')) {
    return pandalUploadFields(req, res, next);
  }
  next();
};

router.get('/pandals', getPandals);
router.get('/pandals/:id', getPandalById);
router.post('/pandals', handleUploadOrJson, createPandal);
router.put('/pandals/:id', handleUploadOrJson, updatePandalMedia);
router.delete('/pandals/:id', deletePandal);


// Legacy routes fallback
router.get('/scenes', getPandals);
router.get('/scenes/:id', getPandalById);
router.post('/scenes/upload', pandalUploadFields, createPandal);
router.get('/view-modes', getViewModes);

export default router;
