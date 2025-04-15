// httpServer.js
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const PORT_HTTP = 5000;

// Habilitar CORS
app.use(cors());

app.use(bodyParser.json());

//Variable para guardar el ID del usuario
let userIdActual = null;

//Ruta para registrar el ID del usuario o su token
app.post("/registrar-usuario", (req, res) => {
  const { usuario_id } = req.body;
  console.log("body: ", req.body);

  if (!usuario_id) {
    return res.status(400).json({ error: "Falta el ID del usuario" });
  }

  //Guardar el ID
  userIdActual = usuario_id;
  console.log(`Usuario registrado: ${usuario_id}`);
  res.status(200).json({ status: "ok" });
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
