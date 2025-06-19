import { checkCancel } from "../cancelManager.js";

const clickSimple = async (driver, selector) => {
  // Revisar cancelacion
  checkCancel();

  let element;
  try {
    console.log(`Selector usado: ${selector}`);
    element = await driver.$(selector);

    await element.waitForExist({ timeout: 15000 });

    // Revisar cancelacion
    checkCancel();

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
