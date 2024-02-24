

export const isReserveDateAvailable = (courtReserves, selectedDay, reserveData) => {

  const { initialTime, finalTime } = reserveData;


  let reserveDayData;

  switch (selectedDay) {
    case 0:
      reserveDayData = courtReserves.domingo;
      break;
    case 1:
      reserveDayData = courtReserves.lunes;
      break;
    case 2:
      reserveDayData = courtReserves.martes;
      break;
    case 3:
      reserveDayData = courtReserves.miercoles;
      break;
    case 4:
      reserveDayData = courtReserves.jueves;
      break;
    case 5:
      reserveDayData = courtReserves.viernes;
      break;
    case 6:
      reserveDayData = courtReserves.sabado;
      break;
  }

  //!Un turno se puede reservar en un rango máximo de una semana

  const reservedDates = reserveDayData?.some(
    (reserve) =>
      (initialTime === reserve.initialTime && finalTime === reserve.finalTime) ||
      initialTime === reserve.initialTime + 1800000 ||
      initialTime === reserve.initialTime - 1800000 ||
      initialTime === reserve.finalTime - 1800000 ||
      finalTime === initialTime + 1800000 ||
      finalTime < initialTime ||
      finalTime === reserve.finalTime + 1800000 ||
      finalTime === reserve.finalTime - 1800000 ||
      new Date(initialTime).getDate() < new Date().getDate() ||
      new Date(finalTime).getDate() < new Date().getDate() ||
      new Date(initialTime).getTime() <= Date.now() ||
      new Date(finalTime).getTime() <= Date.now()
  );

  return reservedDates;

}