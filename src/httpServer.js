// httpServer.js
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import socket from "./socketClient.js";

const app = express();
const PORT_HTTP = 5000;

// Habilitar CORS
app.use(cors());

app.use(bodyParser.json());

//Variable para guardar el ID del usuario
let userIdActual = null;

//Ruta para registrar el ID del usuario o su token
app.post("/identify-user", (req, res) => {
  const { user_id } = req.body;
  console.log("Solicitud recibida en /usuario-actual :", req.body);

  if (!user_id) {
    console.warn("⚠️ No se recibió user_id en el body.");
    return res.status(400).json({
      error: "Se requiere el ID del usuario en el cuerpo de la solicitud.",
    });
  }

  //Guardar el ID del usuario actual
  userIdActual = user_id;
  console.log(`Usuario activo registrado: ${user_id}`);

  //Registrar usuario a la sala privada socket io
  socket.emit("user:register", { user_id });

  res
    .status(200)
    .json({ status: "ok", message: "Usuario registrado correctamente." });
});

//Funcion para exponer el ID actual o otros modulos
export function getUserIdActual() {
  return userIdActual;
}

//Funcion para iniciar el servidor HTTP
export function iniciarHttpServer() {
  app.listen(PORT_HTTP, () => {
    console.log(`Servidor HTTP escuchando en http://localhost:${PORT_HTTP}`);
  });
}
