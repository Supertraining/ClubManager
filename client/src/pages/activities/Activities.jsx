import ActivityCard from '../../components/activities/ActivityCard';
import { useClub } from '../../components/club/useClub';
import { useFetch } from '../../hooks/useFetch';
import './Activities.css';

export default function Activities() {
  const { club } = useClub();
  const { data, loading, error, reFetch } = useFetch('/activities/getAll');
  return (
    <div className='activities-page'>
      <section className='activities-hero'>
        <div className='container-xl activities-hero__inner'>
          <h1 className='activities-hero__title'>Actividades</h1>
          <p className='activities-hero__sub'>Consultá los grupos y horarios de {club.name}.</p>
        </div>
      </section>
      <section className='container-xl activities-section' aria-label='Actividades del club'>
        {loading ? <p role='status'>Cargando actividades…</p> : error
          ? <div role='alert'><p>No pudimos cargar las actividades.</p><button type='button' className='btn btn--ghost' onClick={reFetch}>Reintentar</button></div>
          : data.length === 0 ? <p>El club todavía no publicó actividades.</p>
          : <div className='activities-grid'>{data.map(row => (
            <ActivityCard key={row.id} activity={{
              id: row.id, title: row.name, description: row.description,
              img: row.image_url, imgText: row.image_alt,
              categories: row.category || [],
            }} />
          ))}</div>}
      </section>
    </div>
  );
}
