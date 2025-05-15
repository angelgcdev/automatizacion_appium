import { videoPageSelectors as tiktokVideoSelectors } from "../pages/tiktok/videoPage.js";

const openTiktokVideo = async (driver, URL_VIDEO_TIKTOK) => {
  console.log("⌛ Abriendo video directamente en TikTok...");

  try {
    await driver.execute("mobile: shell", {
      command: "am", //Activity Manager - ejecutar actividades en Android
      args: [
        "start", // Indica que se va iniciar una actividad
        "-a", // Action- Acción de visualización (abrir algo)
        "android.intent.action.VIEW", // Acción de visualización (abrir algo)
        "-d", // Data - la URL del video de TikTok a abrir
        URL_VIDEO_TIKTOK, //la URL del video de TikTok a abrir
      ],
    });

    await driver.pause(5000); // Pausa la ejecución durante 5 segundos

    //Aqui la validacion

    const element = await driver
      .$(tiktokVideoSelectors.createButton)
      .catch(() => null);

    if (!element) {
      throw new Error(
        "No se pudo encontrar el selector del botón de creación."
      );
    }

    const isExisted = await element
      .waitForExist({ timeout: 5000 })
      .catch(() => false);

    if (!isExisted) {
      throw new Error(
        `El video no se cargó correctamente desde la URL: ${URL_VIDEO_TIKTOK}`
      );
    }

    console.log("✅ Video abierto correctamente.");
  } catch (error) {
    console.error("❌ Error al intentar abrir el video en Tiktok:", error);
    throw error; // Propaga el error
  }
};

export { openTiktokVideo };
