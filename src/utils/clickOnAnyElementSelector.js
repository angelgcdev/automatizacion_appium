// import { humanLikeDelay } from "./humanLikeDelay.js";

// Función para hacer clic en el primer elemento disponible
const clickOnAnyElementSelector = async (driver, selectors) => {
  try {
    //Creamos un array de promesas
    const elementPromises = selectors.map(async (selector) => {
      const element = await driver.$(selector); //Busca el elemento
      return element;
    });

    //Esperar al primer elemento válido usando Promise.any
    const validElement = await Promise.any(elementPromises);

    // await humanLikeDelay();
    await driver.pause(2000); // Pausa la ejecución durante 2 segundos

    //Hacer click en el elemento encontrado
    await validElement.click();

    await driver.pause(2000); // Pausa la ejecución durante 2 segundos

    console.log(`✅ Click en el elemento: ${validElement.selector}`);
    return true; // Éxito
  } catch (error) {
    console.error("❌ Ningun elemento válido fue encontrado:", error);
    throw new Error("No se pudo hacer click en ningun elemento.");
  }
};

export { clickOnAnyElementSelector };
