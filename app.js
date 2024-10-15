import { config } from 'dotenv';
config();
import express from "express";
import logger from "morgan";
import  cors from "cors";

//RUTAS
import pacienteRouter from "./routes/paciente.js"
import medidaRouter from "./routes/medida.js"
import crudRouter from "./routes/crud.js"
import planRouter from "./routes/plan.js"
//
const app = express()

//config
app.set("port", process.env.PORT || 4000);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(
    cors({
        origin:"*",
        methods:"GET,PUT,DELETE,POST,HEAD",
        preflightContinue:false,
        optionsSuccessStatus:204
    })
);

app.use('/api/v1/paciente', pacienteRouter);
app.use('/api/v1/medida', medidaRouter);
app.use('/api/v1/crud', crudRouter);
app.use('/api/v1/plan', planRouter);

export default app;