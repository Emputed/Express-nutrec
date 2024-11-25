import express from "express"
import paciente from '../controllers/paciente.controllers.js';

const router = express.Router();

//Llamada al controlador que se va a usar en cada peticion
router.post('/register', paciente.register);
router.post('/login', paciente.login);
router.get('/verify-token', paciente.verifyToken);
router.put('/update', paciente.update);
router.delete('/delete/:id', paciente.delete);

export default router;