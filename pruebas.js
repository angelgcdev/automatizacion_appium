//***Este codigo va directo al video con su id url */

import { remote } from "webdriverio";
import { humanLikeDelay } from "./utils/humanLikeDelay.js";

//**FUNCION PRINCIPAL */
const pruebasTiktok = async () => {
  let driver;

  try {
    //Establece la conexion con Appium y el dispositivo móvil
    driver = await remote({
      hostname: "127.0.0.1", //Direccion local donde corre el servidor de Appium
      port: 4723, // Puerto en el que Appium está escuchando
      // path: "/wd/hub", // Appium Server UI
      path: "/", // Appium terminal
      capabilities: {
        platformName: "Android",
        "appium:udid": "ffbc3fc2", // ID del dispositivo
        "appium:automationName": "UiAutomator2", // Define el motor de automatización
        "appium:noReset": true, // No reinicia la app entre sesiones
        "appium:newCommandTimeout": 300, // Timeout de 5 minutos para comandos de Appium antes de ser desconectado
      },
    });

    console.log("✅ Conexión exitosa con el dispositivo y Appium.");

    await humanLikeDelay();

    // //abrir TikTok desde el Home
    // console.log("⏳ Abriendo TikTok en la pantalla de inicio...");
    // await clickOnAnyElementSelector(driver, SELECTORS.tiktokIcon);

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
        "https://www.tiktok.com/@descargas41/video/7450510105642142982", //la URL del video de TikTok a abrir
      ],
    });

    await driver.pause(30000); // Pausa la ejecución durante 2 segundos

    await humanLikeDelay();
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

pruebasTiktok();
