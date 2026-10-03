import { useState } from 'react';
import ActivityCard from '../../components/activities/ActivityCard';
import './Activities.css';

import futbolInf from '../../assets/football/footballCourt.webp';
import kidsImg from '../../assets/home/child-roller-skates.webp';
import funcionalImg from '../../assets/home/functional.webp';
import paddleImg from '../../assets/paddle/paddle-min.webp';
import paletaImg from '../../assets/paleta/CanchaPaleta.webp';
import squashImg from '../../assets/squash/squash-min.webp';

const ACTIVITIES = [
  {
    id: 'futbol-infantil',
    title: 'Fútbol infantil',
    description: 'Escuelita para chicos de 4 a 12 años. Grupos por edad, con profe, los sábados a la mañana.',
    img: futbolInf,
    imgText: 'Fútbol infantil',
    profe: { name: 'Tomás Pereyra', avatar: 'T' },
    days: 'Sáb',
    hours: '10:00 – 12:00',
    court: 'Fútbol',
    targetCourt: 'futbol',
  },
  {
    id: 'patin',
    title: 'Patín',
    description: 'Iniciación y avanzado. Desde los 5 años. Lunes y miércoles en el SUM del club.',
    img: kidsImg,
    imgText: 'Patín',
    profe: { name: 'Lucía Méndez', avatar: 'L' },
    days: 'Lun y mié',
    hours: '17:30 – 19:00',
    court: 'SUM',
  },
  {
    id: 'funcional',
    title: 'Funcional',
    description: 'Para adultos que quieren moverse en serio. Mix de fuerza, cardio y movilidad.',
    img: funcionalImg,
    imgText: 'Funcional',
    profe: { name: 'Mariana Suárez', avatar: 'M' },
    days: 'Mar y jue',
    hours: '19:00 – 20:30',
    court: 'SUM',
  },
  {
    id: 'paddle-adultos',
    title: 'Paddle para adultos',
    description: 'Escuelita y grupos por nivel. Clases semanales con partidos.',
    img: paddleImg,
    imgText: 'Paddle',
    profe: { name: 'Diego Almirón', avatar: 'D' },
    days: 'Mar y jue',
    hours: '20:00 – 22:00',
    court: 'Paddle',
    targetCourt: 'paddle',
  },
  {
    id: 'squash',
    title: 'Squash',
    description: 'Para los que ya juegan o quieren empezar. Grupos reducidos.',
    img: squashImg,
    imgText: 'Squash',
    profe: { name: 'Federico Cano', avatar: 'F' },
    days: 'Vie',
    hours: '19:00 – 21:00',
    court: 'Squash',
    targetCourt: 'squash',
  },
  {
    id: 'paleta',
    title: 'Paleta',
    description: 'Frontón de pared rápida. Clases y turnos libres los fines de semana.',
    img: paletaImg,
    imgText: 'Paleta',
    profe: { name: 'Esteban Quiroga', avatar: 'E' },
    days: 'Sáb y dom',
    hours: '10:00 – 13:00',
    court: 'Paleta',
    targetCourt: 'paleta',
  },
];

const CATEGORIES = [
  { key: 'todas',    label: 'Todas' },
  { key: 'infantiles', label: 'Para chicos' },
  { key: 'adultos',  label: 'Para adultos' },
  { key: 'canchas',  label: 'En canchas' },
];

const filterByCategory = (a, cat) => {
  if (cat === 'todas') return true;
  if (cat === 'infantiles') return a.id === 'futbol-infantil' || a.id === 'patin';
  if (cat === 'adultos') return a.id === 'funcional' || a.id === 'paddle-adultos' || a.id === 'squash';
  if (cat === 'canchas') return Boolean(a.targetCourt);
  return true;
};

const Activities = () => {
  const [category, setCategory] = useState('todas');
  const filtered = ACTIVITIES.filter((a) => filterByCategory(a, category));

  return (
    <div className='activities-page'>
      <section className='activities-hero'>
        <div className='container-xl activities-hero__inner'>
          <span className='eyebrow eyebrow--inverse'>— Actividades</span>
          <h1 className='activities-hero__title'>
            La grilla completa<br />del club.
          </h1>
          <p className='activities-hero__sub'>
            Todas las actividades del Club Ranelagh, con días, horarios y el
            nombre del profe a cargo. Filtrá por categoría o reservá directo
            en la cancha que te interese.
          </p>
        </div>
      </section>

      <section className='container-xl activities-section'>
        <div className='activities-filters' role='tablist' aria-label='Filtrar por categoría'>
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              type='button'
              role='tab'
              aria-selected={category === c.key}
              className={`activities-filter${category === c.key ? ' activities-filter--active' : ''}`}
              onClick={() => setCategory(c.key)}>
              {c.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className='activities-empty'>
            <i className='bi bi-search' aria-hidden='true'></i>
            <p>No hay actividades en esta categoría por ahora.</p>
            <small>Probá con otra o volvé a &ldquo;Todas&rdquo;.</small>
          </div>
        ) : (
          <div className='activities-grid'>
            {filtered.map((a) => (
              <ActivityCard key={a.id} activity={a} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Activities;
