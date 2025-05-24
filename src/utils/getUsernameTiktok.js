import { humanLikeDelay } from "./humanLikeDelay.js";
import { videoPageSelectors as tiktokVideoSelectors } from "../pages/tiktok/videoPage.js";
import { isCancelled } from "../cancelManager.js";

const getUsernameTiktok = async (driver) => {
  try {
    const usernameElement = await driver.$(tiktokVideoSelectors.profileName);

    await driver.pause(600);

    const username = await usernameElement.getText();

    if (isCancelled()) {
      throw new Error("Ejecución cancelada por el usuario");
    }

    await humanLikeDelay();

    console.log("Username TikTok:", username);
    return username;
  } catch (error) {
    console.log("❌ Error al obtener el username de tiktok", error);
    return false;
  }
};

export { getUsernameTiktok };
