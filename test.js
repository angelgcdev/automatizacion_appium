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

//Funcion para escribir en el cuadro de búsqueda
const writeInSearchInput = async (driver, textToSearch) => {
  try {
    //Localizar el input del buscador
    const searchInput = await driver.$("id:com.zhiliaoapp.musically:id/etg");

    await driver.waitUntil(async () => searchInput.isDisplayed(), {
      timeout: 10000, // Esperar hasta 10 segundos
      timeoutMsg: "El input de búsqueda no se hizo visible a tiempo.",
    });

    await searchInput.setValue(textToSearch); // Escribir en el input
    console.log(`✍ Escribiendo en el cuadro de búsqueda: ${textToSearch}`);

    await humanLikeDelay(); // Retraso antes de hacer clic

    //Hacer click en el boton buscar
    await clickOnElementSelector(driver, "id:com.zhiliaoapp.musically:id/sjd");
  } catch (error) {
    console.error("❌ Error al escribir en el cuadro de búsqueda.", error);
  }
};

const scrollUpTikTok = async (driver) => {
  console.log("📜 Haciendo scroll hacia arriba ⬆ en TikTok...");

  await driver.performActions([
    {
      type: "pointer",
      id: "finger1",
      parameters: { pointerType: "touch" },
      actions: [
        { type: "pointerMove", duration: 0, x: 240, y: 640 },
        { type: "pointerDown", button: 0 },
        { type: "pause", duration: 100 }, // Pequeña pausa para simular el gesto real
        { type: "pointerMove", duration: 300, x: 240, y: 160 }, // Movimiento de scroll
        { type: "pointerUp", button: 0 },
      ],
    },
  ]);

  console.log("✅ Scroll hacia arriba realizado con éxito.");
};

const scrollDownTikTok = async (driver) => {
  const { height, width } = await driver.getWindowRect();

  console.log("📜 Haciendo scroll hacia abajo ⬇ en TikTok...");

  await driver.performActions([
    {
      type: "pointer",
      id: "finger1",
      parameters: { pointerType: "touch" },
      actions: [
        { type: "pointerMove", duration: 0, x: width / 2, y: height * 0.2 }, // Arriba
        { type: "pointerDown", button: 0 },
        { type: "pause", duration: 100 },
        { type: "pointerMove", duration: 300, x: width / 2, y: height * 0.8 }, // Abajo
        { type: "pointerUp", button: 0 },
      ],
    },
  ]);

  console.log("✅ Scroll hacia abajo realizado con éxito.");
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

    //Llamada a la función que hace click en el buscador
    await clickOnElementSelector(driver, "id:com.zhiliaoapp.musically:id/gky");

    // Esperar un momento para dar tiempo a la transición
    await humanLikeDelay(); // Retraso antes de hacer clic

    // Escribir en el input
    const searchText = "descargas41";
    await writeInSearchInput(driver, searchText);

    // Esperar un momento para dar tiempo a la transición
    await humanLikeDelay(); // Retraso antes de hacer clic

    //Hacer click en la pestaña 'Usuarios'
    await clickOnElementSelector(driver, "accessibility id:Usuarios");

    // Esperar un momento para dar tiempo a la transición
    await humanLikeDelay(); // Retraso antes de hacer clic

    //Hacer click en el primer usuario de la busqueda
    await clickOnElementSelector(
      driver,
      'android=new UiSelector().className("android.widget.Button").instance(0)'
    );

    // Esperar un momento para dar tiempo a la transición
    await humanLikeDelay(); // Retraso antes de hacer clic

    //Hacer click en el primer video del usuario
    await clickOnElementSelector(
      driver,
      'android=new UiSelector().resourceId("com.zhiliaoapp.musically:id/cover").instance(2)'
    );

    // Esperar un momento para dar tiempo a la transición
    await humanLikeDelay(); // Retraso antes de hacer clic

    //Realizar scrolls muchos scrolls
    for (let i = 0; i < 10; i++) {
      console.log(`🔄 Scroll ${i + 1}...`);

      await driver.pause(getRandomDelay(200, 300));

      // Haciendo scroll hacia abajo
      await scrollUpTikTok(driver);
      await new Promise((resolve) =>
        setTimeout(resolve, getRandomDelay(200, 300))
      ); // Pausa de 500ms

      // Haciendo scroll hacia arriba
      await scrollDownTikTok(driver);
      await new Promise((resolve) =>
        setTimeout(resolve, getRandomDelay(200, 300))
      ); // Pausa de 500ms
    }
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
