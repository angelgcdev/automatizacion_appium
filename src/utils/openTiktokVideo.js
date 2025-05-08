const openTiktokVideo = async (driver, URL_VIDEO_TIKTOK) => {
  console.log("⌛ Abriendo video directamente en TikTok...");

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
};

export { openTiktokVideo };
