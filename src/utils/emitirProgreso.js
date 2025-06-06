// Funcion para emitir el progreso
const emitirProgreso = (currentAction, startTime, estimatedTotal) => {
  const elapsedTime = (Date.now() - startTime) / 1000;
  const remainingTime = Math.max(estimatedTotal - elapsedTime, 0);

  console.log("Progreso", {
    currentAction,
    elapsedTime,
    estimatedTotal,
    remainingTime,
  });
};

export { emitirProgreso };
