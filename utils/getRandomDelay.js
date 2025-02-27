// Función para obtener un retraso aleatorio
const getRandomDelay = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export { getRandomDelay };
