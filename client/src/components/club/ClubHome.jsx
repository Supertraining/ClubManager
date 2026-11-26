import { Link } from 'react-router-dom';
import { useClub } from './useClub';
import './ClubHome.css';

export default function ClubHome() {
  const { club, courts } = useClub();
  return (
    <section className='club-home container-xl'>
      <header className='club-home__header'>
        <h1>{club.name}</h1>
        {club.contact.address && <p>{club.contact.address}</p>}
        <Link className='btn btn--primary btn--pill' to='/activities'>Ver actividades</Link>
      </header>
      {club.coverImageUrl && <img className='club-home__cover' src={club.coverImageUrl} alt={club.name} />}
      <section aria-labelledby='canchas'>
        <h2 id='canchas'>Canchas</h2>
        {courts.length === 0
          ? <p>El club todavía no publicó canchas.</p>
          : <ul className='club-home__courts'>{courts.map(court => (
            <li key={court.id}>
              <h3>{court.displayName}</h3>
              {court.surface && <p>{court.surface}</p>}
              <Link className='btn btn--ghost btn--pill' to={'/reserves?court=' + encodeURIComponent(court.slug)}>
                Ver horarios <span className='visually-hidden'>de {court.displayName}</span>
              </Link>
            </li>
          ))}</ul>}
      </section>
    </section>
  );
}
