import express from 'express'
import mensaje from '../controllers/mensajes.controller.js';
const router = express.Router();

router.post("/save", mensaje.saveMessage);
router.get("/:room", mensaje.getMessages);
router.get("/rooms/:role", mensaje.getRooms);

export default router;