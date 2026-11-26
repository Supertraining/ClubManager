import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { API_BASE, supabase } from '../../lib/supabaseClient';
import './Subscribe.css';

const base = API_BASE.replace(/\/$/, '') + '/billing';
const adminOrigin = import.meta.env.VITE_ADMIN_URL;
const states = { pending: 'Pendiente de pago', active: 'Activo', past_due: 'Período vencido', cancelled: 'Cancelado', expired: 'Borrador vencido' };

function adminLoginUrl(slug) {
  if (!adminOrigin) return null;
  try {
    const url = new URL('/clubes/' + encodeURIComponent(slug) + '/login', adminOrigin);
    const local = ['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname);
    if (url.protocol === 'https:' || (local && url.protocol === 'http:')) return url.href;
  } catch {
    // An invalid panel origin leaves the link unavailable.
  }
  return null;
}

async function billing(path, { token, body, method = 'GET', signal } = {}) {
  const response = await fetch(base + path, {
    method,
    headers: {
      ...(token ? { Authorization: 'Bearer ' + token } : {}),
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    signal,
  });
  if (!response.ok) {
    const detail = response.status < 500 ? await response.text() : '';
    throw new Error(detail || 'No pudimos completar la operación. Probá de nuevo.');
  }
  return response.json();
}

export default function Subscribe() {
  const [offer, setOffer] = useState(null);
  const [session, setSession] = useState(undefined);
  const [contracts, setContracts] = useState([]);
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [busy, setBusy] = useState(false);
  const [cancelId, setCancelId] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [pendingPayment, setPendingPayment] = useState(null);
  const account = useForm();
  const draft = useForm({ defaultValues: { name: '' } });
  const token = session?.access_token;
  const userId = session?.user?.id;

  useEffect(() => {
    const controller = new AbortController();
    billing('/offer', { signal: controller.signal }).then(setOffer).catch(error => {
      if (!controller.signal.aborted) setFeedback({ error: true, text: error.message });
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => { controller.abort(); subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    if (token && offer?.available) billing('/clubs', { token, signal: controller.signal })
      .then(data => setContracts({ owner: userId, data }))
      .catch(error => { if (!controller.signal.aborted) setFeedback({ error: true, text: error.message }); });
    return () => controller.abort();
  }, [token, userId, offer?.available]);

  const run = useCallback(async (callback) => {
    setBusy(true);
    setFeedback(null);
    try {
      await callback();
    } catch (error) {
      setFeedback({ error: true, text: error.message });
    } finally {
      setBusy(false);
    }
  }, []);

  const signIn = ({ email, password }) => run(async () => {
    if (creatingAccount) {
      const result = await supabase.auth.signUp({
        email, password, options: { emailRedirectTo: window.location.origin + '/contratar' },
      });
      if (result.error) throw result.error;
      if (!result.data.session) setFeedback({ text: 'Revisá tu correo para confirmar la cuenta.' });
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    }
    account.reset();
  });

  const storeContract = contract => {
    setContracts(previous => ({
      owner: userId,
      data: [contract, ...(previous.owner === userId ? previous.data.filter(row => row.clubId !== contract.clubId) : [])],
    }));
  };

  const createDraft = ({ name }) => run(async () => {
    const signature = JSON.stringify([userId, name.trim()]);
    const requestId = attempt?.signature === signature ? attempt.id : crypto.randomUUID();
    setAttempt({ signature, id: requestId });
    const created = await billing('/clubs', { token, method: 'POST', body: { name, requestId } });
    storeContract(created);
    setAttempt(null);
    draft.reset();
  });

  async function copyLink(link) {
    try {
      await navigator.clipboard.writeText(link);
      setFeedback({ text: 'Enlace copiado.' });
    } catch {
      setFeedback({ error: true, text: 'Seleccioná la dirección y copiala manualmente.' });
    }
  }

  const change = (contract, action) => run(async () => {
    const paymentId = pendingPayment?.clubId === contract.clubId ? pendingPayment.id : crypto.randomUUID();
    if (action === 'simulate-payment') setPendingPayment({ clubId: contract.clubId, id: paymentId });
    const updated = await billing('/clubs/' + contract.clubId + '/' + action, {
      token, method: 'POST', body: action === 'simulate-payment' ? { paymentId } : {},
    });
    storeContract(updated);
    if (action === 'simulate-payment') setPendingPayment(null);
    setCancelId(null);
  });

  const current = contracts.owner === userId ? contracts.data : [];
  const money = (amountMinor, currency) => new Intl.NumberFormat('es-AR', { style: 'currency', currency }).format(amountMinor / 100);
  return (
    <main className='subscribe container-xl'>
      <a href='/'>ClubManager</a>
      <h1>Contratá ClubManager</h1>
      {feedback && <p role={feedback.error ? 'alert' : 'status'}>{feedback.text}</p>}
      {!offer && !feedback && <p role='status'>Cargando la oferta…</p>}
      {offer?.available === false && <p>La contratación todavía no está disponible.</p>}
      {offer?.available && <>
        <p>Oferta de prueba de {money(offer.amountMinor, offer.currency)} al mes. Los pagos de esta demo son simulados.</p>
        {session === undefined ? <p role='status'>Comprobando la sesión…</p> : !session
          ? <form className='subscribe__form' onSubmit={account.handleSubmit(signIn)}>
            <h2>{creatingAccount ? 'Creá tu cuenta' : 'Iniciá sesión'}</h2>
            <label>Correo<input className='input' type='email' required autoComplete='email' {...account.register('email')} /></label>
            <label>Contraseña<input className='input' type='password' required minLength={6}
              autoComplete={creatingAccount ? 'new-password' : 'current-password'} {...account.register('password')} /></label>
            <button className='btn btn--primary' disabled={busy}>{creatingAccount ? 'Crear cuenta' : 'Ingresar'}</button>
            <button className='btn btn--ghost' type='button' onClick={() => setCreatingAccount(!creatingAccount)}>
              {creatingAccount ? 'Ya tengo cuenta' : 'Crear una cuenta'}
            </button>
          </form>
          : <>
            <button className='btn btn--ghost' type='button' disabled={busy}
              onClick={() => run(async () => { const { error } = await supabase.auth.signOut(); if (error) throw error; })}>Cerrar sesión</button>
            <form className='subscribe__form' onSubmit={draft.handleSubmit(createDraft)}>
              <h2>Creá tu club</h2>
              <label>Nombre del club
                <input className='input' required maxLength={100} {...draft.register('name')} />
              </label>
              <p>Vamos a crear el enlace de tu club al guardar.</p>
              <button className='btn btn--primary' disabled={busy}>Guardar borrador</button>
            </form>
            {current.map(contract => (
              <section className='subscribe__form' key={contract.clubId}>
                <h2>{contract.name}</h2>
                <p>{states[contract.status]} · {money(contract.amountMinor, contract.currency)} al mes</p>
                {contract.paidThrough && <p>Vigente hasta el {new Intl.DateTimeFormat('es-AR', { dateStyle: 'long', timeZone: 'America/Argentina/Buenos_Aires' }).format(new Date(contract.paidThrough))}.</p>}
                {contract.status !== 'expired' && (contract.status !== 'cancelled' || contract.paidThrough) && (
                  <div className='subscribe__link-field'>
                    <strong>Enlace de tu club</strong>
                    <p>{window.location.origin}/clubes/{contract.slug}</p>
                    <p>{contract.paidThrough ? 'Compartí este enlace con tus socios.' : 'Vas a poder compartirlo con tus socios cuando actives el club.'}</p>
                    <button className='btn btn--ghost' type='button'
                      onClick={() => copyLink(window.location.origin + '/clubes/' + contract.slug)}>Copiar enlace</button>
                  </div>
                )}
                {contract.paidThrough && (
                  <div className='subscribe__club-actions'>
                    {adminLoginUrl(contract.slug) && (
                      <a className='btn btn--primary' href={adminLoginUrl(contract.slug)}>Abrir panel de administración</a>
                    )}
                    <a className='btn btn--ghost' href={'/clubes/' + contract.slug}>Abrir portal del club</a>
                  </div>
                )}
                {!['cancelled', 'expired'].includes(contract.status) && <>
                  <button className='btn btn--primary' disabled={busy} type='button'
                    onClick={() => change(contract, contract.checkoutReady ? 'simulate-payment' : 'checkout')}>
                    {contract.checkoutReady ? (contract.paidThrough ? 'Simular renovación' : 'Simular primer pago') : 'Preparar pago de prueba'}
                  </button>
                  {cancelId === contract.clubId
                    ? <button className='btn btn--ghost' type='button' disabled={busy} onClick={() => change(contract, 'cancel')}>Confirmar baja al vencimiento</button>
                    : <button className='btn btn--ghost' type='button' disabled={busy} onClick={() => setCancelId(contract.clubId)}>Solicitar baja</button>}
                </>}
              </section>
            ))}
          </>}
      </>}
    </main>
  );
}
