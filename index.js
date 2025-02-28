import { remote } from "webdriverio";
import { humanLikeDelay } from "./utils/humanLikeDelay.js";
import { clickOnAnyElementSelector } from "./utils/clickOnAnyElementSelector.js";
import { writeInSearchInput } from "./utils/writeInSearchInput.js";
import { generateViews } from "./utils/generateViews.js";
import { CAPABILITIES, SELECTORS, PORTS } from "./config.js";
import { startAllServers } from "./utils/startAppiumServers.js";
import { getConnectedDevices } from "./utils/getConnectedDevices.js";

const addVideoSelector = "id:com.zhiliaoapp.musically:id/f31";
const likeButtonSelector = "id:com.zhiliaoapp.musically:id/dt3";

const TEXT_TO_SEARCH = "Escardi";
const NUM_VIEWS = 5;

//**FUNCION PRINCIPAL */
const testAppium = async (udid, port) => {
  let driver;

  try {
    driver = await remote({
      hostname: "127.0.0.1",
      port,
      // path: "/wd/hub", // Appium Server UI
      path: "/", // Appium terminal
      capabilities: {
        ...CAPABILITIES,
        "appium:udid": udid,
      },
    });

    console.log(`✅ [${udid}] Conectado a Appium en puerto ${port}.`);

    await humanLikeDelay(); // Retraso

    //abrir TikTok desde el Home
    console.log(`⏳ [${udid}] Abriendo TikTok...`);

    await clickOnAnyElementSelector(driver, SELECTORS.tiktokIcon);

    await humanLikeDelay(); // Retraso

    //Intentamos que la aplicacion este completamente cargada antes de hacer click
    try {
      const splashScreen = await driver.$(SELECTORS.splashScreen);

      await driver.waitUntil(async () => await splashScreen.isExisting(), {
        timeout: 30000,
        timeoutMsg: `[${udid}] La pantalla inicial de TikTok no apareció a tiempo.`,
      });

      console.log(`✅ [${udid}] Aplicación cargada correctamente.`);
    } catch (error) {
      console.error(
        `${udid} ❌ No se pudo cargar correctamente la aplicación:`,
        error
      );

      // Cerramos la sesión antes de salir
      if (driver) {
        await driver.deleteSession();
      }

      console.log("🚨 Cerrando proceso porque la aplicación no se cargó.");
      process.exit(1); //Detenemos completamete la ejecución
    }

    //Llamada a la función que hace click en el buscador
    await clickOnAnyElementSelector(driver, SELECTORS.searchButton1);

    await humanLikeDelay(); // Retraso antes de hacer clic

    // Escribir en el input
    await writeInSearchInput(driver, TEXT_TO_SEARCH);

    await humanLikeDelay(); // Retraso antes de hacer clic

    //Hacer click en la pestaña 'Usuarios'
    await clickOnAnyElementSelector(driver, SELECTORS.usersButton);

    await humanLikeDelay(); // Retraso antes de hacer clic

    //Hacer click en el primer usuario de la busqueda
    await clickOnAnyElementSelector(driver, SELECTORS.firstUser);

    await humanLikeDelay(); // Retraso antes de hacer clic

    //Hacer click en el primer video del usuario
    await clickOnAnyElementSelector(driver, SELECTORS.firstVideo);

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
    // Iniciar los servidores de Appium
    console.log("⏳ Iniciando servidores de Appium...");
    await startAllServers(PORTS);
    console.log("✅ Todos los servidores de Appium iniciados.");

    const devices = getConnectedDevices();
    if (devices.length === 0) {
      console.log("🚨 No se encontraron dispositivos conectados.");
      return;
    }

    // Verificar que haya suficientes puertos
    if (devices.length > PORTS.length) {
      console.warn(
        `⚠️ Hay más dispositivos (${devices.length}) que puertos disponibles (${PORTS.length}). Solo se usarán los primeros ${PORTS.length} dispositivos.`
      );
    }

    const tasks = devices
      .slice(0, PORTS.length)
      .map((udid, index) => testAppium(udid, PORTS[index]));

    console.log(`🚀 Ejecutando pruebas en ${tasks.length} dispositivos...`);
    const results = await Promise.allSettled(tasks);

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
