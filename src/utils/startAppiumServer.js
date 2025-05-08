import { exec } from "child_process";

const startAppiumServer = (port) => {
  console.log(`🔄 Iniciando Appium en el puerto ${port}...`);

  return new Promise((resolve, reject) => {
    const process = exec(
      `npx appium --allow-insecure=adb_shell --port ${port}`
    );

    process.stdout?.on("data", (data) => {
      console.log(`[Appium ${port}]: ${data.trim()}`);
      if (data.includes("Appium REST http interface listener started")) {
        console.log(`✅ Appium iniciado en el puerto ${port}`);
        resolve();
      }
    });

    process.stderr?.on("data", (data) => {
      console.error(`[Appium ${port} ERROR]: ${data.trim()}`);
    });

    process.on("error", (err) => {
      reject(new Error(`❌ Error al iniciar Appium:`, err.message));
    });
  });
};

// Ejemplo de uso
// await startAppiumServer(4723);

export { startAppiumServer };
