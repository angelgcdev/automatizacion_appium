const scrollDownTikTok = async (driver) => {
  const { height, width } = await driver.getWindowRect();

  console.log("📜 Haciendo scroll hacia abajo ⬇ en TikTok...");

  await driver.performActions([
    {
      type: "pointer",
      id: "finger1",
      parameters: { pointerType: "touch" },
      actions: [
        { type: "pointerMove", duration: 0, x: width / 2, y: height * 0.2 }, // Arriba
        { type: "pointerDown", button: 0 },
        { type: "pause", duration: 100 },
        { type: "pointerMove", duration: 300, x: width / 2, y: height * 0.8 }, // Abajo
        { type: "pointerUp", button: 0 },
      ],
    },
  ]);

  console.log("✅ Scroll hacia abajo realizado con éxito.");
};

export { scrollDownTikTok };
