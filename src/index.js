// 1. Librerías de Node.js

// 2. Librerías de terceros
import "dotenv/config";

// 3. Librerías internas absolutas

// 4. Imports relativos
import { iniciarHttpServer } from "./httpServer.js";
import { getSocket } from "./socketClient.js";
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
import { resetCancel, checkCancel, isCanceled } from "./cancelManager.js";
import { formatTime } from "./utils/formatTime.js";
import { commentModalSelectors as tiktokCommentModalSelectors } from "../src/pages/tiktok/commentModal.js";
import { killAdbChildProcesses } from "./utils/killAdbChildProcesses.js";

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
  // Objeto para guardar el historial de la interacción
  const history = {
    device_id: activeDevice.id,
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
    // Revisar cancelacion
    checkCancel();

    // 🚀 Conectar con Appium para controlar el dispositivo
    driver = await connectToAppium(udid, port);

    console.log(`✅ [${udid}] Conectado a Appium en puerto ${port}.`);

    // Revisar cancelacion
    checkCancel();

    // 🔗 Abrir la URL del video directamente en TikTok usando ADB(Android Debug Bridge)
    await openTiktokVideo(driver, scheduledTiktokInteractionData.video_url);
    history.video_url = scheduledTiktokInteractionData.video_url;

    await driver.pause(2000);

    // Revisar cancelacion
    checkCancel();

    // Obtener el username
    const username = await getUsernameTiktok(driver);
    if (username) {
      history.username = username;
    }

    // Revisar cancelacion
    checkCancel();

    // Ir al perfil de videos del usuario
    await goToProfileUserVideos(driver);

    // Revisar cancelacion
    checkCancel();

    //❤️'Me Gusta'
    if (scheduledTiktokInteractionData.liked) {
      wasClicked = await clickSimple(driver, tiktokVideoSelectors.likeButton);
      if (wasClicked) {
        history.liked = true;
      }
    }

    // Revisar cancelacion
    checkCancel();

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

    // Revisar cancelacion
    checkCancel();

    // 💬 Comentar
    if (
      scheduledTiktokInteractionData.comment &&
      scheduledTiktokInteractionData.comment.trim() !== ""
    ) {
      const wasCommented = await commentOnTiktokVideo({
        driver,
        textToComment: scheduledTiktokInteractionData.comment,
        commentButton: tiktokCommentModalSelectors.commentButton,
        commentInput: tiktokCommentModalSelectors.commentInput,
        commentCloseButton: tiktokCommentModalSelectors.commentCloseButton,
        commentPublicButton: tiktokCommentModalSelectors.commentPublicButton,
      });
      if (wasCommented) {
        history.commented = scheduledTiktokInteractionData.comment;
      }
    }

    // Revisar cancelacion
    checkCancel();

    // 👀 Vistas
    if (scheduledTiktokInteractionData.views_count > 0) {
      const { updatedDriver, success } = await generateViews(
        driver,
        scheduledTiktokInteractionData.views_count,
        udid,
        port,
        scheduledTiktokInteractionData.video_url
      );

      //Actualizar sesion de appium
      driver = updatedDriver;

      if (success) {
        history.total_views = scheduledTiktokInteractionData.views_count;
      }
    }

    // Revisar cancelacion
    checkCancel();

    return {
      activeDevice,
      status: "COMPLETADA",
      history,
      scheduledTiktokInteraction_id: scheduledTiktokInteractionData.id,
    };
  } catch (error) {
    console.log("Valor de canceled:", isCanceled());

    if (!isCanceled()) {
      // ⚠️ Capturar errores durante la automatización
      console.error(`❌ [${udid}] Error en Appium:`, error);

      return {
        activeDevice,
        status: "FALLIDA",
        history,
        scheduledTiktokInteraction_id: scheduledTiktokInteractionData.id,
        error: error.message,
      };
    }

    return {
      type: "success",
      message: "Ejecución cancelada por el usuario",
      cancelled: true,
      scheduledTiktokInteraction_id: scheduledTiktokInteractionData.id,
      status: "CANCELADO",
    };
  } finally {
    if (driver) {
      try {
        //✅ Cerrar la aplicación de Tiktok
        await driver.terminateApp("com.zhiliaoapp.musically");
        console.log("📱 Tiktok cerrado correctamente.");

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
  await killAdbChildProcesses();

  //Obtener la conexion Socket.IO
  const socket = getSocket();

  const { scheduledTiktokInteractionData, activeDevices } = data;

  //Tiempo de inicio
  const startTime = Date.now();

  //Tiempo total estimado
  const likedTime = scheduledTiktokInteractionData.liked ? 50 : 0;
  const savedTime = scheduledTiktokInteractionData.saved ? 50 : 0;
  const commentTime =
    scheduledTiktokInteractionData.comment &&
    scheduledTiktokInteractionData.comment.trim() !== ""
      ? 250
      : 0;
  const viewsTime =
    scheduledTiktokInteractionData.views_count > 0
      ? Number(scheduledTiktokInteractionData.views_count) * 1
      : 0;
  const extraViewsTime =
    scheduledTiktokInteractionData.views_count > 100
      ? Math.floor(Number(scheduledTiktokInteractionData.views_count) / 100) *
        150
      : 0;

  const estimatedTotal =
    50 +
    90 +
    30 +
    likedTime +
    savedTime +
    commentTime +
    viewsTime +
    extraViewsTime;

  //Emitir tiempo estimado de ejecucion
  const estimatedTime = formatTime(estimatedTotal);

  socket.emit("schedule:tiktok:estimated_time_all", {
    estimatedTime,
    interactionId: scheduledTiktokInteractionData.id,
  });

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

      if (!result.value.cancelled) {
        const udid = devices[index];

        if (result.status === "fulfilled") {
          const dataInteraction = result.value;

          //Emitimos el estado actualizando al backend
          socket.emit("schedule:tiktok:status:update", dataInteraction);
          console.log(`✅ [${udid}] Ejecución completada con éxito.`);
        } else {
          console.log("Ejecucion falló:", result.reason);
        }
      } else {
        console.log(result.value.message);
        socket.emit("notification:localServer", result.value);
      }
    });

    console.log("🏁 Pruebas finalizadas en todos los dispositivos.");
  } catch (error) {
    console.error(error);
  } finally {
    // //Cerrar servidores Appium al final
    // if (appiumProcesses) {
    //   await stopAllServers(appiumProcesses);
    // }
    // process.exit(0);

    //resetar el flag
    resetCancel();
  }
};

export { runOnMultipleDevices };
