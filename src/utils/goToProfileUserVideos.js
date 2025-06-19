import { humanLikeDelay } from "../utils/humanLikeDelay.js";
import { videoPageSelectors as tiktokVideoSelectors } from "../pages/tiktok/videoPage.js";
import { profilePageSelectors as tiktokProfileSelectors } from "../pages/tiktok/profilePage.js";
import { clickSimple } from "../utils/clickSimple.js";
import { clickWithScroll } from "../utils/clickWithScroll.js";
import { checkCancel } from "../cancelManager.js";

let wasClicked = false;

const goToProfileUserVideos = async (driver) => {
  // Hacer click en la cuenta del usuario tiktok
  await clickSimple(driver, tiktokVideoSelectors.profileName);

  //Contar la cantidad de videos del perfil del usuario
  const videos = await driver.$$(tiktokProfileSelectors.listaVideos);
  const cantidadVideos = videos.length;
  console.log(`Número de videos visibles: ${videos.length}`);

  if (cantidadVideos > 1) {
    // Revisar cancelacion
    checkCancel();

    //Hacer click en el boton "Visto justo ahora"
    wasClicked = await clickSimple(
      driver,
      tiktokProfileSelectors.vistoJustoAhoraBtn
    );
    await driver.pause(5000); // Pausa

    if (wasClicked) {
      // Revisar cancelacion
      checkCancel();

      //Click en el video que dice "Visto justo ahora"
      wasClicked = await clickSimple(
        driver,
        tiktokProfileSelectors.vistoJustoAhoraVideoIcon
      );
    }

    if (!wasClicked) {
      // Revisar cancelacion
      checkCancel();

      console.log("Ejecutando el fallback (plan B)");
      //Fallback

      // Buscar y Hacer click en el video que dice "Visto justo ahora"
      await clickWithScroll(
        driver,
        tiktokProfileSelectors.vistoJustoAhoraVideoIcon
      );
    }
  } else {
    // Ir atras
    await driver.back();

    // aplicar una funcion swipe swipeRefresh para refrescar la pagina feed del tiktok para que aparezca el carrusel de videos y no quede solo el video de la interaccion

    await driver.pause(3000);
  }
};

export { goToProfileUserVideos };
