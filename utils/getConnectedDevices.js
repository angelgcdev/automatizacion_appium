import { execSync } from "child_process";

const getConnectedDevices = () => {
  try {
    const output = execSync("adb devices").toString();
    const devices = output
      .split("\n")
      .slice(1) // Ignorar la primera línea ("List of devices attached")
      .map((line) => line.split("\t")[0].trim())
      .filter(Boolean); // Filtrar líneas vacías
    return devices;
  } catch (error) {
    console.error("❌ Error al obtener dispositivos:", error);
    return [];
  }
};

// console.log(getConnectedDevices());

export { getConnectedDevices };
