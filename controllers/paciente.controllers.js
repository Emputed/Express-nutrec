import dotenv from 'dotenv';
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;
import paciente from "../models/paciente.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import sequelize from "../utils/database.util.js";

const pacienteController = {};

//Funcion para hashear la contra
const hashPassword = (password) => bcrypt.hashSync(password, 6);
const isPasswordValid = (password, hashedPassword) => bcrypt.compareSync(password, hashedPassword);

pacienteController.register = async (req, res) =>{
    const t = await sequelize.transaction();
    try{
        const{
            nombre,
            apellido,
            f_nacimiento,
            usuario,
            password,
            estatus,
            genero,
        } = req.body;
        console.log(req.body);
        const user = await paciente.findOne({where: {usuario} });
        if(user){
            return res.status(400).json({message: "El usuario ya esta registrado"});
        }
        //FECHA
        const today = new Date();
        const birthDay = new Date(f_nacimiento);
        const age = today.getFullYear()-birthDay.getFullYear();

        //EDADES
        const min = 0;
        const max = 118;
        if(age < min || age > max){
            return res.status(400).json({message:"Edad no valida"});
        }

        await paciente.create(
            {
                nombre: nombre,
                apellido: apellido,
                f_nacimiento: f_nacimiento,
                usuario: usuario,
                password: hashPassword(password),
                estatus: estatus,
                genero: genero,
            },
            {transaction: t},
        );
        await t.commit();
        return res.json({message:"Paciente registardo"});
    }catch(error){
        await t.rollback();
        console.log(error);
        return res.json({message:error.message})
    }
}

pacienteController.login = async (req, res) =>{
    //solicitud de datos para loggear
    const {usuario, password } = req.body;
    try{
        const user = await paciente.findOne({where: {usuario} });
        if(!user){
            return res.status(400).json({message: "Usuario no encontrado"});
        }
        //Validar contra
        const isValid = isPasswordValid(password, user.password); // Asumiendo que la contraseña está almacenada como hash
        
        if(!isValid){
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }
        //Aqui va el token
        const token = jwt.sign(
            { id: user.id, usuario: user.usuario },
            SECRET_KEY,
            { expiresIn: '1h' }  // El token expira en 1 hora
        );

        return res.status(200).json({
            message: "Login exitoso",
            token: token, // Si usas JWT
            paciente: { id: user.id_paciente, username: user.usuario, status: user.estatus}  // Devuelve los datos que consideres necesarios
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({ message: "Error en el servidor", error });
    }
},

pacienteController.verifyToken = async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "Token no proporcionado" });
    }

    try {
        // Verifica el token
        const decoded = jwt.verify(token, SECRET_KEY);
        return res.status(200).json({
            message: "Token válido",
            data: decoded, 
        });
    } catch (error) {
        console.error("Error verificando el token:", error);
        return res.status(401).json({ message: "Token inválido o expirado" });
    }
},

pacienteController.update = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const {
            id_paciente,
            nombre,
            apellido,
            f_nacimiento,
            usuario,
            password,
            estatus
        } = req.body;


        const patient = await paciente.findByPk(id_paciente);
        if (!patient) {
            return res.status(404).json({ message: "Paciente no encontrado" });
        }


        const updatedPatient = {
            nombre: nombre || patient.nombre,
            apellido: apellido || patient.apellido,
            f_nacimiento: f_nacimiento || patient.f_nacimiento,
            usuario: usuario || patient.usuario,
            estatus: estatus || patient.estatus
        };


        if (password) {
            updatedPatient.password = hashPassword(password);
        }

        await paciente.update(updatedPatient, { where: { id_paciente } }, { transaction: t });

        await t.commit();
        return res.json({ message: "Paciente actualizado correctamente" });
    } catch (error) {
        await t.rollback();
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
},
pacienteController.delete = async (req, res) => {
    try{
        const {id} = req.params;
        const pacienteDelete = await paciente.findByPk(id);
        if(!pacienteDelete){
            return res.status(404).json({message: "Paciente no encontrado"});
        }
        await pacienteDelete.destroy();
        return res.status(200).json({message:"Paciente eliminado"});
    }catch(error){
        console.error("Error eliminando el paciente:", error);
        return res.status(500).json({ message: "Error eliminando el paciente" });
    }
};

export default pacienteController;