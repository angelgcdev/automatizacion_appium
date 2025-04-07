//Importaciones de librerias y utilidades necesarias
import { remote } from "webdriverio";
import { humanLikeDelay } from "./utils/humanLikeDelay.js";
import { clickOnAnyElementSelector } from "./utils/clickOnAnyElementSelector.js";
import { writeInSearchInput } from "./utils/writeInSearchInput.js";
import { generateViews } from "./utils/generateViews.js";
import { CAPABILITIES, SELECTORS, PORTS } from "./config.js";
import { startAllServers } from "./utils/startAppiumServers.js";
import { getConnectedDevices } from "./utils/getConnectedDevices.js";

//URL del video de TikTok
const URL_VIDEO_TIKTOK =
  "https://www.tiktok.com/@descargas41/video/7450510105642142982";
//Numero de vistas a generar
const NUM_VIEWS = 5;

//Función principal de automatización por dispositivo
const tiktokAutomatizacion = async (udid, port) => {
  let driver;

  try {
    //Conectar con el servidor Appium en el puerto correspondiente
    driver = await remote({
      hostname: "127.0.0.1",
      port,
      // path: "/wd/hub", //si usas Appium Server UI
      path: "/", // Appium terminal
      capabilities: {
        ...CAPABILITIES,
        "appium:udid": udid, //UDID del dispositivo a controlar
      },
    });

    console.log(`✅ [${udid}] Conectado a Appium en puerto ${port}.`);

    await humanLikeDelay(); // Espera aleatoria

    // Abrir TikTok directamente al video usando su URL
    console.log("⏳ Abriendo video directamente en TikTok...");

    //Usa el comando ADB (Android Debug Bridge) para ejecutar una acción de shel en el dispositivo
    await driver.execute("mobile: shell", {
      command: "am", // El comando para ejecutar actividades en Android
      args: [
        "start", // Indica que se va iniciar una actividad
        "-a", // Acción de visualización (abrir algo)
        "android.intent.action.VIEW", // Acción de visualización (abrir algo)
        "-d", //la URL del video de TikTok a abrir
        URL_VIDEO_TIKTOK, //la URL del video de TikTok a abrir
      ],
    });

    await driver.pause(3000); // Pausa la ejecución durante 2 segundos

    await humanLikeDelay(); // Retraso antes de hacer clic

    //Generar vistas
    await generateViews(driver, NUM_VIEWS);

    await humanLikeDelay(); // Retraso antes de hacer clic

    //Click en 'Me Gusta'
    await clickOnAnyElementSelector(driver, SELECTORS.likeButton);

    await humanLikeDelay(); // Retraso antes de hacer clic

    //Añadir o guardar video
    await clickOnAnyElementSelector(driver, SELECTORS.addVideo);

    await humanLikeDelay(); // Retraso antes de hacer clic
  } catch (error) {
    console.error(`❌ [${udid}] Error en Appium:`, error);
  } finally {
    if (driver) {
      try {
        await driver.deleteSession();
        console.log(`🔄 [${udid}] Sesión cerrada correctamente.`);
      } catch (error) {
        console.error(`${udid} ⚠️ Error al cerrar la sesión:`, error);
      }
    }
  }
};

// Ejecutar en múltiples dispositivos
const runOnMultipleDevices = async () => {
  try {
    //Obtener los dispositivos conectados
    const devices = getConnectedDevices();
    if (devices.length === 0) {
      console.log("🚨 No se encontraron dispositivos conectados.");
      return;
    }

    // Iniciar los servidores de Appium
    console.log("⏳ Iniciando servidores de Appium...");
    const startedPorts = await startAllServers(devices.length);
    console.log("✅ Todos los servidores de Appium iniciados.");

    const automationTasks = devices.map((udid, index) =>
      tiktokAutomatizacion(udid, startedPorts[index])
    );

    console.log(
      `🚀 Ejecutando pruebas en ${automationTasks.length} dispositivos...`
    );
    const results = await Promise.allSettled(automationTasks);

    // Analizar resultados
    results.forEach((result, index) => {
      const udid = devices[index];
      if (result.status === "fulfilled") {
        console.log(`✅ [${udid}] Ejecución completada con éxito.`);
      } else {
        console.error(`❌ [${udid}] Falló con error:`, result.reason);
      }
    });

    console.log("🏁 Pruebas finalizadas en todos los dispositivos.");
  } catch (error) {
    console.error(
      "❌ Error al iniciar los servidores o ejecutar las pruebas:",
      error
    );
  }
};

// Iniciar ejecución dentro de una función autoejecutable
(async () => {
  await runOnMultipleDevices();
})();
