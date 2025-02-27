const scrollUpTikTok = async (driver) => {
  console.log("📜 Haciendo scroll hacia arriba ⬆ en TikTok...");

  await driver.performActions([
    {
      type: "pointer",
      id: "finger1",
      parameters: { pointerType: "touch" },
      actions: [
        { type: "pointerMove", duration: 0, x: 240, y: 640 },
        { type: "pointerDown", button: 0 },
        { type: "pause", duration: 100 }, // Pequeña pausa para simular el gesto real
        { type: "pointerMove", duration: 300, x: 240, y: 160 }, // Movimiento de scroll
        { type: "pointerUp", button: 0 },
      ],
    },
  ]);

  console.log("✅ Scroll hacia arriba realizado con éxito.");
};

export { scrollUpTikTok };
