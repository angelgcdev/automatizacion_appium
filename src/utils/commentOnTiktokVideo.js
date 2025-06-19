import { humanLikeDelay } from "./humanLikeDelay.js";
import { clickSimple } from "./clickSimple.js";
import { writeInInput } from "./writeInInput.js";
import { commentModalSelectors as tiktokCommentModalSelectors } from "../pages/tiktok/commentModal.js";
import { checkCancel } from "../cancelManager.js";

const commentOnTiktokVideo = async (data) => {
  // Revisar cancelacion
  checkCancel();

  try {
    //hacer click en el boton comentario
    await clickSimple(data.driver, data.commentButton);

    // Revisar cancelacion
    checkCancel();

    //hacer click en el input de comentarios y escribir
    await writeInInput(data.driver, data.textToComment, data.commentInput);

    // Revisar cancelacion
    checkCancel();

    // Publicar comentario
    await clickSimple(data.driver, data.commentPublicButton);

    // Revisar cancelacion
    checkCancel();

    //Cerrar los comentarios
    await clickSimple(data.driver, data.commentCloseButton);

    return true;
  } catch (error) {
    console.log("❌ No se realizó el comentario en el video de tiktok...");
    return false;
  }
};

export { commentOnTiktokVideo };
