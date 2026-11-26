import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { API_BASE } from '../../lib/supabaseClient';
import { clubApi } from '../../lib/clubRoute';
import { ClubContext } from './useClub';
import { useAxiosInstance } from '../../hooks/useAxiosInstance';
import { userStore as useUserStore } from '../../stores';

export default function ClubLayout({ children, authReady }) {
  const [result, setResult] = useState({ loading: true });
  const [membership, setMembership] = useState(null);
  const userId = useUserStore(state => state.user.user?.id);
  const reportedRole = useUserStore(state => state.user.user?.role);
  const axios = useAxiosInstance();

  useEffect(() => {
    const query = new AbortController();
    const origin = clubApi(API_BASE);
    const read = async path => {
      const response = await fetch(origin + path, { signal: query.signal });
      if (!response.ok) throw new Error(response.status === 404 ? 'Club no encontrado.' : 'No pudimos cargar el club. Probá de nuevo.');
      return response.json();
    };
    Promise.all([read(''), read('/courts')])
      .then(([club, courts]) => {
        if (query.signal.aborted) return;
        document.title = club.name;
        setResult({ club, courts });
      })
      .catch(error => { if (!query.signal.aborted) setResult({ error: error.message }); });
    return () => query.abort();
  }, []);

  useEffect(() => {
    if (!userId || !authReady) return undefined;
    const query = new AbortController();
    axios.get('/users/me', { signal: query.signal })
      .then(() => { if (!query.signal.aborted) setMembership({ userId, access: 'member' }); })
      .catch(error => {
        if (!query.signal.aborted) setMembership({ userId, access: error.response?.status === 403 ? 'denied' : 'error' });
      });
    return () => query.abort();
  }, [axios, userId, authReady, reportedRole]);

  if (result.loading) return <main className='container-xl my-5' role='status'>Cargando el club…</main>;
  if (result.error) return <main className='container-xl my-5'><h1>{result.error}</h1></main>;

  const access = !authReady ? 'loading' : !userId ? 'guest' : membership?.userId === userId ? membership.access : 'loading';
  return <ClubContext.Provider value={{ ...result, access }}>{children}</ClubContext.Provider>;
}

ClubLayout.propTypes = { children: PropTypes.node.isRequired, authReady: PropTypes.bool.isRequired };
