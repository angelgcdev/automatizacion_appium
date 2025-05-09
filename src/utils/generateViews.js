import { connectToAppium } from "./connectToAppium.js";
import { getRandomDelay } from "./getRandomDelay.js";
import { scrollDown } from "./scrollDown.js";
import { scrollUp } from "./scrollUp.js";
import { startAppiumServer } from "./startAppiumServer.js";
import { stopAppiumServer } from "./stopAppiumServer.js";
import { openTiktokVideo } from "./openTiktokVideo.js";
import { goToProfileUserVideos } from "./goToProfileUserVideos.js";
import { humanLikeDelay } from "./humanLikeDelay.js";

//Funcion para las vistas
const generateViews = async (
  driver,
  numViews,
  udid,
  port,
  URL_VIDEO_TIKTOK
) => {
  try {
    for (let i = 0; i < numViews; i++) {
      console.log(`🔄 Scroll ${i + 1}...`);

      try {
        await driver.pause(getRandomDelay(100, 300));

        // Haciendo scroll hacia abajo
        await scrollDown(driver);
        await driver.pause(getRandomDelay(100, 300)); // Pausa

        // Haciendo scroll hacia arriba
        await scrollUp(driver);
        await driver.pause(getRandomDelay(100, 300)); // Pausa
      } catch (error) {
        console.error("⚠️ Error en scroll:", error);

        //Intentar reconectar con Appium
        console.log("🔁 Intentando reconectar con Appium...");

        try {
          // Detener el servidor en el puerto para este proceso
          await stopAppiumServer(port);

          //levantar el servidor en el puerto para este proceso
          await startAppiumServer(port);

          //Conectar nuevamente con appium
          const newDriver = await connectToAppium(udid, port);
          if (newDriver) {
            driver = newDriver;
            console.log("✅ Reconexión exitosa.");
          }

          await humanLikeDelay();
          //Abrir nuevamente el video de tiktok
          await openTiktokVideo(driver, URL_VIDEO_TIKTOK);

          await humanLikeDelay();
          //Ir nuevamente al perfil de videos del usuario
          await goToProfileUserVideos(driver);
        } catch (error) {
          console.error("❌ Falló la reconexión con Appium:", error);
        }

        i = i - 1; // descontar la falla para ser mas preciso en la cantidad de views
      }
    }

    return true;
  } catch (error) {
    console.log("❌ No se generaron las vistas correctamente...", error);
    return false;
  }
};

export { generateViews };
