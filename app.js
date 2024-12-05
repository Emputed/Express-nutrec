import { config } from 'dotenv';
config();
import express from "express";
import logger from "morgan";
import cors from "cors";
import { Server } from 'socket.io';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
// RUTAS
import pacienteRouter from "./routes/paciente.js";
import medidaRouter from "./routes/medida.js";
import crudRouter from "./routes/crud.js";
import planRouter from "./routes/plan.js";
import mensajesRouter from "./routes/mensajes.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración básica de la aplicación
app.set("port", process.env.PORT || 4000);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS
app.use(
    cors({
        origin: "https://nice-glacier-0e793e60f.5.azurestaticapps.net",
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
app.use('/api/v1/messages', mensajesRouter);

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});


const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://nice-glacier-0e793e60f.5.azurestaticapps.net", 
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado:", socket.id);

  socket.on("sendMessage", (data) => {
    console.log("Mensaje recibido:", data);
    const room = data.room;
    io.to(room).emit("receiveMessage", data);
  });

  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`Usuario unido a la sala: ${room}`);
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});

export {app, server};