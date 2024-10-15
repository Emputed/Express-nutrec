import express from "express"
import medida from "../controllers/medida.controller.js"

const router = express.Router();

//Llamada al controlador que se va a usar en cada peticion
router.post('/register/:id_paciente', medida.register);
router.put('/update/:id_medida', medida.update); //Parametro el id de la medida a editar


export default router;