const clickSimple = async (driver, selector) => {
  let element;
  try {
    console.log(`Selector usado: ${selector}`);
    element = await driver.$(selector);

    // Pausa corta antes de hacer click
    await driver.pause(600); //Tiempo recomendado calibrado

    await element.click();

    console.log(`✅ Click en el elemento:`, element);
    return true;
  } catch (error) {
    console.error("❌ Ningun elemento válido fue encontrado:", error);
    // throw new Error("No se pudo hacer click en ningun elemento.");
    return false;
  }
};

export { clickSimple };

//Click fallback
// // Usar mobile: clickGesture
// await driver.executeScript("mobile: clickGesture", [
//   { element: element.elementId },
// ]);
