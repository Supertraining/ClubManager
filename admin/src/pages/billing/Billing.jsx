import { useEffect, useState } from 'react';
import { useAxiosInstance } from '../../hooks/useAxiosInstance';
import { useClub } from '../../components/club/useClub';
import { API_BASE } from '../../lib/supabaseClient';

const base = API_BASE.replace(/\/$/, '') + '/billing';

export default function Billing() {
  const { club } = useClub();
  const api = useAxiosInstance(base);
  const [contract, setContract] = useState(undefined);
  const [failed, setFailed] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const options = { signal: controller.signal };
    async function load() {
      try {
        const { data: offer } = await api.get('/offer', options);
        const rows = offer.available ? (await api.get('/clubs', options)).data : [];
        if (!controller.signal.aborted) setContract(rows.find(row => row.slug === club.slug && row.paidThrough) ?? null);
      } catch {
        if (!controller.signal.aborted) setFailed(true);
      }
    }
    load();
    return () => controller.abort();
  }, [api, club.slug]);

  async function cancel() {
    setBusy(true);
    setFailed(false);
    try {
      const { data } = await api.post('/clubs/' + contract.clubId + '/cancel');
      setContract(data);
      setConfirming(false);
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className='container py-3'>
      <h1>Facturación</h1>
      {failed && <p role='alert'>No pudimos completar la operación. Volvé a intentarlo.</p>}
      {contract === undefined && !failed && <p role='status'>Consultando la contratación…</p>}
      {contract === null && <p>Tu cuenta no tiene una contratación disponible para este club.</p>}
      {contract && <>
        <p>Contratación simulada</p>
        <p>Período cubierto hasta el {new Intl.DateTimeFormat('es-AR', { dateStyle: 'long', timeZone: club.timezone })
          .format(new Date(contract.paidThrough))}.</p>
        {contract.status === 'cancelled' ? <p role='status'>Baja programada al vencimiento.</p> : confirming
          ? <button type='button' className='btn btn-outline-danger' disabled={busy} onClick={cancel}>Confirmar baja al vencimiento</button>
          : <button type='button' className='btn btn-outline-danger' onClick={() => setConfirming(true)}>Solicitar baja</button>}
      </>}
    </main>
  );
}
