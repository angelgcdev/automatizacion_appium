import adb from "adbkit";

const client = adb.createClient({ host: "127.0.0.1", port: 5037 });
const trackers = new Map(); //clave: user_id, valor: tracker

export function iniciarTrackerDeDispositivos(user_id, socket) {
  client
    .trackDevices()
    .then((tracker) => {
      console.log("Escuchando dispositivos ADB...");

      //Guardamos el tracker
      trackers.set(user_id, tracker);

      // Evento 'add': Se dispara cuando un nuevo dispositivo se conecta
      tracker.on("add", async (device) => {
        console.log(`Dispositivo conectado: ${device.id}`);
        // Retrasa la obtención de información del dispositivo 2 segundos para asegurar estabilidad
        setTimeout(async () => {
          try {
            //Obtener informacion adicional del dispositivo
            const info = await obtenerInfoDispositivo(device.id);

            // Enviar la informacion al servidor
            socket.emit("device:connected", { ...info, user_id });
          } catch (err) {
            console.error("Error al obtener info del dispositivo:", err);
          }
        }, 1000);
      });

      // Evento 'remove': Se dispara cuando un dispositivo se desconecta
      tracker.on("remove", (device) => {
        console.log(`Dispositivo desconectado: ${device.id}`);

        setTimeout(() => {
          socket.emit("device:disconnected", device.id);
        }, 1000);
      });

      // Evento 'end': Se dispara cuando el tracker se detiene (pérdida de conexión con ADB)
      tracker.on("end", () => {
        console.log("Tracker finalizado. se perdio la conexion con ADB");
      });

      // Evento 'error': Se dispara si ocurre un error en el tracker
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

  const os_version = await getProp("ro.build.version.release");
  const brand = await getProp("ro.product.manufacturer");

  const isEmulator = deviceId.startsWith("emulator");
  const device_type = isEmulator ? "EMULADOR" : "FISICO";

  const status = "ACTIVO";
  const connected_at = new Date().toISOString();

  return {
    udid: deviceId,
    device_type,
    status,
    os_version,
    brand,
    connected_at,
  };
}

//Funcion para detener el tracker cuando el usuario cierre sesion
export function detenerTracker(user_id) {
  const tracker = trackers.get(user_id);
  if (tracker) {
    tracker.end(); //cierra el tracker
    trackers.delete(user_id); // Limpia el mapa
    console.log(`Tracker detenido para el usuario ${user_id}`);
  }
}
