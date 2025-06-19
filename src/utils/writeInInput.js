const writeInInput = async (driver, textToComment, selectorField) => {
  let input;
  try {
    console.log("Escribiendo en:", selectorField);
    input = await driver.$(selectorField);

    await input.waitForExist({ timeout: 15000 });

    await input.click(); // Enfoca el campo

    await input.setValue(textToComment);

    console.log(`✍ Escribiendo en el input: ${textToComment}`);
  } catch (error) {
    console.error("❌ Error al escribir en el input:", error.message);
    throw new Error("No se pudo escribir en el input: " + error.message);
  }
};

export { writeInInput };
