import { config } from 'dotenv';
config();
import express from "express";
import logger from "morgan";
import cors from "cors";
import { createServer } from 'http'; // Para crear el servidor HTTP
import { Server } from 'socket.io'; // Importar Socket.io

// RUTAS
import pacienteRouter from "./routes/paciente.js";
import medidaRouter from "./routes/medida.js";
import crudRouter from "./routes/crud.js";
import planRouter from "./routes/plan.js";

const app = express();
const server = createServer(app); // Crear servidor HTTP con Express

// Configuración básica de la aplicación
app.set("port", process.env.PORT || 4000);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS
app.use(
    cors({
        origin: "*",
        methods: "GET,PUT,DELETE,POST,HEAD",
        preflightContinue: false,
        optionsSuccessStatus: 204
    })
);

// Rutas
app.use('/api/v1/paciente', pacienteRouter);
app.use('/api/v1/medida', medidaRouter);
app.use('/api/v1/crud', crudRouter);
app.use('/api/v1/plan', planRouter);

// Inicializar Socket.io
const io = new Server(server, {
    cors: {
        origin: "*", // Permitir cualquier origen (puedes restringir esto a tu frontend)
        methods: ["GET", "POST"]
    }
});

// Manejar eventos de conexión de Socket.io
io.on('connection', (socket) => {
    console.log('Nuevo usuario conectado');

    // Ejemplo de manejo de un evento de mensaje
    socket.on('mensaje', (msg) => {
        console.log('Mensaje recibido: ', msg);
        // Emitir el mensaje a todos los usuarios conectados
        io.emit('mensaje', msg);
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});

export {app, server};