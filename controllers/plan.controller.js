
import plan_de_alimentacion from "../models/plan_de_alimentacion.js";

const planController = {};


planController.upload = async (req, res) => {
    try{
        if (!req.file) {
            return res.status(400).json({ message: 'No se ha subido ningún archivo' });
        }
        const { originalname, buffer } = req.file;
        const id_paciente = req.params.id_paciente;

        //Almacenamiento en la DB
        const pdf = await plan_de_alimentacion.create({
            id_paciente: id_paciente,
            nombre_plan:originalname,
            fecha_plan: new Date(),
            bytes_plan: buffer,
        });
        return res.status(200).json({message:"Archivo guardado con exito ",archivo:pdf});
    }catch(error){
        console.log("Error al subir pdf: ", error);
        res.status(500).json({ message: 'Error al guardar el archivo' });
    }
}
export default planController;