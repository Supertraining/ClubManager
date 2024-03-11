

export const isReserveDateAvailable = (courtReserves, selectedDay, initialTime, finalTime) => {


  let reserveData;

  switch (selectedDay) {
    case 0:
      reserveData = courtReserves.domingo;
      break;
    case 1:
      reserveData = courtReserves.lunes;
      break;
    case 2:
      reserveData = courtReserves.martes;
      break;
    case 3:
      reserveData = courtReserves.miercoles;
      break;
    case 4:
      reserveData = courtReserves.jueves;
      break;
    case 5:
      reserveData = courtReserves.viernes;
      break;
    case 6:
      reserveData = courtReserves.sabado;
      break;
  }

  //!Un turno se puede reservar en un rango máximo de una semana
  //!La duración maxima de un turno es de 1 hora 30 minutos

  const reservedDates =
    reserveData?.some(
      (reserve) =>
        initialTime === finalTime ||
        (initialTime === reserve.initialTime && finalTime === reserve.finalTime) ||
        initialTime === reserve.initialTime + 1800000 ||
        initialTime === reserve.initialTime - 1800000 ||
        initialTime === reserve.finalTime - 1800000 ||
        finalTime === initialTime + 1800000 ||
        finalTime < initialTime ||
        finalTime === reserve.finalTime + 1800000 ||
        finalTime === reserve.finalTime - 1800000 ||
        finalTime > initialTime + 5400000 ||
        new Date(initialTime).getDate() < new Date().getDate() ||
        new Date(finalTime).getDate() < new Date().getDate()
    ) ||
    new Date(initialTime).getTime() <= Date.now() ||
    new Date(finalTime).getTime() <= Date.now() ||
    new Date(initialTime).toLocaleTimeString() === '0:00:00' ||
    new Date(finalTime).toLocaleTimeString() === '0:00:00';

  const oneWeekFromNow = new Date();
  oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);
     
  return { reservedDates, oneWeekFromNow };

}