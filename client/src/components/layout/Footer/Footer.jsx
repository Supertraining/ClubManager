import { Link } from 'react-router-dom';
import Logo from '../../ui/Logo/Logo';
import facebook from '../../../assets/footer/icons/facebook.png';
import instagram from '../../../assets/footer/icons/instagram.png';
import whatsapp from '../../../assets/footer/icons/whatsapp.png';
import gmail from '../../../assets/footer/icons/gmail.png';
import './Footer.module.css';

const HOURS = [
  { day: 'Lunes a viernes',  range: '08:00 – 23:00' },
  { day: 'Sábados',          range: '09:00 – 00:00' },
  { day: 'Domingos',         range: '09:00 – 20:00' },
];

const SocialIcon = ({ href, src, alt }) => (
  <a href={href} target='_blank' rel='noreferrer' className='footer__social'>
    <img src={src} alt={alt} />
  </a>
);

const Footer = () => {
  return (
    <footer className='footer'>
      <div className='cta-band'>
        <div className='container-xl py-5 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-4'>
          <div>
            <span className='cta-band__eyebrow'>— ¿Listo para jugar?</span>
            <h2 className='cta-band__title'>Reservá tu cancha en dos pasos.</h2>
            <p className='cta-band__sub'>Sin llamados, sin planillas. Elegí día, horario y cancha desde la app.</p>
          </div>
          <Link to='/reserves' className='btn btn-lg footer__cta-primary'>
            <i className='bi bi-calendar2-week me-1' aria-hidden='true'></i>
            Reservar ahora
          </Link>
        </div>
      </div>

      <div className='footer__band'>
        <div className='container-xl py-5'>
          <div className='row gy-4'>
            <div className='col-12 col-md-4 col-lg-3'>
              <Logo compact={false} />
              <p className='footer__about mt-3'>
                Club Ranelagh, más de 50 años de deporte y comunidad en Ranelagh, provincia de Buenos Aires.
              </p>
              <div className='d-flex gap-2 mt-3'>
                <SocialIcon href='https://instagram.com' src={instagram} alt='Instagram' />
                <SocialIcon href='https://facebook.com'  src={facebook}  alt='Facebook' />
                <SocialIcon href='https://wa.me/5491138386877' src={whatsapp} alt='WhatsApp' />
                <SocialIcon href='mailto:contacto@ranelaghclub.com' src={gmail} alt='Email' />
              </div>
            </div>

            <div className='col-6 col-md-4 col-lg-3'>
              <h3 className='footer__col-title'>Navegación</h3>
              <ul className='list-unstyled footer__links'>
                <li><a href='/#canchas'>Canchas</a></li>
                <li><a href='/#actividades'>Actividades</a></li>
                <li><a href='/#el-club'>El club</a></li>
                <li><Link to='/reserves'>Reservar</Link></li>
                <li><Link to='/register'>Registrarme</Link></li>
              </ul>
            </div>

            <div className='col-6 col-md-4 col-lg-3'>
              <h3 className='footer__col-title'>Horarios</h3>
              <ul className='list-unstyled footer__schedule'>
                {HOURS.map((h) => (
                  <li key={h.day}>
                    <span className='footer__schedule-day'>{h.day}</span>
                    <span className='footer__schedule-range'>{h.range}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className='col-12 col-md-12 col-lg-3'>
              <h3 className='footer__col-title'>Contacto</h3>
              <ul className='list-unstyled footer__contact'>
                <li>
                  <i className='bi bi-geo-alt me-2' aria-hidden='true'></i>
                  Av. Dr. A. Sabin 1751, B1886 Ranelagh, Buenos Aires
                </li>
                <li>
                  <i className='bi bi-telephone me-2' aria-hidden='true'></i>
                  <a href='tel:+5491138386877'>+54 9 11 3838-6877</a>
                </li>
                <li>
                  <i className='bi bi-envelope me-2' aria-hidden='true'></i>
                  <a href='mailto:contacto@ranelaghclub.com'>contacto@ranelaghclub.com</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className='footer__copy'>
          <div className='container-xl d-flex flex-column flex-md-row align-items-center justify-content-between py-3'>
            <span>© 2026 Club Ranelagh. Todos los derechos reservados.</span>
            <span className='d-flex gap-3'>
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
