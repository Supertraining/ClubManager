import { CustomError } from './customError.Utils.js';

export function throwClubDbError(error) {
  const status = { '42501': 403, '22023': 400, '22007': 400, '22008': 400, '22P02': 400, '23503': 409, '23505': 409, '23P01': 409, P0002: 404, PT409: 409 }[error.code];
  if (!status) throw error;
  const messages = {
    '22P02': 'Ingresá un identificador válido.',
    '23503': 'El registro aún tiene datos relacionados.',
    '23505': 'Ya existe un registro con esos datos en este club.',
    '23P01': 'Ese horario ya está reservado.',
  };
  throw new CustomError(status, messages[error.code] ?? error.message);
}
