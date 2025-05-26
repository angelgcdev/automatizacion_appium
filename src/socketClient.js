// socketClient.js

import { io } from "socket.io-client";
import { runOnMultipleDevices } from "./index.js";
import {
  iniciarTrackerDeDispositivos,
  detenerTracker,
} from "./utils/device-tracker.js";
import { cancelAll } from "./cancelManager.js";

let socket = null;
let trackerIniciado = false;

export function iniciarSocketClient(user_id) {
  if (!user_id) {
    console.error("❗ No se puede iniciar socket sin user_id");
    return;
  }

  if (!socket) {
    // Configuración del cliente Socket.IO
    socket = io(process.env.SOCKET_SERVER_URL || "http://localhost:4000"); // ⚠️ Ajustar URL si es necesario

    // Evento de conexión
    socket.on("connect", () => {
      console.log("🔗 Servidor local conectado al backend.");

      //Registrar usuario a la sala privada socket io
      socket.emit("user:register", { user_id });
      console.log(`👤 Usuario ${user_id} registrado en su sala privada`);

      if (!trackerIniciado) {
        //Empezar a trackear dispositivos
        iniciarTrackerDeDispositivos(user_id, socket);
        trackerIniciado = true;
      }
    });

    //Reconexion
    socket.io.on("reconnect", () => {
      console.log("🔁 Reconectado al backend. Re-registrando usuario.");
      socket.emit("user:register", { user_id });

      if (!trackerIniciado) {
        iniciarTrackerDeDispositivos(user_id, socket);
        trackerIniciado = true;
      }
    });

    // Evento de desconexión
    socket.on("disconnect", () => {
      console.log("❌ Desconectado del servidor Socket.IO");
    });

    // Escuchar evento del backend para iniciar la automatización
    socket.on("schedule:tiktok:execute", async (data) => {
      console.log(
        "📥 Orden recibida: Iniciar automatización en múltiples dispositivos.",
        data
      );

      socket.emit("schedule:tiktok:status:started", "EN_PROGRESO");

      await runOnMultipleDevices(data);
    });

    // Escuchar evento para cancelar las ejecuciones
    socket.on("cancel:tiktok:interaction", () => {
      console.log("✖ Orden recibida: Ejecución cancelada por el usuario.");
      cancelAll();
    });

    // Escuchar el evento para cerrar la conexión
    socket.on("cerrarSesion", () => {
      socket.disconnect();
      socket = null;
      detenerTracker(user_id);
      trackerIniciado = false; // 🔧 Reiniciar el estado del tracker
      console.log("🔌 Socket.IO client desconectado correctamente.");
    });
  }
}

// Exportar para que otras partes puedan usar el socket
export function getSocket() {
  return socket;
}
