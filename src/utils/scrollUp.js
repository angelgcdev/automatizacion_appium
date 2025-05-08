const scrollUp = async (driver) => {
  console.log("📜 Haciendo scroll hacia arriba ⬆");

  try {
    // Obtener dimensiones de la pantalla
    const { width, height } = await driver.getWindowSize();

    // Definir el área de desplazamiento (80% de alto y ancho)
    const startX = width * 0.5; // centro horizontal
    const startY = height * 0.2; // parte superior del área
    const endY = height * 0.8; // parte inferior del área

    await driver.performActions([
      {
        type: "pointer",
        id: "finger1",
        parameters: { pointerType: "touch" },
        actions: [
          { type: "pointerMove", duration: 0, x: startX, y: startY }, // donde inicia el dedo
          { type: "pointerDown", button: 0 },
          { type: "pause", duration: 100 },
          { type: "pointerMove", duration: 100, x: startX, y: endY }, // hacia arriba
          { type: "pointerUp", button: 0 },
        ],
      },
    ]);

    await driver.releaseActions(); //Limpiar acciones
    console.log("✅ Scroll hacia arriba realizado con éxito.");
  } catch (error) {
    console.log("❌ Error al hacer scroll hacia arriba:", error.message);
    throw error;
  }
};

export { scrollUp };
