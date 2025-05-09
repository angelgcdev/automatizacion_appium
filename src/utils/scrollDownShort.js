const scrollDownShort = async (driver) => {
  console.log("📜 Haciendo scroll corto hacia abajo ⬇");

  try {
    // Obtener dimensiones de la pantalla
    const { width, height } = await driver.getWindowSize();

    // Definir el área de desplazamiento (80% de alto y ancho)
    const startX = width * 0.5; // centro horizontal
    const startY = height * 0.7; // parte inferior del área
    const endY = height * 0.4; // parte superior del área

    await driver.performActions([
      {
        type: "pointer",
        id: "finger1",
        parameters: { pointerType: "touch" },
        actions: [
          { type: "pointerMove", duration: 0, x: startX, y: startY }, // donde inicia el dedo
          { type: "pointerDown", button: 0 },
          { type: "pause", duration: 400 },
          { type: "pointerMove", duration: 400, x: startX, y: endY }, // hacia arriba
          { type: "pointerUp", button: 0 },
        ],
      },
    ]);

    await driver.releaseActions();
    console.log("✅ Scroll corto hacia abajo realizado con éxito.");
  } catch (error) {
    console.log("❌ Error al hacer scroll corto hacia abajo:", error.message);
    throw error;
  }
};

export { scrollDownShort };
