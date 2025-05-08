import { humanLikeDelay } from "./humanLikeDelay.js";

// Función para hacer clic en el primer elemento disponible
const clickOnAnyElementSelector = async (driver, selectors) => {
  //Creamos un array de promesas
  const elementPromises = selectors.map(async (selector) => {
    const element = await driver.$(selector); //Busca el elemento
    // const exists = await element.isExisting(); // Verificar si existe

    // if (exists) {
    //   return element; // Retorna el elemento si es valido
    // } else {
    //   throw new Error(`❌ Elemento no encontrado: ${selector}`);
    // }
    return element;
  });

  try {
    //Esperar al primer elemento válido usando Promise.any
    const validElement = await Promise.any(elementPromises);

    await humanLikeDelay();

    //Hacer click en el elemento encontrado
    await validElement.click();
    console.log(`✅ Click en el elemento: ${validElement.selector}`);
    return true; // Éxito
  } catch (error) {
    console.error("❌ Ningun elemento válido fue encontrado:", error);
    throw new Error("No se pudo hacer click en ningun elemento.");
  }
};

export { clickOnAnyElementSelector };
