import { randomUUID } from 'node:crypto';
import { STATUS_CODES } from 'node:http';
import { Logger } from '../utils/logger.js';

export default function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  const requestId = randomUUID();
  const status = error.statusCode ?? 500;
  res.set('X-Request-Id', requestId);

  if (status >= 500) {
    Logger.level().error('Request failed', { requestId, status, method: req.method, code: error.code });
    return res.status(status).send('Ocurrió un error. Volvé a intentarlo.');
  }

  return res.status(status).send(error.message || STATUS_CODES[status]);
}
