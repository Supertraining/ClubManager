import { Link, useSearchParams } from 'react-router-dom';
import CourtPage from '../../components/booking/CourtPage';
import { useClub } from '../../components/club/useClub';

export default function Reserves() {
  const { courts } = useClub();
  const [searchParams, setSearchParams] = useSearchParams();
  const slug = searchParams.get('court');
  const selected = slug ? courts.find(court => court.slug === slug) : courts[0];

  return (
    <>
      {courts.length > 0 && (
        <div className='container-xl py-3'>
          <label className='input-label' htmlFor='reservation-court'>Cancha</label>
          <select id='reservation-court' className='form-select w-auto' value={selected?.slug || ''} onChange={event => setSearchParams({ court: event.target.value })}>
            {!selected && <option value='' disabled>Elegí una cancha</option>}
            {courts.map(court => <option key={court.id} value={court.slug}>{court.displayName}</option>)}
          </select>
        </div>
      )}
      {selected
        ? <CourtPage key={selected.slug} court={selected} />
        : <section className='container-xl my-4'>
          <h1>{slug ? 'Cancha no encontrada' : 'Todavía no hay canchas publicadas'}</h1>
          <Link to='/'>Volvé al inicio</Link>
        </section>}
    </>
  );
}
