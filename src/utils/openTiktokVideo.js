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

    await driver.pause(3000); // Pausa la ejecución durante 5 segundos

    //Aqui la validacion

    await driver.waitUntil(
      async () => {
        try {
          // Verificar si el botón de "Crear" está presente (esto indica que el video se cargó)
          const createButton = await driver.$(
            tiktokVideoSelectors.createButton
          );
          const exists = await createButton.isExisting();
          if (exists) {
            console.log("✅ Video de TikTok cargado exitosamente");
          }
          return exists;
        } catch (error) {
          return false; // Si hay error, seguir esperando
        }
      },
      {
        timeout: 10000,
        interval: 500,
        timeoutMsg: "TikTok no cargó el video después de 10 segundos",
      }
    );
  } catch (error) {
    console.error("❌ Error al intentar abrir el video en Tiktok:", error);
    throw error; // Propaga el error
  }
};

export { openTiktokVideo };
