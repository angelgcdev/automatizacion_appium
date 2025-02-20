const wdio = require("webdriverio");

const caps = {
  platformName: "Android",
  "appium:deviceName": "3201285bf219844a", // ID del dispositivo
  "appium:automationName": "UiAutomator2",
  "appium:noReset": true,
  "appium:newCommandTimeout": 300,
  "appium:appPackage": "com.zhiliaoapp.musically",
  "appium:appActivity": "com.ss.android.ugc.aweme.splash.SplashActivity",
};

//Funcion para hacer click en el elemento
async function clickOnElementSelector(driver, elementSelector) {
  try {
    //Pausar 3 segundos para dar tiempo a la app de cargar
    await driver.pause(3000);

    //Esperar hasta que el elemento esté visible
    await driver.waitUntil(
      async () => (await driver.$(elementSelector)).isDisplayed(),
      {
        timeout: 5000,
        timeoutMsg: "El elemento no es visible después de 5 segundos",
      }
    );

    //Hacer click en el elemento
    const searchBar = await driver.$(elementSelector);
    await searchBar.click();
    console.log("Se hizo click en el elemento");
  } catch (error) {
    console.error("❌ Error al hacer click en el elemento.");
  }
}

//Funcion para hacer click en el boton de busqueda
async function clickSearchButton(driver) {
  try {
    //Pausar 3 segundos para dar tiempo a la app de cargar
    await driver.pause(3000);

    //Esperar hasta que el boton de busqueda esté visible
    await driver.waitUntil(
      async () =>
        (await driver.$("id:com.zhiliaoapp.musically:id/gky")).isDisplayed(),
      {
        timeout: 5000,
        timeoutMsg: "El botón de búsqueda no es visible después de 5 segundos",
      }
    );

    //Hacer click en el boton de busqueda
    const searchBar = await driver.$("id:com.zhiliaoapp.musically:id/gky");
    await searchBar.click();
    console.log("Se hizo click en el buscador de TikTok.");
  } catch (error) {
    console.error("❌ Error al hacer click en el buscador de TikTok.");
  }
}

//Funcion para escribir en el cuadro de búsqueda
async function writeInSearchInput(driver, textToSearch) {
  try {
    //Esperar un poco antes de escribir
    await driver.pause(1000);

    //Localizar el input del buscador
    const searchInput = await driver.$("id:com.zhiliaoapp.musically:id/etg");
    await searchInput.setValue(textToSearch); // Escribir en el input
    console.log(`Escribiendo en el cuadro de búsqueda: ${textToSearch}`);

    //Hacer click en el boton buscar
    await clickOnElementSelector(driver, "id:com.zhiliaoapp.musically:id/sjd");
  } catch (error) {
    console.error("❌ Error al escribir en el cuadro de búsqueda.", error);
  }
}

async function testAppium() {
  let driver;

  try {
    driver = await wdio.remote({
      hostname: "127.0.0.1",
      port: 4723,
      path: "/wd/hub", // Appium Server UI
      // path: "/", // Appium terminal
      capabilities: caps,
    });

    console.log("✅ Conexión exitosa con el dispositivo y Appium.");

    //Llamada a la función que hace click en el buscador
    await clickSearchButton(driver);

    // Esperar un momento para dar tiempo a la transición
    await driver.pause(2000);

    //Llamada a la función para escribir en el buscador
    const searchText = "Escardi";
    writeInSearchInput(driver, searchText);

    // Esperar un momento para dar tiempo a la transición
    await driver.pause(2000);

    //Hacer click en la pestaña 'Usuarios'
    await clickOnElementSelector(driver, "accessibility id:Usuarios");

    // Esperar un momento para dar tiempo a la transición
    await driver.pause(2000);

    //Hacer click en el primer elemento de la busqueda
    await clickOnElementSelector(
      driver,
      'android=new UiSelector().className("android.widget.Button").instance(0)'
    );

    // Esperar un momento para dar tiempo a la transición
    await driver.pause(2000);
  } catch (error) {
    console.error("❌ Error al conectar con Appium:", error);
  }
  // finally {
  //   if (driver) {
  //     try {
  //       await driver.deleteSession();
  //       console.log("🔄 Sesión cerrada correctamente.");
  //     } catch (error) {
  //       console.error("⚠️ Error al cerrar la sesión:", error);
  //     }
  //   }
  // }
}

testAppium();
//************************************************** */
//************************************************** */
//************************************************** */
//************************************************** */

// const wdio = require("webdriverio");

// const caps = {
//   platformName: "Android",
//   "appium:udid": "ffbc3fc2", // ID del dispositivo
//   "appium:automationName": "UiAutomator2",
//   "appium:noReset": true,
//   "appium:newCommandTimeout": 300, // Espera 5 minutos antes de cerrar por inactividad
//   "appium:platformVersion": "14", // Versión de Android en tu dispositivo
//   "appium:deviceReadyTimeout": 30000, // Tiempo para que el dispositivo esté listo
// };

// async function testAppium() {
//   let driver;

//   try {
//     driver = await wdio.remote({
//       hostname: "127.0.0.1",
//       port: 4723,
//       path: "/",
//       capabilities: caps,
//     });

//     console.log("✅ Conexión exitosa con el dispositivo y Appium.");
//     const deviceName = await driver.capabilities.deviceName;
//     console.log("📱 Dispositivo conectado:", deviceName);

//     // 🏗️ Aquí puedes agregar interacciones con la app

//     const screenSize = await driver.getWindowRect();
//     console.log("SCREEN SIZE:", screenSize); // { width: 1080, height: 1920, x: 0, y: 0 }
//   } catch (error) {
//     console.error("❌ Error al conectar con Appium:", error.message);
//     console.error("Detalles del error:", error.stack);
//   } finally {
//     if (driver) {
//       try {
//         await driver.deleteSession();
//         console.log("🔄 Sesión cerrada correctamente.");
//       } catch (error) {
//         console.error("⚠️ Error al cerrar la sesión:", error);
//       }
//     }
//   }
// }

// testAppium();
