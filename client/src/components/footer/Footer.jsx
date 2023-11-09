import './footer.css';
import facebook from '../../assets/footer/icons/facebook.png';
import instagram from '../../assets/footer/icons/instagram.png';
import gmail from '../../assets/footer/icons/gmail.png';
import React, { Suspense } from 'react'
const Map = React.lazy(() => import('./Map'));
function Footer() {

  return (

    <div className='bg-dark footerContainer d-flex justify-content-evenly flex-wrap h-auto align-items-center'>

      <div className='datosContainer text-white col-12 col-md-3'>
        <ul>

          <li>
            <i className='bi bi-house'></i> Ranelagh Club
          </li>

          <li>
            <i className='bi bi-geo-alt'></i> Av. Dr. A. Sabin 1751, B1886 Gran Buenos Aires,
            Provincia de Buenos Aires
          </li>

          <li>
            <i className='bi bi-phone'></i> +54 9 11 3838-6877
          </li>

        </ul>

      </div>
      <Suspense fallback={ < div className="spinner-grow text-success m-5"
        role="status" ></div> }>
        <Map />
      </Suspense>


      <div className='socialContainer col-12 col-md-3 m-1 d-flex justify-content-center'>

        <div className='m-2'>

          <a target='_blank' href='https://www.instagram.com/ranelagh.club/'>
            <img src={ instagram } alt='instagram' className='instagramImg' />
          </a>

        </div>

        <div className='m-2'>

          <a target='_blank' href='https://www.facebook.com/profile.php?id=100064211970969'>
            <img src={ facebook } alt='facebook' className='instagramImg' />
          </a>

        </div>

        <div className='m-2'>

          <a target='_blank' href='https://www.facebook.com/profile.php?id=100064211970969'>
            <img src={ gmail } alt='gmail' className='instagramImg' />
          </a>

        </div>

      </div>

    </div>

  );
}

export default Footer;
