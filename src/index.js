// 📦 Importaciones de librerias y utilidades necesarias
import { iniciarHttpServer } from "./httpServer.js";
import socket from "./socketClient.js";
import { iniciarTrackerDeDispositivos } from "./utils/device-tracker.js";

import { remote } from "webdriverio"; // Cliente Webdrier io para controlar dispositivos
import { humanLikeDelay } from "./utils/humanLikeDelay.js"; //
import { clickOnAnyElementSelector } from "./utils/clickOnAnyElementSelector.js";
import { generateViews } from "./utils/generateViews.js";
import { CAPABILITIES, SELECTORS } from "./config.js";
import { startAllServers, stopAllServers } from "./utils/startAppiumServers.js";
import { getConnectedDevices } from "./utils/getConnectedDevices.js";
import { writeInInput } from "./utils/writeInInput.js";

//Iniciar el servidor HTTP
iniciarHttpServer();

/**
 *  📲 Función principal de automatización por cada dispositivo
 * @param {string} udid - Identificador del dispositivo
 * @param {number} port - Puerto Appium asociado al dispositivo
 */
const tiktokAutomatizacion = async (
  udid,
  port,
  URL_VIDEO_TIKTOK,
  NUM_VIEWS
) => {
  let driver;

  try {
    // 🚀 Conectar con Appium para controlar el dispositivo
    driver = await remote({
      hostname: "127.0.0.1",
      port,
      // path: "/wd/hub", //si usas Appium Server UI
      path: "/", // Appium terminal
      capabilities: {
        ...CAPABILITIES,
        "appium:udid": udid,
      },
    });

    console.log(`✅ [${udid}] Conectado a Appium en puerto ${port}.`);

    // ⏳ Simula comportamiento humano
    await humanLikeDelay();

    // 🔗 Abrir la URL del video directamente en TikTok usando ADB(Android Debug Bridge)
    console.log("⏳ Abriendo video directamente en TikTok...");
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

    await humanLikeDelay();

    //❤️ Dar en 'Me Gusta' en el video
    await clickOnAnyElementSelector(driver, SELECTORS.likeButton);

    await humanLikeDelay();

    // await driver.pause(5000); // Pausa la ejecución durante 2 segundos

    // // 💾 Añadir o guardar video
    // await clickOnAnyElementSelector(driver, SELECTORS.addVideo);

    // await humanLikeDelay();

    // // Comentario en video
    // //hacer click en el boton comentario
    // await clickOnAnyElementSelector(driver, SELECTORS.commentButton);
    // await humanLikeDelay();

    // //hacer click en el input del comentario
    // await clickOnAnyElementSelector(driver, SELECTORS.inputComment);
    // await humanLikeDelay();

    // // Escribir el comentario
    // await writeInInput(driver, SELECTORS.textToComment, SELECTORS.inputField);
    // await humanLikeDelay();

    // // Publicar comentario
    // await clickOnAnyElementSelector(driver, SELECTORS.publicComment);
    // await humanLikeDelay();

    // //Cerrar los comentarios
    // await clickOnAnyElementSelector(driver, SELECTORS.closeComments);
    // await humanLikeDelay();

    // await humanLikeDelay();
    // await humanLikeDelay();

    // // 👀 Generar vistas
    // await generateViews(driver, NUM_VIEWS);

    // await humanLikeDelay();
  } catch (error) {
    // ⚠️ Capturar errores durante la automatización
    console.error(`❌ [${udid}] Error en Appium:`, error);
  } finally {
    // 🧹 Finalizar la sesión de Appium correctamente
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

/**
 * 🔁 Ejecutar en múltiples dispositivos
 */
const runOnMultipleDevices = async (url_video, num_views) => {
  // Para almacenar procesos de appium con los puertos
  let appiumProcesses;

  try {
    // 🔌 Obtener todos los dispositivos android conectados
    const devices = await getConnectedDevices();
    if (devices.length === 0) {
      console.log("🚨 No se encontraron dispositivos conectados.");
      return;
    }

    // 🔧 Iniciar un servidor Appium por cada dispositivo
    console.log("⏳ Iniciando servidores de Appium...");
    const { startedPorts, appiumProcesses: processes } = await startAllServers(
      devices.length
    );
    appiumProcesses = processes;
    console.log("✅ Todos los servidores de Appium iniciados.");

    // ⚙️ Preparar tareas de automatización por dispositivo
    const automationTasks = devices.map((udid, index) =>
      tiktokAutomatizacion(udid, startedPorts[index], url_video, num_views)
    );

    console.log(
      `🚀 Ejecutando pruebas en ${automationTasks.length} dispositivos...`
    );

    // 🧪 Ejecutar todas las automatizaciones en paralelo
    const results = await Promise.allSettled(automationTasks);

    // 📊 Mostrar el resultado de cada ejecución
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
  } finally {
    //Cerrar servidores Appium al final
    if (appiumProcesses) {
      await stopAllServers(appiumProcesses);
    }
    // process.exit(0);
  }
};

// Escuchar evento del backend para iniciar la automatización
socket.on("ejecutar-automatizacion", async ({ url_video, num_views }) => {
  console.log(
    "📥 Orden recibida: Iniciar automatización en múltiples dispositivos."
  );
  await runOnMultipleDevices(url_video, num_views);
});

iniciarTrackerDeDispositivos();
