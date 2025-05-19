// 1. Librerías de Node.js

// 2. Librerías de terceros

// 3. Librerías internas absolutas

// 4. Imports relativos
import { iniciarHttpServer } from "./httpServer.js";
import { getSocket } from "./socketClient.js";
import { humanLikeDelay } from "./utils/humanLikeDelay.js";
import { generateViews } from "./utils/generateViews.js";
import { getConnectedDevices } from "./utils/getConnectedDevices.js";
import { clickSimple } from "./utils/clickSimple.js";
import { videoPageSelectors as tiktokVideoSelectors } from "./pages/tiktok/videoPage.js";
import { connectToAppium } from "./utils/connectToAppium.js";
import { openTiktokVideo } from "./utils/openTiktokVideo.js";
import { goToProfileUserVideos } from "./utils/goToProfileUserVideos.js";
import { generateDevicePort } from "./utils/generateDevicePort.js";
import { startAppiumServer } from "./utils/startAppiumServer.js";
import { stopAppiumServer } from "./utils/stopAppiumServer.js";
import { commentOnTiktokVideo } from "./utils/commentOnTiktokVideo.js";
import { getUsernameTiktok } from "./utils/getUsernameTiktok.js";

//Iniciar el servidor HTTP
iniciarHttpServer();

/**
 *  📲 Función principal de automatización por cada dispositivo
 * @param {string} udid - Identificador del dispositivo
 * @param {number} port - Puerto Appium asociado al dispositivo
 */
const tiktokAutomatizacion = async (
  udid,
  port,
  scheduledTiktokInteractionData,
  activeDevice
) => {
  // Para guardar el historial de la interacción
  const history = {
    device_id: activeDevice.device_id,
    username: "",
    total_views: 0,
    liked: false,
    video_saved: false,
    commented: "",
    video_url: "",
    status: "",
  };

  let driver; // Para guardar la sesión con Appium
  let wasClicked;

  //Matando el servidor appium
  await stopAppiumServer(port);

  //Levantando el servidor para appium
  await startAppiumServer(port);

  try {
    // 🚀 Conectar con Appium para controlar el dispositivo
    driver = await connectToAppium(udid, port);

    console.log(`✅ [${udid}] Conectado a Appium en puerto ${port}.`);
    await humanLikeDelay();

    // 🔗 Abrir la URL del video directamente en TikTok usando ADB(Android Debug Bridge)
    await openTiktokVideo(driver, scheduledTiktokInteractionData.video_url);
    history.video_url = scheduledTiktokInteractionData.video_url;

    await humanLikeDelay();

    // Obtener el username
    const username = await getUsernameTiktok(driver);
    if (username) {
      history.username = username;
    }

    await humanLikeDelay();

    // Ir al perfil de videos del usuario
    await goToProfileUserVideos(driver);

    //❤️'Me Gusta'
    if (scheduledTiktokInteractionData.liked) {
      wasClicked = await clickSimple(driver, tiktokVideoSelectors.likeButton);
      if (wasClicked) {
        history.liked = true;
      }
    }

    await humanLikeDelay();

    // 💾 Guardar video
    if (scheduledTiktokInteractionData.saved) {
      wasClicked = await clickSimple(
        driver,
        tiktokVideoSelectors.saveVideoButton
      );

      if (wasClicked) {
        history.video_saved = true;
      }
    }

    await humanLikeDelay();

    // 💬 Comentar
    if (
      scheduledTiktokInteractionData.comment &&
      scheduledTiktokInteractionData.comment.trim() !== ""
    ) {
      const wasCommented = await commentOnTiktokVideo(
        driver,
        scheduledTiktokInteractionData.comment
      );
      if (wasCommented) {
        history.commented = scheduledTiktokInteractionData.comment;
      }
    }

    await humanLikeDelay();

    // 👀 Vistas
    if (scheduledTiktokInteractionData.views_count > 0) {
      const wasGeneratedViews = await generateViews(
        driver,
        scheduledTiktokInteractionData.views_count,
        udid,
        port,
        scheduledTiktokInteractionData.video_url
      );

      if (wasGeneratedViews) {
        history.total_views = scheduledTiktokInteractionData.views_count;
      }
    }

    await humanLikeDelay();

    return {
      activeDevice,
      status: "COMPLETADA",
      history,
      scheduledTiktokInteraction_id: scheduledTiktokInteractionData.id,
    };
  } catch (error) {
    // ⚠️ Capturar errores durante la automatización
    console.error(`❌ [${udid}] Error en Appium:`, error);

    return {
      activeDevice,
      status: "FALLIDA",
      history,
      scheduledTiktokInteraction_id: scheduledTiktokInteractionData.id,
      error: error.message,
    };
  } finally {
    if (driver) {
      try {
        // //✅ Cerrar la aplicación de Tiktok
        // await driver.terminateApp("com.zhiliaoapp.musically");
        // console.log("📱 Tiktok cerrado correctamente.");

        //✅ Cerrar la sesión de Appium
        await driver.deleteSession();
        console.log(`🔄 [${udid}] Sesión cerrada correctamente.`);
      } catch (error) {
        console.error(`${udid} ⚠️ Error al cerrar la sesión:`, error);
      }
    }

    //Matando el servidor appium
    await stopAppiumServer(port);
  }
};

/**
 * 🔁 Ejecutar en múltiples dispositivos
 */
const runOnMultipleDevices = async (data) => {
  //Obtener la conexion Socket.IO
  const socket = getSocket();

  const { scheduledTiktokInteractionData, activeDevices } = data;

  try {
    // 🔌 Obtener todos los dispositivos android conectados
    const devices = await getConnectedDevices();
    if (devices.length === 0) {
      console.log("🚨 No se encontraron dispositivos conectados.");
      return;
    }

    const udidsPorts = generateDevicePort(devices);

    // ⚙️ Preparar tareas de automatización por dispositivo
    const automationTasks = udidsPorts.map((udidPort) => {
      const activeDevice = activeDevices.find(
        (element) => element.udid === udidPort.udid
      );
      return tiktokAutomatizacion(
        udidPort.udid, //udid
        udidPort.port, // port
        scheduledTiktokInteractionData,
        activeDevice
      );
    });

    console.log(
      `🚀 Ejecutando pruebas en ${automationTasks.length} dispositivos...`
    );

    // 🧪 Ejecutar todas las automatizaciones en paralelo
    const results = await Promise.allSettled(automationTasks);

    // 📊 Mostrar el resultado de cada ejecución
    results.forEach((result, index) => {
      console.log("Resultado de tiktokAutomation: ", result);

      const udid = devices[index];

      if (result.status === "fulfilled") {
        const dataInteraction = result.value;

        //Emitimos el estado actualizando al backend
        socket.emit("schedule:tiktok:status:update", dataInteraction);
        console.log(`✅ [${udid}] Ejecución completada con éxito.`);
      } else {
        console.log("Ejecucion falló:", result.reason);
      }
    });

    console.log("🏁 Pruebas finalizadas en todos los dispositivos.");
  } catch (error) {
    console.error(
      "❌ Error al iniciar los servidores o ejecutar las pruebas:",
      error
    );
  } finally {
    // //Cerrar servidores Appium al final
    // if (appiumProcesses) {
    //   await stopAllServers(appiumProcesses);
    // }
    // process.exit(0);
  }
};

export { runOnMultipleDevices };
