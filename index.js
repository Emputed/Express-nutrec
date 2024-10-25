import { server } from "./app.js";

server.listen(4000, ()=>{
    console.log("Servidor corriendo en el puerto " + 4000);
});