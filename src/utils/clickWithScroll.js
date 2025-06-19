import { checkCancel } from "../cancelManager.js";
import { scrollDownShort } from "./scrollDownShort.js";

const clickWithScroll = async (driver, selector) => {
  let scrollCount = 0;
  let element;
  let canScrollMore = true;

  while (canScrollMore) {
    try {
      // Revisar cancelacion
      checkCancel();

      console.log(`Selector usado: ${selector}`);
      element = await driver.$(selector);
      // Pausa corta antes de hacer click
      await driver.pause(600); //Tiempo recomendado calibrado

      //hacer click
      await element.click();

      console.log(`✅ Click en el elemento:`, element);
      canScrollMore = false;
      return true; // Éxito
    } catch (error) {
      console.error("❌ Ningun elemento válido fue encontrado:", error);
    }

    // Revisar cancelacion
    checkCancel();

    console.log(`🔄 Elemento no encontrado. Scroll #${scrollCount + 1}`);

    await scrollDownShort(driver);

    scrollCount++;

    await driver.pause(3000); //Pausa para que cargue el contenido nuevo
  }
};

export { clickWithScroll };
