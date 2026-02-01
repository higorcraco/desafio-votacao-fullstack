export const formatarData = (data: string) => {
  const date = new Date(data);

  if (isNaN(date.getTime())) {
    return "Data inválida";
  }

  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const intervaloTempoToString = (intervalo: number) => {
  const horas = Math.floor(intervalo / 3600000);
  const minutos = Math.floor((intervalo % 3600000) / 60000);
  const segundos = Math.floor((intervalo % 60000) / 1000);

  return horas > 0
    ? `${horas.toString().padStart(2, "0")}:${minutos.toString().padStart(2, "0")}:${segundos.toString().padStart(2, "0")}`
    : `${minutos.toString().padStart(2, "0")}:${segundos.toString().padStart(2, "0")}`;
};
