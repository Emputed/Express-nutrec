import DataTypes from "sequelize";
import sequelize from '../utils/database.util.js';
import paciente from"./paciente.js";

const medidas = sequelize.define(
    'medidas',
    {
        id_medida: {
            type: DataTypes.INTEGER(11),
            allowNull: true,
            primaryKey: true,
        },
        estatura: {
            type: DataTypes.INTEGER(3),
            allowNull: false
        },
        m_cintura: {
            type: DataTypes.INTEGER(3),
            allowNull: false
        },
        m_pierna: {
            type: DataTypes.INTEGER(3),
            allowNull: false
        },
        m_peso: {
            type: DataTypes.INTEGER(3),
            allowNull: false
        },
        m_brazo: {
            type: DataTypes.INTEGER(3),
            allowNull: false
        },
        fecha: {
            type: DataTypes.DATE,
            allowNull: false
        },
        id_paciente: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            references:{
                model: "paciente",
                key:"id_paciente",
            },
        },
    },
    {
        timestamps: false,
        tableName:"medidas"
    }
);

paciente.hasMany(medidas,{
    foreignKey: "id_paciente",
    sourceKey: "id_paciente",
    targetKey:"id_paciente",
});

export default medidas;