import unidecode from 'unidecode';


export const createDateListArray = () => {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 27);

  const dateList = [];
  const dateListLc = [];
  const weekDaysList = [];

  for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    const day = d.toLocaleDateString('es-AR', { weekday: 'long' });
    const unaccentedDay = unidecode(day);
    const options = { weekday: 'long', day: 'numeric', month: 'numeric' };
    const weekDay = d.toLocaleDateString('es-AR', options);
    const unaccentedWeekday = unidecode(weekDay);
    const firstLetter = weekDay.charAt(0).toUpperCase();
    const capitalizedWeekday = firstLetter + weekDay.slice(1);

    dateList.push(capitalizedWeekday);
    dateListLc.push(unaccentedWeekday);
    weekDaysList.push(unaccentedDay);
  }

  return {
    dateList,
    dateListLc,
    weekDaysList
  }
}