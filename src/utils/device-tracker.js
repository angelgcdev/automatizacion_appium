import adb from "adbkit";
import socket from "../socketClient.js";
import { getUserIdActual } from "../httpServer.js";

let usuario_id;

const client = adb.createClient({ host: "127.0.0.1", port: 5037 });

export function iniciarTrackerDeDispositivos() {
  client
    .trackDevices()
    .then((tracker) => {
      console.log("Escuchando dispositivos ADB...");

      tracker.on("add", async (device) => {
        console.log(`Dispositivo conectado: ${device.id}`);

        setTimeout(async () => {
          try {
            //Obtener informacion adicional del dispositivo
            const info = await obtenerInfoDispositivo(device.id);

            // Enviar la informacion al servidor
            socket.emit("device_connected", info);
          } catch (err) {
            console.error("Error al obtener info del dispositivo:", err);
          }
        }, 2000);
      });

      tracker.on("remove", (device) => {
        console.log(`Dispositivo desconectado: ${device.id}`);
        //Tambien puedes emitir otro evento aqui...
      });

      tracker.on("end", () => {
        console.log("Tracker finalizado. se perdio la conexion con ADB");
      });

      tracker.on("error", (err) => {
        console.log(`Error en el tracker`, err);
      });
    })
    .catch((err) => {
      console.error("No se pudo iniciar el tracker:", err);
    });
}

// Función para obtener información del dispositivo
async function obtenerInfoDispositivo(deviceId) {
  const getProp = async (prop) => {
    const result = await client.shell(deviceId, `getprop ${prop}`);
    return (await adb.util.readAll(result)).toString().trim();
  };

  usuario_id = getUserIdActual();

  const version_so = await getProp("ro.build.version.release");
  const marca = await getProp("ro.product.manufacturer");

  const isEmulator = deviceId.startsWith("emulator");
  const device_type = isEmulator ? "EMULADOR" : "FÍSICO";

  const status = "ACTIVO";
  const connected_at = new Date().toISOString();

  return {
    usuario_id,
    udid: deviceId,
    device_type,
    status,
    version_so,
    marca,
    connected_at,
  };
}
