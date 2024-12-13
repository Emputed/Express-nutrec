import { BlobServiceClient } from "@azure/storage-blob";

const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
const containerName = "chat-nutrec";
const mensajeController = {};

const streamToString = async (readableStream) => {
    return new Promise((resolve, reject) => {
      const chunks = [];
      readableStream.on("data", (data) => chunks.push(data.toString()));
      readableStream.on("end", () => resolve(chunks.join("")));
      readableStream.on("error", reject);
    });
  };

  mensajeController.saveMessage = async (req, res) => {
    try {
      const { sender, receiver, message, role } = req.body; // role indica si es "nutriologa" o "paciente"
  
      // Validar datos requeridos
      if (!sender || !receiver || !message || !role) {
        return res.status(400).json({ error: "Faltan datos obligatorios." });
      }
  
      // Regla: Pacientes solo pueden hablar con la nutrióloga
      if (role === "paciente" && receiver !== "nutriologa") {
        return res.status(403).json({ error: "Los pacientes solo pueden enviar mensajes a la nutrióloga." });
      }
      if (role === "nutriologa" && !receiver) {
        return res.status(403).json({ error: "La nutrióloga necesita un receptor válido." });
      }
  
      // Crear cliente de contenedor
      const containerClient = blobServiceClient.getContainerClient(containerName);
      await containerClient.createIfNotExists();
  
      // Determinar el nombre del archivo basado en el paciente
      const fileName = `nutriologa-${role === "paciente" ? sender : receiver}.json`; // Ejemplo: nutriologa-123.json
      const blockBlobClient = containerClient.getBlockBlobClient(fileName);
  
      // Leer mensajes existentes si el archivo ya existe
      let messages = [];
      if (await blockBlobClient.exists()) {
        const downloadBlockBlobResponse = await blockBlobClient.download();
        const downloaded = await streamToString(downloadBlockBlobResponse.readableStreamBody);
        messages = JSON.parse(downloaded);
      }
  
      // Agregar el nuevo mensaje
      messages.push({
        sender,
        role,
        message,
        timestamp: new Date().toISOString(),
      });
  
      // Subir el archivo actualizado
      await blockBlobClient.upload(JSON.stringify(messages), Buffer.byteLength(JSON.stringify(messages)));
      res.status(200).json({ success: true, message: "Mensaje guardado exitosamente." });
    } catch (error) {
      console.error("Error al guardar el mensaje en Blob Storage:", error);
      res.status(500).json({ error: "Error interno del servidor." });
    }
  };
  
  mensajeController.getMessages = async (req, res) => {
    try {
      const { room } = req.params; // room = "nutriologa-pacienteId"
      if (!room.startsWith("nutriologa-")) {
        return res.status(400).json({ error: "Sala inválida." });
      }
  
      const containerClient = blobServiceClient.getContainerClient(containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(`${room}.json`);
  
      // Verificar si el archivo existe
      if (!(await blockBlobClient.exists())) {
        return res.json({ messages: [] }); // Si no existe, devolver una lista vacía
      }
  
      // Descargar y leer el archivo
      const downloadBlockBlobResponse = await blockBlobClient.download(0);
      const downloaded = await streamToString(downloadBlockBlobResponse.readableStreamBody);
  
      res.json({ messages: JSON.parse(downloaded) });
    } catch (error) {
      console.error("Error al obtener mensajes:", error);
      res.status(500).json({ error: "No se pudo obtener el historial de mensajes." });
    }
  };
  mensajeController.getRooms = async (req, res) => {
    try {
      const { role } = req.query; 
      console.log("Query recibida:", req.query);
      console.log("Body recibido:", req.body);
      // Validar que sea la nutrióloga
      if (role !== "nutriologa") {
        return res.status(403).json({ error: "Acceso denegado. Solo la nutrióloga puede acceder a todas las salas." });
      }
      const containerClient = blobServiceClient.getContainerClient(containerName);
      const rooms = [];
      for await (const blob of containerClient.listBlobsFlat()) {
        if (blob.name.endsWith(".json")) {
          rooms.push(blob.name.replace(".json", "")); // Extraer el nombre de la sala
        }
      }
      res.json({ rooms });
    } catch (error) {
      console.error("Error al obtener salas activas:", error.response.data);
      res.status(500).json({ error: "No se pudo obtener las salas activas." });
    }
  };
  

export default mensajeController;
