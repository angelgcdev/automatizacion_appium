import { videoPageSelectors as tiktokVideoSelectors } from "../pages/tiktok/videoPage.js";
import { checkCancel } from "../cancelManager.js";

const getUsernameTiktok = async (driver) => {
  try {
    const element = await driver.$(tiktokVideoSelectors.profileName);

    await element.waitForExist({ timeout: 15000 });

    const username = await element.getText();

    // Revisar cancelacion
    checkCancel();

    console.log("Username TikTok:", username);
    return username;
  } catch (error) {
    console.log("❌ Error al obtener el username en TikTok", error);
    return false;
  }
};

export { getUsernameTiktok };
