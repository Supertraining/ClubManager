La API va a chequear todos los días a las 23:50 de manera automática utilizando la librería node-cron si existen horarios permanentes, si es asi, creara una reserva idéntica con fecha de una semana a partir del dia de hoy. 

Cuando se elimina una reserva permanente desde admin, se elimina tanto la reserva del día como las que puedan existir a futuro o en el historial de reservas. 
