import { Router } from 'express';
import { IsAuthenticated } from '../middlewares/isAuthenticated.js';
import { supabaseAdmin } from '../config/supabaseClient.js';
import { CustomError } from '../utils/customError.Utils.js';
import { throwClubDbError } from '../utils/clubDbError.js';

const router = Router();
const uuid = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;
const localHosts = new Set(['127.0.0.1', 'localhost', '[::1]']);
const localPeers = new Set(['127.0.0.1', '::ffff:127.0.0.1', '::1']);
const simulationOffer = { available: true, mode: 'simulation', code: 'local-monthly', amountMinor: 123400, currency: 'ARS', frequency: 'month' };

function simulationEnabled(req) {
  if (process.env.BILLING_LOCAL_SIMULATION !== '1' ||
      !['dev', 'test'].includes(process.env.NODE_ENV?.trim()) ||
      !localPeers.has(req.socket.remoteAddress)) return false;
  try {
    return localHosts.has(new URL(process.env.SUPABASE_URL).hostname);
  } catch {
    return false;
  }
}

function requireOffer(req, _res, next) {
  if (!simulationEnabled(req)) return next(new CustomError(503, 'La contratación todavía no está disponible.'));
  return next();
}

async function call(name, parameters) {
  const { data, error } = await supabaseAdmin.rpc(name, parameters);
  if (error) throwClubDbError(error);
  return data;
}

const handle = (operation) => (req, res, next) => {
  Promise.resolve().then(() => operation(req, res)).catch(next);
};

router.get('/offer', (req, res) => res.json(simulationEnabled(req) ? simulationOffer : { available: false }));
router.use(IsAuthenticated.checkJwt, requireOffer);

router.get('/clubs', handle(async (req, res) => {
  res.json(await call('billing_read', { p_owner: req.user.id }));
}));

router.post('/clubs', handle(async (req, res) => {
  const { name, requestId } = req.body ?? {};
  if (typeof name !== 'string' || name.trim().length < 1 || name.trim().length > 100 ||
      typeof requestId !== 'string' || !uuid.test(requestId)) {
    throw CustomError.badRequest('Revisá el nombre del club e intentá de nuevo.');
  }
  res.json(await call('billing_create_draft', {
    p_owner: req.user.id, p_request: requestId, p_name: name.trim(),
    p_amount: simulationOffer.amountMinor,
  }));
}));

router.param('clubId', (_req, _res, next, id) => {
  if (!uuid.test(id)) return next(CustomError.notFound('Contratación no encontrada.'));
  return next();
});

router.get('/clubs/:clubId', handle(async (req, res) => {
  const [contract] = await call('billing_read', { p_owner: req.user.id, p_club: req.params.clubId });
  if (!contract) throw CustomError.notFound('Contratación no encontrada.');
  res.json(contract);
}));

for (const [route, action] of [['checkout', 'checkout'], ['simulate-payment', 'simulate_payment'], ['cancel', 'cancel']]) {
  router.post('/clubs/:clubId/' + route, handle(async (req, res) => {
    const paymentId = req.body?.paymentId;
    if (action === 'simulate_payment' && (typeof paymentId !== 'string' || !uuid.test(paymentId))) {
      throw CustomError.badRequest('El intento de pago necesita una referencia válida.');
    }
    res.json(await call('billing_action', {
      p_owner: req.user.id, p_club: req.params.clubId, p_action: action,
      ...(action === 'simulate_payment' ? { p_payment: paymentId } : {}),
    }));
  }));
}

export default router;
