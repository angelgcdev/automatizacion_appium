import { remote } from "webdriverio";

//**Variables Globales*/
const caps = {
  platformName: "Android",
  "appium:udid": "ffbc3fc2", // ID del dispositivo
  "appium:automationName": "UiAutomator2",
  "appium:noReset": true,
  "appium:newCommandTimeout": 300,
  "appium:appPackage": "com.zhiliaoapp.musically",
  "appium:appActivity": "com.ss.android.ugc.aweme.splash.SplashActivity",
  "appium:autoLaunch": true, // Asegura que la app se inicie automáticamente
};

const SELECTORS = {
  splashScreen: 'android=new UiSelector().text("Inicio")',
  searchButton1: [
    'android=new UiSelector().resourceId("com.zhiliaoapp.musically:id/gky").instance(1)',
    "id:com.zhiliaoapp.musically:id/gky",
    'android=new UiSelector().resourceId("com.zhiliaoapp.musically:id/gll").instance(1)',
  ],
  searchInput: "id:com.zhiliaoapp.musically:id/eu9",
  searchButton2: [
    "id:com.zhiliaoapp.musically:id/sjd",
    "id:com.zhiliaoapp.musically:id/skb",
  ],
  usersButton: ["accessibility id:Usuarios"],
  firstUser: [
    'android=new UiSelector().className("android.widget.Button").instance(0)',
  ],
  firstVideo: [
    'android=new UiSelector().resourceId("com.zhiliaoapp.musically:id/cover").instance(1)',
  ],
  likeButton: ["accessibility id:Me gusta"],
  addVideo: ["id:com.zhiliaoapp.musically:id/f31"],
};

const TEXT_TO_SEARCH = "angelgcdev";
const NUM_VIEWS = 5;

//**Funciones */

//funcion para hacer retraso aleatorio
const humanLikeDelay = async () => {
  const delay = getRandomDelay(500, 2000);
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

//Funcion para escribir en el cuadro de búsqueda
const writeInSearchInput = async (driver, textToSearch) => {
  try {
    //Localizar el input del buscador
    const searchInput = await driver.$(SELECTORS.searchInput);

    await driver.waitUntil(async () => searchInput.isDisplayed(), {
      timeout: 10000, // Esperar hasta 10 segundos
      timeoutMsg: "El input de búsqueda no se hizo visible a tiempo.",
    });

    await searchInput.setValue(textToSearch); // Escribir en el input
    console.log(`✍ Escribiendo en el cuadro de búsqueda: ${textToSearch}`);

    await humanLikeDelay(); // Retraso antes de hacer clic

    //Hacer click en el boton buscar
    await clickOnAnyElementSelector(driver, SELECTORS.searchButton2);
  } catch (error) {
    console.error("❌ Error al escribir en el cuadro de búsqueda.", error);
  }
};

//Funcion para las vistas
const generateViews = async (driver, numViews) => {
  for (let i = 0; i < numViews; i++) {
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

    //Intentamos que la aplicacion este completamente cargada antes de hacer click
    try {
      const splashScreen = await driver.$(SELECTORS.splashScreen);
      await splashScreen.waitForDisplayed({ timeout: 30000 });
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

    // Esperar un momento para dar tiempo a la transición
    await humanLikeDelay(); // Retraso antes de hacer clic

    // Escribir en el input
    await writeInSearchInput(driver, TEXT_TO_SEARCH);

    // Esperar un momento para dar tiempo a la transición
    await humanLikeDelay(); // Retraso antes de hacer clic

    //Hacer click en la pestaña 'Usuarios'
    await clickOnAnyElementSelector(driver, SELECTORS.usersButton);

    // Esperar un momento para dar tiempo a la transición
    await humanLikeDelay(); // Retraso antes de hacer clic

    //Hacer click en el primer usuario de la busqueda
    await clickOnAnyElementSelector(driver, SELECTORS.firstUser);

    // Esperar un momento para dar tiempo a la transición
    await humanLikeDelay(); // Retraso antes de hacer clic

    //Hacer click en el primer video del usuario
    await clickOnAnyElementSelector(driver, SELECTORS.firstVideo);

    // Esperar un momento para dar tiempo a la transición
    await humanLikeDelay(); // Retraso antes de hacer clic

    //Generar vistas
    await generateViews(driver, NUM_VIEWS);

    // Esperar un momento para dar tiempo a la transición
    await humanLikeDelay(); // Retraso antes de hacer clic

    //Click en 'Me Gusta'
    await clickOnAnyElementSelector(driver, SELECTORS.likeButton);

    // Esperar un momento para dar tiempo a la transición
    await humanLikeDelay(); // Retraso antes de hacer clic

    //Añadir o guardar video
    await clickOnAnyElementSelector(driver, SELECTORS.addVideo);

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
