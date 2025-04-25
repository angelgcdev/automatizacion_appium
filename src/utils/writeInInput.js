const writeInInput = async (driver, textToComment, selectorField) => {
  try {
    const input = await driver.$(selectorField);
    await driver.waitUntil(async () => input.isExisting(), {
      timeout: 10000,
      timeoutMsg: "El input de búsqueda no apareció a tiempo.",
    });

    await driver.pause(2000); // Pausa la ejecución durante 2 segundos

    await input.click(); // Enfoca el campo

    await driver.pause(2000); // Pausa la ejecución durante 2 segundos

    await input.addValue(textToComment);

    await driver.pause(2000); // Pausa la ejecución durante 2 segundos

    console.log(`✍ Escribiendo en el input: ${textToComment}`);
    console.log("Texto final:", (await input.getText()) || "vacío");
  } catch (error) {
    console.error("❌ Error al escribir en el input:", error.message);
    throw new Error("No se pudo escribir en el input: " + error.message);
  }
};

export { writeInInput };
