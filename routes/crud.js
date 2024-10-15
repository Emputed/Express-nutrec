import express from "express"
import crud from "../controllers/crud.controller.js"

const router = express.Router();

router.get('/pacientes', crud.getPacientes);
router.get('/paciente/:id_paciente', crud.getPaciente);
router.get('/medidas/:id_paciente', crud.getMedidas);
router.get('/planes/:id_paciente', crud.getPlanes);
router.get('/download/:id_plan', crud.download);

export default router;