import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

async function killAdbChildProcesses() {
  try {
    const { stdout } = await execAsync(
      `wmic process where "name='adb.exe'" get ProcessId,CommandLine /FORMAT:csv`
    );

    console.log("STDOUT:", stdout);

    const lines = stdout
      .split("\n")
      .filter((line) => line.trim() && !line.startsWith("Node"));

    console.log("Lines:", lines);

    const procesos = lines
      .map((line) => {
        const partes = line.trim().split(",");
        if (partes.length < 3) return null;
        const commandLine = partes
          .slice(1, partes.length - 1)
          .join(",")
          .trim();
        const pid = Number(partes[partes.length - 1]);
        return { commandLine, pid };
      })
      .filter(Boolean);

    console.log("Procesos:", procesos);

    // Separar procesos
    const servidor = procesos.find((p) =>
      p.commandLine.includes("adb -L tcp:5037 fork-server server")
    );
    const hijos = procesos.filter(
      (p) => !p.commandLine.includes("adb -L tcp:5037 fork-server server")
    );

    if (!servidor) {
      console.log("No se encontró el proceso servidor ADB.");
      return;
    }

    console.log(`Servidor ADB activo PID: ${servidor.pid}`);

    if (hijos.length === 0) {
      console.log("No hay procesos hijos que matar.");
      return;
    }

    for (const proc of hijos) {
      try {
        console.log(
          `Matando proceso PID: ${proc.pid} CMD: ${proc.commandLine}`
        );
        await execAsync(`taskkill /PID ${proc.pid} /F`);
      } catch (error) {
        console.error(`Error matando PID ${proc.pid}: ${error.message}`);
      }
    }

    console.log("Procesos hijos finalizados. Servidor ADB sigue activo.");
  } catch (error) {
    console.error("Error al limpiar procesos adb:", error.message);
  }
}

//Prueba
// killAdbChildProcesses();

export { killAdbChildProcesses };
