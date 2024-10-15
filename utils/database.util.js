import { config } from 'dotenv';config();
import Sequelize from "sequelize";
//import fs from 'fs';
//import path from 'path';

//CERTIFICADO DE SEGURIDAD
//const parentDir = path.join(__dirname,'..');
//const filePath = path.join(parentDir, 'DigiCertGlobalRootCA.crt.pem');

//DATABASE
const DATABASE = process.env.DATABASE;
const USER = process.env.USER;
const PASSWORD = process.env.PASSWORD;
const HOST = process.env.HOST;

/*const sslOptions = {
    ssl : true,
    ca: fs.readFileSync(filePath),
};*/

const sequelize = new Sequelize(
    DATABASE,
    USER,
    PASSWORD,
    {
        host: HOST,
        dialect: "mysql",
        port: 3306
    }
);

async function testConnection(){
    try{    
        await sequelize.authenticate();
        console.log("All set");
    }catch(err){
        console.log(err);
    }
}

testConnection();
export default sequelize