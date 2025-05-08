import { getRandomDelay } from "./getRandomDelay.js";

//funcion para hacer retraso aleatorio
const humanLikeDelay = async () => {
  const delay = getRandomDelay(500, 3000);
  await new Promise((resolve) => setTimeout(resolve, delay));
};

export { humanLikeDelay };
