import { getRandomDelay } from "./getRandomDelay.js";
import { scrollUpTikTok } from "./scrollUpTikTok.js";
import { scrollDownTikTok } from "./scrollDownTikTok.js";

//Funcion para las vistas
const generateViews = async (driver, numViews) => {
  for (let i = 0; i < numViews; i++) {
    console.log(`🔄 Scroll ${i + 1}...`);

    await driver.pause(getRandomDelay(100, 200));

    // Haciendo scroll hacia abajo
    await scrollUpTikTok(driver);
    await new Promise((resolve) =>
      setTimeout(resolve, getRandomDelay(100, 200))
    ); // Pausa

    // Haciendo scroll hacia arriba
    await scrollDownTikTok(driver);
    await new Promise((resolve) =>
      setTimeout(resolve, getRandomDelay(100, 200))
    ); // Pausa
  }
};

export { generateViews };
