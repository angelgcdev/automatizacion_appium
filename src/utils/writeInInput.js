const writeInInput = async (driver, textToComment, selectorField) => {
  let input;
  try {
    console.log("Escribiendo en:", selectorField);
    input = await driver.$(selectorField);

    await driver.pause(600);

    await input.click(); // Enfoca el campo

    await driver.pause(600);

    await input.addValue(textToComment);

    await driver.pause(600);

    console.log(`✍ Escribiendo en el input: ${textToComment}`);
  } catch (error) {
    console.error("❌ Error al escribir en el input:", error.message);
    throw new Error("No se pudo escribir en el input: " + error.message);
  }
};

export { writeInInput };
