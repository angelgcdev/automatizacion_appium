import { humanLikeDelay } from "./humanLikeDelay.js";
import { clickOnAnyElementSelector } from "./clickOnAnyElementSelector.js";
import { SELECTORS } from "../config.js";

//Funcion para escribir en el cuadro de búsqueda
const writeInSearchInput = async (driver, textToSearch) => {
  try {
    //Localizar el input del buscador
    const searchInput = await driver.$(SELECTORS.searchInput);

    //Esperar a que el input exista
    await driver.waitUntil(async () => searchInput.isExisting(), {
      timeout: 10000, // Esperar hasta 10 segundos
      timeoutMsg: "El input de búsqueda no apareció a tiempo.",
    });

    await searchInput.setValue(textToSearch); // Escribir en el input
    console.log(`✍ Escribiendo en el cuadro de búsqueda: ${textToSearch}`);

    await humanLikeDelay(); // Retraso antes de hacer clic

    //Hacer click en el boton buscar
    await clickOnAnyElementSelector(driver, SELECTORS.searchButton2);
  } catch (error) {
    console.error(
      "❌ Error al escribir en el cuadro de búsqueda.",
      error.message
    );
    throw new Error(
      "No se pudo escribir en el cuadro de búsqueda: " + error.message
    );
  }
};

export { writeInSearchInput };
