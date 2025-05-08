import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const stopAppiumServer = async (port) => {
  console.log(`🛑 Deteniendo Appium en el puerto ${port}...`);

  try {
    const { stdout } = await execAsync(`netstat -aon | findstr :${port}`);

    if (!stdout) {
      console.log(`⚠ No se encontró un proceso en el puerto ${port}`);
      return;
    }

    const line = stdout.split("\n").find((l) => l.includes("LISTENING"));
    if (!line) {
      console.log(`⚠ No hay ningún proceso LISTENING en el puerto ${port}`);
      return;
    }

    const pid = line.trim().split(/\s+/).pop(); // último valor es el PID
    if (!pid || isNaN(Number(pid))) {
      console.error(`❌ PID inválido: ${pid}`);
      return;
    }

    await execAsync(`taskkill /PID ${pid} /F /T`);
    console.log(`✅ Proceso con PID ${pid} detenido exitosamente.`);
  } catch (error) {
    console.error(
      `❌ Error al matar el proceso en el puerto ${port}:`,
      error.message
    );
  }
};

export { stopAppiumServer };

// await stopAppiumServer(4723);
