/**
 * Este archivo maneja la gestión de servidores Appium para automatización móvil.
 * Permite iniciar y detener múltiples instancias de Appium en diferentes puertos
 * para controlar varios dispositivos Android simultáneamente.
 */

// Importamos las funciones necesarias para ejecutar comandos del sistema operativo
import { exec, execSync } from "child_process";

// Estructura de datos para mantener un registro de todos los procesos Appium activos
// Usamos Map para asociar cada puerto con su proceso correspondiente
const appiumProcesses = new Map();

/**
 * Inicia un servidor Appium en un puerto específico
 *
 * @param {number} port - Puerto donde se iniciará el servidor Appium
 * @returns {Promise<{port: number, status: string}>} Promesa que resuelve cuando el servidor está listo
 *
 * Ejemplo de uso:
 * const server = await startAppiumServer(4723);
 */
const startAppiumServer = (port) => {
  return new Promise((resolve, reject) => {
    console.log(`🔄 Iniciando Appium en el puerto ${port}...`);

    // Iniciamos Appium con los parámetros necesarios
    // --allow-insecure=adb_shell permite ejecutar comandos ADB directamente
    const appiumProcess = exec(
      `npx appium --allow-insecure=adb_shell --port ${port}`
    );

    // Registramos el proceso en nuestro mapa para poder gestionarlo después
    appiumProcesses.set(port, appiumProcess);

    // Control para saber si el proceso fue terminado intencionalmente
    let wasKilled = false;

    // Manejador de errores durante el inicio del servidor
    appiumProcess.on("error", (error) => {
      if (!wasKilled) {
        console.error(`❌ Error iniciando Appium en el puerto ${port}:`, error);
        reject({ port, error });
      }
    });

    // Monitoreamos la salida del proceso para detectar cuando está listo
    appiumProcess.stdout.on("data", (data) => {
      console.log(`[Appium ${port}]: ${data.trim()}`);

      // Cuando vemos este mensaje, sabemos que el servidor está listo
      if (data.includes("Appium REST http interface listener started")) {
        console.log(`✅ Appium iniciado en el puerto ${port}`);
        resolve({ port, status: "success" });
      }
    });

    // Detectamos si el proceso termina inesperadamente
    appiumProcess.on("exit", (code, signal) => {
      if (signal === "SIGTERM" || code === 1) {
        wasKilled = true;
      }
    });
  });
};

/**
 * Inicia múltiples servidores Appium, uno para cada dispositivo conectado
 *
 * @param {number} devicesCount - Número de dispositivos/servidores necesarios
 * @returns {Promise<{startedPorts: number[], appiumProcesses: Map}>}
 *
 * Ejemplo de uso:
 * const {startedPorts, appiumProcesses} = await startAllServers(2);
 */
const startAllServers = async (devicesCount) => {
  // Generamos un array de puertos consecutivos empezando desde 4723
  const ports = Array.from(
    { length: devicesCount },
    (_, indice) => 4723 + indice
  );

  // Iniciamos todos los servidores en paralelo
  const results = await Promise.allSettled(
    ports.map((port) => startAppiumServer(port))
  );

  // Almacenamos los puertos que se iniciaron exitosamente
  const startedPorts = [];

  // Mostramos un resumen del estado de los servidores
  console.log("\n📊 **Resumen de servidores:**");
  results.forEach((result) => {
    if (result.status === "fulfilled") {
      console.log(
        `✅ Servidor en puerto ${result.value.port} iniciado correctamente.`
      );
      startedPorts.push(result.value.port);
    } else {
      console.error(
        `❌ Falló en el puerto ${result.reason.port}:`,
        result.reason.error.message
      );
    }
  });

  return { startedPorts, appiumProcesses };
};

/**
 * Detiene todos los servidores Appium activos y limpia los recursos
 *
 * @param {Map<number, ChildProcess>} appiumProcesses - Mapa de procesos a detener
 * @returns {Promise<void>}
 *
 * Ejemplo de uso:
 * await stopAllServers(appiumProcesses);
 */
const stopAllServers = async (appiumProcesses) => {
  const stopPromises = [];

  // Iteramos sobre cada proceso activo y lo detenemos
  appiumProcesses.forEach((process, port) => {
    stopPromises.push(
      new Promise((resolve) => {
        const pid = process.pid;

        // Usamos taskkill para forzar el cierre del proceso y sus subprocesos
        exec(`taskkill /PID ${pid} /F /T`, (error, stdout, stderr) => {
          if (error) {
            console.error(
              `❌ Error al detener el servidor en puerto ${port} (PID: ${pid}):`,
              stderr.trim()
            );
          } else {
            console.log(
              `🛑 taskkill ejecutado para Appium en puerto ${port} (PID: ${pid}).`
            );
          }
        });

        // Manejamos los eventos de cierre del proceso
        process.on("exit", (code, signal) => {
          console.log(
            `✅ Proceso en puerto ${port} (PID: ${pid}) cerrado con código ${code}, señal ${signal}.`
          );
          resolve();
        });

        process.on("error", (err) => {
          console.error(
            `❌ Error en proceso Appium en puerto ${port} (PID: ${pid}):`,
            err
          );
          resolve();
        });
      })
    );
  });

  // Esperamos a que todos los procesos se detengan
  await Promise.all(stopPromises);

  // Verificación adicional: buscamos y matamos cualquier proceso que aún ocupe los puertos
  appiumProcesses.forEach((_, port) => {
    try {
      const netstatOutput = execSync(
        `netstat -aon | findstr :${port}`
      ).toString();
      const pidMatch = netstatOutput.match(/LISTENING\s+(\d+)/);
      if (pidMatch) {
        const remainingPid = pidMatch[1];
        execSync(`taskkill /F /PID ${remainingPid} /T`);
      }
    } catch (error) {
      // Si hay error, probablemente el puerto ya está libre
      console.log(`✅ Puerto ${port} ya está libre o no estaba ocupado.`);
    }
  });

  // Limpiamos la memoria
  appiumProcesses.clear();
};

// Exportamos las funciones para usar en otros archivos
export { startAllServers, stopAllServers };
