import { remote } from "webdriverio";

//**Variables Globales*/
const caps = {
  platformName: "Android",
  "appium:udid": "ffbc3fc2", // ID del dispositivo
  // "appium:udid": "GVY4C16B05001138", // ID del ma
  // "appium:udid": "R5CWB0RA51Z", // ID del wen
  "appium:automationName": "UiAutomator2",
  "appium:noReset": true,
  "appium:newCommandTimeout": 300,
  // "appium:appPackage": "com.zhiliaoapp.musically",
  // "appium:appActivity": "com.ss.android.ugc.aweme.splash.SplashActivity",
  // "appium:autoLaunch": true, // Asegura que la app se inicie automáticamente
};

const SELECTORS = {
  tiktokIcon: [
    '-android uiautomator:new UiSelector().description("TikTok")',
    '-android uiautomator:new UiSelector().text("TikTok")',
  ],
  splashScreen: "id:com.zhiliaoapp.musically:id/jnh",
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
    '-android uiautomator:new UiSelector().resourceId("com.zhiliaoapp.musically:id/o6n").instance(0)',
  ],
  firstVideo: [
    'android=new UiSelector().resourceId("com.zhiliaoapp.musically:id/cover").instance(2)',
  ],
  likeButton: ["id:com.zhiliaoapp.musically:id/dt3"],
  addVideo: ["id:com.zhiliaoapp.musically:id/f31"],
};

const addVideoSelector = "id:com.zhiliaoapp.musically:id/f31";
const likeButtonSelector = "id:com.zhiliaoapp.musically:id/dt3";

const TEXT_TO_SEARCH = "Escardi";
const NUM_VIEWS = 5;

//**Funciones */

//funcion para hacer retraso aleatorio
const humanLikeDelay = async () => {
  const delay = getRandomDelay(500, 2000);
  await new Promise((resolve) => setTimeout(resolve, delay));
};

// Función para hacer un tap en coordenadas específicas
const tapAtCoordinates = async (driver, x, y) => {
  try {
    // Verificar que las coordenadas estén dentro de la pantalla
    const windowSize = await driver.getWindowSize();
    if (x < 0 || x > windowSize.width || y < 0 || y > windowSize.height) {
      throw new Error(`Coordenadas fuera de pantalla: X=${x}, Y=${y}`);
    }

    console.log(`📍 Tap en coordenadas: X=${x}, Y=${y}`);

    // Simular retraso humanoide si está definido
    if (typeof humanLikeDelay === "function") {
      await humanLikeDelay();
    }

    // Realizar tap utilizando performActions
    await driver.performActions([
      {
        type: "pointer",
        id: "finger1",
        parameters: { pointerType: "touch" },
        actions: [
          { type: "pointerMove", duration: 0, x: x, y: y },
          { type: "pointerDown", button: 0 },
          { type: "pointerUp", button: 0 },
        ],
      },
    ]);

    console.log(`✅ Tap realizado en (${x}, ${y})`);
  } catch (error) {
    console.error("❌ Error al hacer tap en coordenadas:", error.message);
    throw new Error(
      "No se pudo realizar el tap en coordenadas: " + error.message
    );
  }
};

// Función para hacer clic en el primer elemento disponible
const clickOnAnyElementSelector = async (driver, selectors) => {
  //Creamos un array de promesas
  const elementPromises = selectors.map(async (selector) => {
    const element = await driver.$(selector); //Busca el elemento
    const exists = await element.isExisting(); // Verificar si existe

    if (exists) {
      return element; // Retorna el elemento si es valido
    } else {
      throw new Error(`❌ Elemento no encontrado: ${selector}`);
    }
  });

  try {
    //Esperar al primer elemento válido usando Promise.any
    const validElement = await Promise.any(elementPromises);

    await humanLikeDelay();

    //Hacer click en el elemento encontrado
    await validElement.click();
    console.log(`✅ Click en el elemento: ${validElement.selector}`);
    return true; // Éxito
  } catch (error) {
    console.error("❌ Ningun elemento válido fue encontrado:", error);
    throw new Error("No se pudo hacer click en ningun elemento.");
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

    // Esperar un momento para dar tiempo a la transición
    await humanLikeDelay(); // Retraso antes de hacer clic

    // Dar "Me gusta" con coordenadas
    // console.log("⏳ Esperando a que la UI esté lista para 'Me gusta'...");
    // await driver.waitUntil(
    //   async () => {
    //     try {
    //       // Opcional: Verificar si el área está interactuable (puedes omitirlo si es rápido)
    //       const element = await driver.$("id:com.zhiliaoapp.musically:id/dt3");
    //       return await element.isExisting();
    //     } catch (e) {
    //       return false;
    //     }
    //   },
    //   {
    //     timeout: 10000,
    //     timeoutMsg: "La UI para 'Me gusta' no está lista a tiempo",
    //   }
    // );
    await tapAtCoordinates(driver, 998, 1418); // Tap en el centro del botón "Me gusta"

    // Esperar un momento para dar tiempo a la transición
    await humanLikeDelay(); // Retraso antes de hacer clic

    //Tap en guardar video
    await tapAtCoordinates(driver, 998, 1760); // Tap en el centro del botón "Me gusta"

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
