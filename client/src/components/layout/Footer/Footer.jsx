import { Link } from 'react-router-dom';
import Logo from '../../ui/Logo/Logo';
import './Footer.css';

const HOURS = [
  { day: 'Lunes a viernes',  range: '08:00 – 23:00' },
  { day: 'Sábados',          range: '09:00 – 00:00' },
  { day: 'Domingos',         range: '09:00 – 20:00' },
];

const InstagramIcon = () => (
  <svg viewBox='0 0 24 24' width='18' height='18' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
    <rect x='3' y='3' width='18' height='18' rx='5' />
    <circle cx='12' cy='12' r='4' />
    <circle cx='17.5' cy='6.5' r='0.6' fill='currentColor' />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox='0 0 24 24' width='18' height='18' fill='currentColor' aria-hidden='true'>
    <path d='M13 22v-8h2.5l.5-3H13V9.2c0-.9.3-1.5 1.6-1.5H16V5.1c-.3 0-1.2-.1-2.2-.1-2.2 0-3.8 1.3-3.8 3.8V11H8v3h2v8h3z' />
  </svg>
);

const WhatsappIcon = () => (
  <svg viewBox='0 0 24 24' width='18' height='18' fill='currentColor' aria-hidden='true'>
    <path d='M20.5 3.5A11 11 0 0 0 3.7 17.3L2 22l4.8-1.6A11 11 0 1 0 20.5 3.5zM12 20a8 8 0 0 1-4.1-1.1l-.3-.2-2.8 1 .9-2.7-.2-.3a8 8 0 1 1 6.5 3.3zm4.5-5.7c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.6.1l-.7.9c-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-3.2-2.8c-.2-.4 0-.4.2-.6l.4-.4.3-.4.1-.4-.1-.4-.7-1.6c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.5 0 1.5 1.1 2.9 1.2 3.1.2.2 2.1 3.3 5.1 4.5 1.7.7 2.4.8 3.3.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.4-.2z' />
  </svg>
);

const MailIcon = () => (
  <svg viewBox='0 0 24 24' width='18' height='18' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
    <rect x='3' y='5' width='18' height='14' rx='2' />
    <path d='m3 7 9 6 9-6' />
  </svg>
);

const Footer = () => {
  return (
    <footer className='footer' id='contacto'>
      <div className='cta-band'>
        <div className='container-xl cta-band__inner'>
          <div className='cta-band__copy'>
            <span className='eyebrow eyebrow--inverse'>— ¿Listo para jugar?</span>
            <h2 className='cta-band__title'>Reservá tu cancha en dos pasos.</h2>
            <p className='cta-band__sub'>
              Sin llamados, sin planillas. Elegí día, horario y cancha desde la app.
            </p>
          </div>
          <Link to='/reserves' className='btn btn--primary btn--lg btn--pill cta-band__btn'>
            <i className='bi bi-calendar2-week' aria-hidden='true'></i>
            Reservar ahora
          </Link>
        </div>
      </div>

      <div className='footer__band'>
        <div className='container-xl footer__main'>
          <div className='footer__col footer__col--brand'>
            <div className='footer__brand'>
              <Logo compact={false} variant='inverse' />
            </div>
            <p className='footer__about'>
              Club Ranelagh, más de 50 años de deporte y comunidad en Ranelagh, provincia de Buenos Aires.
            </p>
            <div className='footer__social'>
              <a href='https://instagram.com/ranelagh.club' target='_blank' rel='noreferrer' aria-label='Instagram del Club Ranelagh' className='footer__social-link'>
                <InstagramIcon />
              </a>
              <a href='https://facebook.com/100064211970969' target='_blank' rel='noreferrer' aria-label='Facebook del Club Ranelagh' className='footer__social-link'>
                <FacebookIcon />
              </a>
              <a href='https://wa.me/5491138386877' target='_blank' rel='noreferrer' aria-label='WhatsApp del Club Ranelagh' className='footer__social-link'>
                <WhatsappIcon />
              </a>
              <a href='mailto:contacto@ranelaghclub.com' aria-label='Email del Club Ranelagh' className='footer__social-link'>
                <MailIcon />
              </a>
            </div>
          </div>

          <div className='footer__col'>
            <h3 className='footer__col-title'>Navegación</h3>
            <ul className='footer__links'>
              <li><a href='/#canchas'>Canchas</a></li>
              <li><a href='/#actividades'>Actividades</a></li>
              <li><a href='/#el-club'>El club</a></li>
              <li><Link to='/reserves'>Reservar</Link></li>
              <li><Link to='/register'>Registrarme</Link></li>
              <li><Link to='/account'>Mi cuenta</Link></li>
            </ul>
          </div>

          <div className='footer__col'>
            <h3 className='footer__col-title'>Horarios</h3>
            <ul className='footer__schedule'>
              {HOURS.map((h) => (
                <li key={h.day}>
                  <span className='footer__schedule-day'>{h.day}</span>
                  <span className='footer__schedule-range'>{h.range}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className='footer__col'>
            <h3 className='footer__col-title'>Contacto</h3>
            <ul className='footer__contact'>
              <li>
                <i className='bi bi-geo-alt' aria-hidden='true'></i>
                <span>Av. Dr. A. Sabin 1751, B1886 Ranelagh, Buenos Aires</span>
              </li>
              <li>
                <i className='bi bi-telephone' aria-hidden='true'></i>
                <a href='tel:+5491138386877'>+54 9 11 3838-6877</a>
              </li>
              <li>
                <i className='bi bi-envelope' aria-hidden='true'></i>
                <a href='mailto:contacto@ranelaghclub.com'>contacto@ranelaghclub.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className='footer__copy'>
          <div className='container-xl footer__copy-inner'>
            <span>© 2026 Club Ranelagh. Todos los derechos reservados.</span>
            <span className='footer__copy-links'>
              <a href='/terminos' className='footer__copy-link'>Términos</a>
              <span aria-hidden='true'>·</span>
              <a href='/privacidad' className='footer__copy-link'>Privacidad</a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
