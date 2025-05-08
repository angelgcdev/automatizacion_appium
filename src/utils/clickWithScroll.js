import { scrollDown } from "./scrollDown.js";

const clickWithScroll = async (driver, selector) => {
  let scrollCount = 0;
  let element;
  let canScrollMore = true;

  while (canScrollMore) {
    try {
      console.log(`Selector usado: ${selector}`);
      element = await driver.$(selector);
      // Pausa corta antes de hacer click
      await driver.pause(600); //Tiempo recomendado calibrado

      // Usar mobile: clickGesture
      await driver.executeScript("mobile: clickGesture", [
        { element: element.elementId },
      ]);

      console.log(`✅ Click en el elemento:`, element);
      canScrollMore = false;
      return true; // Éxito
    } catch (error) {
      console.error("❌ Ningun elemento válido fue encontrado:", error);
    }

    console.log(`🔄 Elemento no encontrado. Scroll #${scrollCount + 1}`);

    await scrollDown(driver);

    scrollCount++;

    await driver.pause(3000); //Pausa para que cargue el contenido nuevo
  }
};

export { clickWithScroll };
