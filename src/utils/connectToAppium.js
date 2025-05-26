// 1. Librerías de Node.js

// 2. Librerías de terceros
import { remote } from "webdriverio"; // Cliente Webdrier io para controlar dispositivos

// 3. Librerías internas absolutas

// 4. Imports relativos
import { CAPABILITIES } from "../config.js";

const connectToAppium = async (udid, port) => {
  let driver;
  try {
    driver = await remote({
      hostname: process.env.APPIUM_HOST || "127.0.0.1",
      port,
      // path: "/wd/hub", //si usas Appium Server UI
      path: "/", // Appium terminal
      capabilities: {
        ...CAPABILITIES,
        "appium:udid": udid,
      },
    });

    return driver;
  } catch (error) {
    console.error(
      `❌ Error al conectar con Appium para ${udid}:`,
      error.message
    );
    return null;
  }
};

export { connectToAppium };
