import { getRandomDelay } from "./getRandomDelay.js";

//funcion para hacer retraso aleatorio
const humanLikeDelay = async () => {
  const delay = getRandomDelay(500, 2000);
  await new Promise((resolve) => setTimeout(resolve, delay));
};

export { humanLikeDelay };
