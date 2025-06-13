import { humanLikeDelay } from "./humanLikeDelay.js";
import { clickSimple } from "./clickSimple.js";
import { writeInInput } from "./writeInInput.js";
import { commentModalSelectors as tiktokCommentModalSelectors } from "../pages/tiktok/commentModal.js";
import { checkCancel } from "../cancelManager.js";

const commentOnTiktokVideo = async (driver, comment) => {
  // Revisar cancelacion
  checkCancel();

  try {
    //hacer click en el boton comentario
    await clickSimple(driver, tiktokCommentModalSelectors.commentButton);
    await humanLikeDelay();

    // Revisar cancelacion
    checkCancel();

    //hacer click en el input del comentario
    await clickSimple(driver, tiktokCommentModalSelectors.commentInput);
    await humanLikeDelay();

    // Revisar cancelacion
    checkCancel();

    // Escribir el comentario
    await writeInInput(
      driver,
      comment,
      tiktokCommentModalSelectors.commentInputField
    );
    await humanLikeDelay();

    // Revisar cancelacion
    checkCancel();

    // Publicar comentario
    await clickSimple(driver, tiktokCommentModalSelectors.commentPublicButton);
    await humanLikeDelay();

    // Revisar cancelacion
    checkCancel();

    //Cerrar los comentarios
    await clickSimple(driver, tiktokCommentModalSelectors.commentCloseButton);
    await humanLikeDelay();

    return true;
  } catch (error) {
    console.log("❌ No se realizó el comentario en el video de tiktok...");
    return false;
  }
};

export { commentOnTiktokVideo };
