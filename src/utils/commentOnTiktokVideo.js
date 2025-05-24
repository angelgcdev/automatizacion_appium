import { humanLikeDelay } from "./humanLikeDelay.js";
import { clickSimple } from "./clickSimple.js";
import { writeInInput } from "./writeInInput.js";
import { commentModalSelectors as tiktokCommentModalSelectors } from "../pages/tiktok/commentModal.js";
import { isCancelled } from "../cancelManager.js";

const commentOnTiktokVideo = async (driver, comment) => {
  if (isCancelled()) {
    throw new Error("Ejecución cancelada por el usuario");
  }

  try {
    //hacer click en el boton comentario
    await clickSimple(driver, tiktokCommentModalSelectors.commentButton);
    await humanLikeDelay();

    //hacer click en el input del comentario
    await clickSimple(driver, tiktokCommentModalSelectors.commentInput);
    await humanLikeDelay();

    // Escribir el comentario
    await writeInInput(
      driver,
      comment,
      tiktokCommentModalSelectors.commentInputField
    );
    await humanLikeDelay();

    // Publicar comentario
    await clickSimple(driver, tiktokCommentModalSelectors.commentPublicButton);
    await humanLikeDelay();

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
