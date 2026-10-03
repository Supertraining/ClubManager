import { Link, useNavigate } from 'react-router-dom';
import './NotFound.css';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className='notfound-page'>
      <div className='notfound-card'>
        <div className='notfound-card__code'>404</div>
        <h1 className='notfound-card__title'>Esa cancha no existe.</h1>
        <p className='notfound-card__sub'>
          La página que buscás no está o fue movida. Volvé al inicio y reservá tu turno.
        </p>
        <div className='notfound-card__ctas'>
          <Link to='/' className='btn btn--primary btn--lg btn--pill'>
            <i className='bi bi-house' aria-hidden='true'></i>
            Ir al inicio
          </Link>
          <button type='button' className='btn btn--ghost btn--lg btn--pill' onClick={() => navigate(-1)}>
            Volver
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
