import sequelize from "../utils/database.util.js";
import medidas from "../models/medidas.js";

const medidaController = {};

medidaController.register = async (req, res) => {
    try {
        const id_paciente = req.params.id_paciente;
        const { estatura, m_cintura, m_pierna, m_peso, m_brazo, fecha } = req.body;
        
        // Validar que todos los campos estén presentes
        if (!estatura || !m_cintura || !m_pierna || !m_peso || !m_brazo || !fecha || !id_paciente) {
            return res.status(400).json({ message: "Todos los campos son obligatorios" });
        }

        if(!id_paciente){
            return res.status(400).json({message:"El paciente no se encuentra"});
        }

        // Usar una transacción para crear las medidas
        await sequelize.transaction(async (t) => {
            await medidas.create({
                estatura: estatura,
                m_cintura: m_cintura,
                m_pierna: m_pierna,
                m_peso: m_peso,
                m_brazo: m_brazo,
                fecha: fecha,
                id_paciente: id_paciente,
            }, { transaction: t });
        });
        return res.json({ message: "Medida registrada" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
},
//ACTUALIZA UNA MEDIDA
medidaController.update = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const {
            estatura,
            m_cintura,
            m_pierna,
            m_peso,
            m_brazo,
            fecha
        } = req.body;
        const { id_medida } = req.params;

        const medida = await medidas.findByPk(id_medida);
        if (!medida) {
            return res.status(404).json({ message: "Medida no encontrada" });
        }

        // Actualizar la medida con los nuevos valores
        await medidas.update(
            {
                estatura: estatura,
                m_cintura: m_cintura,
                m_pierna: m_pierna,
                m_peso: m_peso,
                m_brazo: m_brazo,
                fecha: fecha
            },
            {
                where: { id: id_medida },
                transaction: t
            }
        );
        await t.commit();
        return res.json({ message: "Medida actualizada correctamente" });
    } catch (error) {
        await t.rollback();
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
};


export default medidaController;