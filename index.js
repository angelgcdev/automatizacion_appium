import { remote } from "webdriverio";
import { humanLikeDelay } from "./utils/humanLikeDelay.js";
import { clickOnAnyElementSelector } from "./utils/clickOnAnyElementSelector.js";
import { writeInSearchInput } from "./utils/writeInSearchInput.js";
import { generateViews } from "./utils/generateViews.js";
import { CAPABILITIES, SELECTORS } from "./config.js";

const addVideoSelector = "id:com.zhiliaoapp.musically:id/f31";
const likeButtonSelector = "id:com.zhiliaoapp.musically:id/dt3";

const TEXT_TO_SEARCH = "Escardi";
const NUM_VIEWS = 5;

//**Funciones */

//**FUNCION PRINCIPAL */
const testAppium = async () => {
  let driver;

  try {
    driver = await remote({
      hostname: "127.0.0.1",
      port: 4723,
      // path: "/wd/hub", // Appium Server UI
      path: "/", // Appium terminal
      capabilities: CAPABILITIES,
    });

    console.log("✅ Conexión exitosa con el dispositivo y Appium.");

    await humanLikeDelay(); // Retraso

    //abrir TikTok desde el Home
    console.log("⏳ Abriendo TikTok en la pantalla de inicio...");

    await clickOnAnyElementSelector(driver, SELECTORS.tiktokIcon);

    await humanLikeDelay(); // Retraso

    //Intentamos que la aplicacion este completamente cargada antes de hacer click
    try {
      const splashScreen = await driver.$(SELECTORS.splashScreen);

      await driver.waitUntil(async () => await splashScreen.isExisting(), {
        timeout: 30000,
        timeoutMsg: "La pantalla inicial de Tiktok no apareció a tiempo.",
      });

      console.log("✅ La aplicación ha cargado correctamente.");
    } catch (error) {
      console.error("❌ No se pudo cargar correctamente la aplicación:", error);

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
    console.error("❌ Error al conectar con Appium:", error);
  } finally {
    if (driver) {
      try {
        await driver.deleteSession();
        console.log("🔄 Sesión cerrada correctamente.");
      } catch (error) {
        console.error("⚠️ Error al cerrar la sesión:", error);
      }
    }
  }
};

testAppium();
