// Importamos exec para ejecutar comandos en la terminal y promisify para convertirlo a versión async/await
import { exec } from "child_process";
import { promisify } from "util";

//Convertimos la función exec (basada en callbacks) en una función basada en promesas
const execAsync = promisify(exec);

/**
 * Obtiene un lista de dispositivos Android conectados usando ADB (Android Debug Bridge) de forma asincrona
 */
const getConnectedDevices = async () => {
  try {
    // Ejecutamos el comando 'adb devices' y esperamos el resultado (stdout)
    const { stdout } = await execAsync("adb devices", { timeout: 5000 });

    console.log("stdout: ", stdout);
    /**
     * Procesamos la salida del texto
     * 1. Dividimos por líneas
     * 2. Eliminamos la primera linea (cabecera)
     * 3. Extraemos el ID del dispositivo de cada línea válida
     * 4. Filtramos cualquier línea vaciá
     */

    const devices = stdout
      .split("\n")
      .slice(1) // Ignorar la primera línea ("List of devices attached")
      .map((line) => line.trim())
      .filter((line) => line.includes("\tdevice")) // Solo dispositivos en estado 'device'
      .map((line) => line.split("\t")[0].trim()) //extraemos el ID del dispositivo
      .filter(Boolean); // Filtrar líneas vacías
    return devices;
  } catch (error) {
    if (error.code === "ENOENT") {
      console.error("❌ ADB no está instalado o no se encuentra en el PATH.");
    } else {
      console.error("❌ Error al obtener dispositivos:", error);
    }
    return [];
  }
};

// getConnectedDevices().then(console.log);

export { getConnectedDevices };
