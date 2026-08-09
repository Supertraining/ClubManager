import { Link } from 'react-router-dom';
import functional from '../../assets/home/functional.webp';
import kids from '../../assets/home/child-roller-skates.webp';
import futbolCourt from '../../assets/football/footballCourt.webp';
import paddleCourt from '../../assets/paddle/paddle-min.webp';
import paletaCourt from '../../assets/paleta/CanchaPaleta.webp';
import { useCourtAPI } from '../../hooks';
import './Home.module.css';

const STATS = [
  { value: '4',   label: 'Canchas' },
  { value: '6+',  label: 'Actividades' },
  { value: '50+', label: 'Años de historia' },
  { value: '500+',label: 'Socios activos' },
];

const HERO_BG = 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=2000&q=80';

const FEATURE_PILLS = {
  futbol: ['Césped sintético', 'Luz LED', 'Vestuarios'],
  paddle: ['Cristal templado', '4 jugadores', 'Indoor'],
  squash: ['Cristal templado', '4 jugadores', 'Césped'],
  paleta: ['Single', 'Vestuarios', 'Outdoor'],
};

const CourtCard = ({ court }) => {
  const pills = FEATURE_PILLS[court.name] || [];
  return (
    <article className='court-card'>
      <div className='court-card__media'>
        <img src={court.image} alt={court.display_name || court.name} />
        <span className='court-card__badge'>
          <i className='bi bi-check-circle-fill me-1' aria-hidden='true'></i>
          {court.badge}
        </span>
      </div>
      <div className='court-card__body'>
        <h3 className='court-card__title'>{court.display_name || court.name}</h3>
        <p className='court-card__desc'>{court.description}</p>
        <ul className='court-card__pills'>
          {pills.map((p) => (
            <li key={p}>
              <i className='bi bi-check2' aria-hidden='true'></i> {p}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
};

const Home = () => {
  const { getAllCourts } = useCourtAPI();
  const [courts, setCourts] = React.useState([]);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const list = await getAllCourts();
      if (!cancelled) {
        // Map court.kind to a preset image (the courts table has no
        // image_url yet — once 05_seed.sql sets one, prefer that).
        const imageByKind = {
          futbol: futbolCourt,
          paddle: paddleCourt,
          squash: paddleCourt,
          paleta: paletaCourt,
        };
        const enriched = (list || []).map((c) => ({
          ...c,
          image: c.image_url || imageByKind[c.name] || futbolCourt,
          badge: `${(c.surface || '').toString().toUpperCase() || 'CANCHA'}`,
          description:
            c.description ||
            (c.name === 'futbol'
              ? 'Césped sintético, arcos reglamentarios, vestuarios y luz LED. La cancha que pisa todo el barrio.'
              : c.name === 'paddle'
              ? 'Paredes de cristal, superficie de césped artificial y altura reglamentaria para partidos serios.'
              : c.name === 'squash'
              ? 'Cancha de cristal templado, suelo de parquet y marcación profesional para juego de élite.'
              : 'Frontón de pared rápida, vestuarios completos y horario extendido los fines de semana.'),
        }));
        setCourts(enriched);
      }
    })();
    return () => { cancelled = true; };
  }, [getAllCourts]);

  return (
    <div>
      {/* ============================== HERO ============================== */}
      <section
        className='hero'
        style={{ backgroundImage: `linear-gradient(rgba(15,79,63,.55), rgba(15,79,63,.65)), url(${HERO_BG})` }}>
        <div className='container-xl hero__inner'>
          <span className='hero__eyebrow'>Temporada 2026 · Reservas online</span>
          <h1 className='hero__title'>
            Tu cancha lista en <span className='hero__accent'>dos pasos.</span>
          </h1>
          <p className='hero__sub'>
            Reservá fútbol, paddle, squash y paleta en el Club Ranelagh. Sin llamados,
            sin planillas, sin quedarte sin tu horario.
          </p>
          <div className='hero__ctas'>
            <Link to='/reserves' className='btn btn-lg hero__cta-primary'>
              <i className='bi bi-calendar2-week me-2' aria-hidden='true'></i>
              Reservar una cancha
            </Link>
            <a href='#canchas' className='btn btn-lg hero__cta-ghost'>
              Ver canchas
              <i className='bi bi-arrow-down ms-2' aria-hidden='true'></i>
            </a>
          </div>

          <div className='hero__stats'>
            {STATS.map((s) => (
              <div key={s.label} className='hero__stat'>
                <div className='hero__stat-value'>{s.value}</div>
                <div className='hero__stat-label'>{s.label}</div>
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
            <h2 className='section__title'>Elegí tu deporte,<br />elegí tu horario.</h2>
            <p className='section__sub'>
              Cuatro canchas, una sola app. Reservá por día y hora, mirá la
              disponibilidad de la semana y bloqueá tu turno.
            </p>
          </div>
          <div className='row g-4'>
            {courts.map((court) => (
              <div key={court.id || court.name} className='col-12 col-md-6 col-lg-6'>
                <CourtCard court={court} />
              </div>
            ))}
            {courts.length === 0 && (
              <p className='text-muted text-center py-5'>
                No tenemos canchas cargadas todavía. Pedile al admin que corra el seed de Supabase.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ============================== EL CLUB ============================== */}
      <section id='el-club' className='section section--inverse'>
        <div className='container-xl'>
          <div className='row align-items-center g-5'>
            <div className='col-12 col-lg-6'>
              <img src={kids} alt='Chicos jugando en el club' className='club-photo' />
            </div>
            <div className='col-12 col-lg-6'>
              <span className='eyebrow eyebrow--accent'>— El club</span>
              <h2 className='section__title section__title--inverse'>
                Un club de barrio, con la<br />comodidad de hoy.
              </h2>
              <p className='section__sub section__sub--inverse'>
                El Club Ranelagh es parte de la vida del sur del Gran Buenos Aires
                desde hace más de cinco décadas. Canchas, actividades, familias, amigos,
                y ahora una app para que la gestión no te frene.
              </p>
              <p className='section__sub section__sub--inverse'>
                Reservá cuando quieras, mirá la disponibilidad en vivo, y llegá
                directo a jugar.
              </p>
              <ul className='club-points'>
                <li><i className='bi bi-check2' aria-hidden='true'></i> Reservas 24/7</li>
                <li><i className='bi bi-check2' aria-hidden='true'></i> Gestión de turnos fijos</li>
                <li><i className='bi bi-check2' aria-hidden='true'></i> Notificaciones de tus actividades</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ============================== ACTIVIDADES ============================== */}
      <section id='actividades' className='section section--cream'>
        <div className='container-xl'>
          <div className='section__head'>
            <span className='eyebrow eyebrow--brand'>— Actividades</span>
            <h2 className='section__title'>Para chicos,<br />grandes y los del medio.</h2>
            <p className='section__sub'>
              Fútbol infantil, gimnasia, patín y funcional. La grilla completa del club,
              con días, horarios y profesores.
            </p>
          </div>
          <div className='activities-grid'>
            <img src={functional}   alt='Funcional' className='activities-grid__img' />
            <img src={kids}         alt='Patín infantil' className='activities-grid__img' />
            <img src={futbolCourt}  alt='Fútbol infantil' className='activities-grid__img' />
          </div>
        </div>
      </section>
    </div>
  );
};

// React import for useState/useEffect (kept as namespace import to avoid
// a top-level import in this mostly-presentational file).
import React from 'react';

export default Home;
