import { Link } from 'react-router-dom';
import './Home.css';

import CourtCard from '../../components/home/CourtCard';
import ActivityTeaserCard from '../../components/home/ActivityTeaserCard';

import futbolCourt from '../../assets/football/footballCourt.webp';
import paddleCourt from '../../assets/paddle/paddle-min.webp';
import paletaCourt from '../../assets/paleta/CanchaPaleta.webp';
import squashCourt from '../../assets/squash/squash-min.webp';
import kidsImg from '../../assets/home/child-roller-skates.webp';
import funcionalImg from '../../assets/home/functional.webp';
import futbolInfImg from '../../assets/football/footballCourt.webp';

const STATS = [
  { value: '4',    label: 'Canchas' },
  { value: '6+',   label: 'Actividades' },
  { value: '50+',  label: 'Años de historia' },
  { value: '500+', label: 'Socios activos' },
];

const HERO_BG = futbolCourt;

// Static court list. The real API is called on the Reserves page when
// the user actually wants to book — no need to hit the network for the
// home page where courts are only shown as a catalog.
const COURTS = [
  {
    name: 'futbol',
    displayName: 'Fútbol',
    surface: 'Césped sintético',
    image: futbolCourt,
    description: 'Césped sintético, arcos reglamentarios, vestuarios y luz LED. La cancha que pisa todo el barrio.',
    pills: ['Césped sintético', 'Luz LED', 'Vestuarios', 'Arcos reglamentarios'],
  },
  {
    name: 'paddle',
    displayName: 'Paddle',
    surface: 'Cristal',
    image: paddleCourt,
    description: 'Paredes de cristal, superficie de césped artificial y altura reglamentaria para partidos en serio.',
    pills: ['Cristal templado', 'Césped artificial', 'Indoor', '4 jugadores'],
  },
  {
    name: 'squash',
    displayName: 'Squash',
    surface: 'Cristal',
    image: squashCourt,
    description: 'Cancha de cristal templado, suelo de parquet y marcación profesional para juego de élite.',
    pills: ['Cristal templado', 'Parquet', 'Marcación profesional'],
  },
  {
    name: 'paleta',
    displayName: 'Paleta',
    surface: 'Pared rápida',
    image: paletaCourt,
    description: 'Frontón de pared rápida, vestuarios completos y horario extendido los fines de semana.',
    pills: ['Frontón', 'Vestuarios', 'Outdoor', 'Horario extendido'],
  },
];

const ACTIVITIES_TEASER = [
  {
    id: 'futbol-infantil',
    title: 'Fútbol infantil',
    desc: 'Escuelita para chicos de 4 a 12 años. Los sábados a la mañana, con profe.',
    img: futbolInfImg,
    profe: { name: 'Tomás', avatar: 'T' },
    days: 'Sáb',
  },
  {
    id: 'patin',
    title: 'Patín',
    desc: 'Iniciación y avanzado. Lunes y miércoles, en el SUM del club.',
    img: kidsImg,
    profe: { name: 'Lucía', avatar: 'L' },
    days: 'Lun y mié',
  },
  {
    id: 'funcional',
    title: 'Funcional',
    desc: 'Para adultos que quieren moverse en serio. Martes y jueves, 19 h.',
    img: funcionalImg,
    profe: { name: 'Mariana', avatar: 'M' },
    days: 'Mar y jue',
  },
];

const Home = () => {
  return (
    <div className='home'>
      {/* ============================== HERO ============================== */}
      <section
        className='hero'
        style={{ backgroundImage: `linear-gradient(rgba(15, 79, 63, 0.62), rgba(10, 56, 44, 0.78)), url(${HERO_BG})` }}
      >
        <div className='container-xl hero__inner'>
          <span className='hero__eyebrow'>— Temporada 2026 · Reservas online</span>
          <h1 className='hero__title'>
            Tu cancha lista en <span className='hero__accent'>dos pasos.</span>
          </h1>
          <p className='hero__sub'>
            Reservá fútbol, paddle, squash y paleta en el Club Ranelagh.
            Sin llamados, sin planillas, sin quedarte sin tu horario.
          </p>
          <div className='hero__ctas'>
            <Link to='/reserves' className='btn btn--primary btn--lg btn--pill'>
              <i className='bi bi-calendar2-week' aria-hidden='true'></i>
              Reservar una cancha
            </Link>
            <a href='#canchas' className='btn btn--ghost-inverse btn--lg btn--pill'>
              Ver canchas
              <i className='bi bi-arrow-down' aria-hidden='true'></i>
            </a>
          </div>

          <div className='hero__stats'>
            {STATS.map((s) => (
              <div key={s.label} className='stat'>
                <div className='stat__value stat__value--inverse'>{s.value}</div>
                <div className='stat__label stat__label--inverse'>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== CANCHAS ============================== */}
      <section id='canchas' className='section section--cream'>
        <div className='container-xl'>
          <div className='section__head'>
            <span className='eyebrow eyebrow--brand'>— Canchas</span>
            <h2 className='section__title'>
              Elegí tu deporte,<br />elegí tu horario.
            </h2>
            <p className='section__sub'>
              Cuatro canchas, una sola app. Reservá por día y hora, mirá la
              disponibilidad de la semana y bloqueá tu turno en dos pasos.
            </p>
          </div>
          <div className='court-grid'>
            {COURTS.map((court) => (
              <CourtCard key={court.name} court={court} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================== EL CLUB ============================== */}
      <section id='el-club' className='section section--inverse'>
        <div className='container-xl'>
          <div className='el-club__row'>
            <div className='el-club__media'>
              <img src={kidsImg} alt='Chicos en el club' className='el-club__photo' />
            </div>
            <div className='el-club__copy'>
              <span className='eyebrow eyebrow--inverse'>— El club</span>
              <h2 className='section__title section__title--inverse'>
                Un club de barrio,<br />con la comodidad de hoy.
              </h2>
              <p className='section__sub section__sub--inverse'>
                El Club Ranelagh es parte de la vida del sur del Gran Buenos Aires
                desde hace más de cinco décadas. Canchas, actividades, familias,
                amigos, y ahora una app para que la gestión no te frene.
              </p>
              <ul className='el-club__points'>
                <li>
                  <i className='bi bi-check2' aria-hidden='true'></i>
                  <span>Reservas 24/7, en dos pasos</span>
                </li>
                <li>
                  <i className='bi bi-check2' aria-hidden='true'></i>
                  <span>Gestión de turnos fijos sin llamadas</span>
                </li>
                <li>
                  <i className='bi bi-check2' aria-hidden='true'></i>
                  <span>Toda la grilla de actividades en un solo lugar</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============================== ESTO SE VIENE EN EL CLUB ============================== */}
      <section id='actividades' className='section section--cream'>
        <div className='container-xl'>
          <div className='section__head'>
            <span className='eyebrow eyebrow--brand'>— Esto se viene en el club</span>
            <h2 className='section__title'>
              Actividades con la cara<br />de quien las da.
            </h2>
            <p className='section__sub'>
              La grilla completa del club, con días, horarios y el nombre del
              profe a cargo. Para que tu hijo ya sepa con quién va a estar.
            </p>
          </div>

          <div className='activities-teaser'>
            {ACTIVITIES_TEASER.map((a) => (
              <ActivityTeaserCard key={a.id} activity={a} />
            ))}
          </div>

          <div className='activities-teaser__cta'>
            <Link to='/activities' className='btn btn--brand btn--lg btn--pill'>
              Ver toda la grilla
              <i className='bi bi-arrow-right' aria-hidden='true'></i>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
