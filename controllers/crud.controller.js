import paciente from "../models/paciente.js";
import medidas from "../models/medidas.js";
import plan_de_alimentacion from "../models/plan_de_alimentacion.js";
import sequelize from "../utils/database.util.js";

const crudController = {};

crudController.getPacientes = async (req, res) => {
  try {
    const pacientes = await paciente.findAll({
      where: { estatus: 0 },
      attributes: [
        "id_paciente",
        "nombre",
        "apellido",
        [
          sequelize.literal("TIMESTAMPDIFF(YEAR, f_nacimiento, CURDATE())"),
          "edad",
        ], //Calcular la edad
      ],
    });
    return res.status(200).json(pacientes);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error al obtener pacientes", error });
  }
};

crudController.getPaciente = async (req, res) => {
  try {
    const id = req.params.id_paciente;
    const usuario = await paciente.findOne({
      where: { id_paciente: id },
      attributes: [
        "id_paciente",
        "nombre",
        "apellido",
        [
          sequelize.literal("TIMESTAMPDIFF(YEAR, f_nacimiento, CURDATE())"),
          "edad",
        ], //Calcular la edad
        "f_nacimiento",
        "usuario",
        "password",
        "genero",
      ],
    });
    if (!usuario) {
      return res.status(404).json({ message: "Paciente no encontrado" });
    }
    return res.status(200).json(usuario); // Devuelve todos los atributos del paciente
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error al obtener datos del paciente", error });
  }
};

crudController.getMedidas = async (req, res) => {
  try {
    const id = req.params.id_paciente;
    const medidasPaciente = await medidas.findAll({
      where: { id_paciente: id },
    });
    if (!medidasPaciente) {
      return res.status(404).json({ message: "Paciente sin medidas" });
    }
    return res.status(200).json(medidasPaciente);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error al obtener medidas del paciente", error });
  }
};

crudController.getPlanes = async (req, res) => {
    try{
        const id = req.params.id_paciente;
        const planesPaciente = await plan_de_alimentacion.findAll({
            where: { id_paciente: id},
        });
        if(!planesPaciente){
            return res.status(404).json({ message: "Paciente sin planes" });
        }
        return res.status(200).json(planesPaciente);
    }catch(error){
        console.log("getMedidas ",error);
        return res
        .status(500)
        .json({ message: "Error al obtener planes del paciente", error });
    }
}

crudController.download = async (req, res) => {
  try {
    const id_plan  = req.params.id_plan;
    const plan = await plan_de_alimentacion.findOne({ where: { id_plan } });

    if (!plan) {
      return res.status(404).json({ message: "Archivo no encontrado" });
    }
    // Convertir de base64 a buffer
    const buffer = Buffer.from(plan.bytes_plan, "base64");
    // Configurar la respuesta
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${plan.nombre_plan}"`,
    });
    // Enviar el buffer como respuesta
    res.send(buffer);
  } catch (error) {
    console.error("Error al descargar el archivo: ", error);
    res.status(500).json({ message: "Error al descargar el archivo" });
  }
};

export default crudController;
