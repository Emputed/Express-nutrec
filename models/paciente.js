import DataTypes from "sequelize";
import sequelize from '../utils/database.util.js';

const paciente = sequelize.define(
    'paciente',
    {
        //ATRIBUTOS
        id_paciente:{
            type: DataTypes.INTEGER(11),
            allowNull: true,
            primaryKey: true
        },
        nombre: {
            type: DataTypes.STRING(30),
            allowNull: true,
        },
        apellido: {
            type: DataTypes.STRING(40),
            allowNull: true,
        },
        f_nacimiento: {
            type: DataTypes.DATE,
            allowNull:true
        },
        usuario: {
            type: DataTypes.STRING(20),
            allowNull: true,
        },
        password: {
            type: DataTypes.STRING(60),
            allowNull: true
        },
        estatus: {
            type: DataTypes.TINYINT(1),
            allowNull: true,
        },
        genero: {
            type: DataTypes.TINYINT(1),
            allowNull: true,
        },

    },
    {
        timestamps: false,
        tableName:"pacientes"
    }
);

export default paciente;