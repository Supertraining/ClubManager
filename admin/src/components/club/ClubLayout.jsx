import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { API_BASE } from '../../lib/supabaseClient';
import { clubApi } from '../../lib/clubRoute';
import { ClubContext } from './useClub';

export default function ClubLayout({ children }) {
  const [result, setResult] = useState({ loading: true });

  useEffect(() => {
    const query = new AbortController();
    async function load() {
      try {
        const response = await fetch(clubApi(API_BASE), { signal: query.signal });
        if (!response.ok) throw new Error(response.status === 404 ? 'Club no encontrado.' : 'No pudimos cargar el club. Probá de nuevo.');
        const club = await response.json();
        if (query.signal.aborted) return;
        document.title = club.name + ' · Administración';
        setResult(club);
      } catch (error) {
        if (!query.signal.aborted) setResult({ error: error.message });
      }
    }
    load();
    return () => query.abort();
  }, []);

  if (result.loading) return <main className='container my-5' role='status'>Cargando el club…</main>;
  if (result.error) return <main className='container my-5'><h1>{result.error}</h1></main>;

  return <ClubContext.Provider value={{ club: result, setClub: setResult }}>{children}</ClubContext.Provider>;
}

ClubLayout.propTypes = { children: PropTypes.node.isRequired };
