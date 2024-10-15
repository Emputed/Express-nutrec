import DataTypes from "sequelize";
import sequelize from '../utils/database.util.js';
import paciente from "./paciente.js";

const plan_de_alimentacion = sequelize.define(
    'plan_de_alimentacion',
    {
        id_plan: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            primaryKey: true,
        },
        id_paciente: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            references:{
                model:"paciente",
                key:"id_paciente",
            },
        },
        nombre_plan: {
            type: DataTypes.STRING(45),
            allowNull:true,
        },
        fecha_plan: {
            type: DataTypes.DATE,
            allowNull:true,
        },
        bytes_plan: {
            type: DataTypes.BLOB('long'),
            allowNull: true,
        },
    },
    {
        timestamps: false,
        tableName:"plan_de_alimentacion"
    }
)
paciente.hasMany(plan_de_alimentacion,{
    foreignKey:"id_paciente",
    sourceKey:"id_paciente",
    targetKey:"id_paciente",
});

export default plan_de_alimentacion