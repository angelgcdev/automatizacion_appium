import { io } from "socket.io-client";

// Configuración del cliente Socket.IO
const socket = io("http://localhost:4000"); // Cambia la URL si tu backend está en otro host o puerto

// Evento de conexión
socket.on("connect", () => {
  console.log("🔗 Servidor local conectado al backend.");
});

// Evento de desconexión
socket.on("disconnect", () => {
  console.log("❌ Desconectado del servidor Socket.IO");
});

// Exportar el socket para usarlo en otras partes del proyecto
export default socket;
