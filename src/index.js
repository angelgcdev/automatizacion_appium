// 1. Librerías de Node.js

// 2. Librerías de terceros

// 3. Librerías internas absolutas

// 4. Imports relativos
import { iniciarHttpServer } from "./httpServer.js";
import socket from "./socketClient.js";
import { iniciarTrackerDeDispositivos } from "./utils/device-tracker.js";
import { humanLikeDelay } from "./utils/humanLikeDelay.js"; //
import { generateViews } from "./utils/generateViews.js";
import { startAllServers, stopAllServers } from "./utils/startAppiumServers.js";
import { getConnectedDevices } from "./utils/getConnectedDevices.js";
import { writeInInput } from "./utils/writeInInput.js";
import { clickSimple } from "./utils/clickSimple.js";
import { clickWithScroll } from "./utils/clickWithScroll.js";
import { videoPageSelectors as tiktokVideoSelectors } from "./pages/tiktok/videoPage.js";
import { profilePageSelectors as tiktokProfileSelectors } from "./pages/tiktok/profilePage.js";
import { commentModalSelectors as tiktokCommentModalSelectors } from "./pages/tiktok/commentModal.js";
import { connectToAppium } from "./utils/connectToAppium.js";
import { openTiktokVideo } from "./utils/openTiktokVideo.js";
import { goToProfileUserVideos } from "./utils/goToProfileUserVideos.js";

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
  URL_VIDEO_TIKTOK,
  NUM_VIEWS,
  ITEMS = [],
  COMMENT = "",
  relation_id
) => {
  let driver;

  try {
    // 🚀 Conectar con Appium para controlar el dispositivo
    driver = await connectToAppium(udid, port);

    console.log(`✅ [${udid}] Conectado a Appium en puerto ${port}.`);
    await humanLikeDelay();

    // 🔗 Abrir la URL del video directamente en TikTok usando ADB(Android Debug Bridge)
    await openTiktokVideo(driver, URL_VIDEO_TIKTOK);

    // Ir al perfil de videos del usuario
    await goToProfileUserVideos(driver);

    //❤️'Me Gusta'
    if (ITEMS.includes("liked")) {
      await clickSimple(driver, tiktokVideoSelectors.likeButton);
    }

    await humanLikeDelay();

    // 💾 Guardar video
    if (ITEMS.includes("saved")) {
      await clickSimple(driver, tiktokVideoSelectors.saveVideoButton);
    }

    // 💬 Comentar
    if (COMMENT && COMMENT.trim() !== "") {
      //hacer click en el boton comentario
      await clickSimple(driver, tiktokCommentModalSelectors.commentButton);
      await humanLikeDelay();

      //hacer click en el input del comentario
      await clickSimple(driver, tiktokCommentModalSelectors.commentInput);
      await humanLikeDelay();

      // Escribir el comentario
      await writeInInput(
        driver,
        COMMENT,
        tiktokCommentModalSelectors.commentInputField
      );
      await humanLikeDelay();

      // Publicar comentario
      await clickSimple(
        driver,
        tiktokCommentModalSelectors.commentPublicButton
      );
      await humanLikeDelay();

      //Cerrar los comentarios
      await clickSimple(driver, tiktokCommentModalSelectors.commentCloseButton);
      await humanLikeDelay();
    }

    await humanLikeDelay();

    // 👀 Vistas
    if (NUM_VIEWS > 0) {
      await generateViews(driver, NUM_VIEWS, udid, port, URL_VIDEO_TIKTOK);
    }

    await humanLikeDelay();

    return { relation_id, status: "COMPLETADA" };
  } catch (error) {
    // ⚠️ Capturar errores durante la automatización
    console.error(`❌ [${udid}] Error en Appium:`, error);
    return { relation_id, status: "FALLIDA", error: error.message };
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
  }
};

/**
 * 🔁 Ejecutar en múltiples dispositivos
 */
const runOnMultipleDevices = async (data) => {
  const { video_url, views_count, items, comment, idsRelations } = data;

  // Para almacenar procesos de appium con los puertos
  let appiumProcesses;

  try {
    // 🔌 Obtener todos los dispositivos android conectados
    const devices = await getConnectedDevices();
    if (devices.length === 0) {
      console.log("🚨 No se encontraron dispositivos conectados.");
      return;
    }

    // 🔧 Iniciar un servidor Appium por cada dispositivo
    console.log("⏳ Iniciando servidores de Appium...");
    const { startedPorts, appiumProcesses: processes } = await startAllServers(
      devices.length
    );
    appiumProcesses = processes;
    console.log("✅ Todos los servidores de Appium iniciados.");

    // ⚙️ Preparar tareas de automatización por dispositivo
    const automationTasks = devices.map((udid, index) => {
      const relation = idsRelations.find((relation) => relation.udid === udid);
      return tiktokAutomatizacion(
        udid,
        startedPorts[index],
        video_url,
        views_count,
        items,
        comment,
        relation?.id // Este es el id del registro en la tabla device_scheduled_tiktok_interaction
      );
    });

    console.log(
      `🚀 Ejecutando pruebas en ${automationTasks.length} dispositivos...`
    );

    // 🧪 Ejecutar todas las automatizaciones en paralelo
    const results = await Promise.allSettled(automationTasks);

    // 📊 Mostrar el resultado de cada ejecución
    results.forEach((result, index) => {
      const udid = devices[index];
      if (result.status === "fulfilled") {
        const { relation_id, status } = result.value;

        //Emitimos el estado actualizando al backend
        socket.emit("schedule:tiktok:status:update", {
          id: relation_id,
          status,
        });
        console.log(`✅ [${udid}] Ejecución completada con éxito.`);
      } else {
        const { relation_id } = result.reason; // En caso de fallo, seguimos pasando el relation_id
        console.error(`❌ [${relation_id}] Falló con error:`, result.reason);

        //Emitimos el estado de fallo al backend
        socket.emit("schedule:tiktok:status:update", {
          id: relation_id,
          status: "FALLIDA",
        });
      }
    });

    console.log("🏁 Pruebas finalizadas en todos los dispositivos.");
  } catch (error) {
    console.error(
      "❌ Error al iniciar los servidores o ejecutar las pruebas:",
      error
    );
  } finally {
    //Cerrar servidores Appium al final
    if (appiumProcesses) {
      await stopAllServers(appiumProcesses);
    }
    // process.exit(0);
  }
};

// Escuchar evento del backend para iniciar la automatización
socket.on("schedule:tiktok:execute", async (data) => {
  console.log(
    "📥 Orden recibida: Iniciar automatización en múltiples dispositivos.",
    data
  );

  socket.emit("schedule:tiktok:status:started", "EN_PROGRESO");

  await runOnMultipleDevices(data);
});

iniciarTrackerDeDispositivos();
