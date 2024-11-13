import express from "express";
import plan from "../controllers/plan.controller.js";
import multer from "multer";

const router = express.Router();

// Configuración de multer para manejar el archivo
const upload = multer({
    storage: multer.memoryStorage()
  });

router.post('/upload/:id_paciente', upload.single('file'), plan.upload);
router.delete('/delete/:id', plan.delete);

export default router;