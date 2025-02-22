import { remote } from "webdriverio";

//**Variables */
const caps = {
  platformName: "Android",
  "appium:udid": "ffbc3fc2", // ID del dispositivo
  "appium:automationName": "UiAutomator2",
  "appium:noReset": true,
  "appium:newCommandTimeout": 60,
  "appium:appPackage": "com.zhiliaoapp.musically",
  "appium:appActivity": "com.ss.android.ugc.aweme.splash.SplashActivity",
};

//**Funciones */

//funcion para hacer retraso aleatorio
const humanLikeDelay = async () => {
  const delay = getRandomDelay(500, 1500);
  await new Promise((resolve) => setTimeout(resolve, delay));
};

// Función para hacer clic en el primer elemento disponible
const clickOnAnyElementSelector = async (driver, selectors) => {
  try {
    // Intentamos hacer click en el primer selector disponible
    for (let selector of selectors) {
      const element = await driver.$(selector);

      // Esperar hasta que el elemento esté visible
      if (await element.isDisplayed()) {
        await humanLikeDelay(); // Retraso antes de hacer clic
        await element.click();
        console.log(`✅ Click en el elemento: ${selector}`);
        return;
      }
    }
    console.log("❌ Ningún elemento fue encontrado.");
  } catch (error) {
    console.error("❌ Error al hacer click:", error.message);
  }
};

//Funcion para hacer click en el elemento
const clickOnElementSelector = async (driver, elementSelector) => {
  try {
    const element = await driver.$(elementSelector);

    //Esperar hasta que el elemento esté visible
    await driver.waitUntil(async () => element.isDisplayed(), {
      timeout: 10000,
      timeoutMsg: `El elemento ${elementSelector} no apareció a tiempo`,
    });

    await humanLikeDelay(); // Retraso antes de hacer clic

    //Hacer click en el elemento
    await element.click();
    console.log(`✅ Click en el elemento: ${elementSelector}`);
  } catch (error) {
    console.error(
      `❌ Error al hacer click en ${elementSelector}:`,
      error.message
    );
  }
};

// Función para obtener un retraso aleatorio
const getRandomDelay = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

//**FUNCION PRINCIPAL */
const testAppium = async () => {
  let driver;

  try {
    driver = await remote({
      hostname: "127.0.0.1",
      port: 4723,
      // path: "/wd/hub", // Appium Server UI
      path: "/", // Appium terminal
      capabilities: caps,
    });

    console.log("✅ Conexión exitosa con el dispositivo y Appium.");

    await humanLikeDelay(); // Retraso antes de hacer clic

    // Llamada a la función que hace click en el buscador
    await clickOnAnyElementSelector(driver, [
      'android=new UiSelector().resourceId("com.zhiliaoapp.musically:id/gky").instance(1)',
      "id:com.zhiliaoapp.musically:id/gky",
    ]);

    // await clickOnElementSelector(
    //   driver,
    //   'android=new UiSelector().resourceId("com.zhiliaoapp.musically:id/gky").instance(1)'
    // );

    // Esperar un momento para dar tiempo a la transición
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
