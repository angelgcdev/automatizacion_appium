function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  const parts = [];
  if (h > 0) parts.push(`${h} horas`);
  if (m > 0 || h > 0) parts.push(`${m} minutos`); // si hay horas, siempre muestra minutos
  parts.push(`${s} segundos`);

  return parts.join(" ");
}

console.log(formatTime(120));

export { formatTime };
