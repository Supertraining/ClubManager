import './footer.css'
import whatsapp from '../../assets/footer/icons/whatsapp.png'
import instagram from '../../assets/footer/icons/instagram.png'

function Footer() {
  return (
    <div className='bg-dark footerContainer d-flex justify-content-evenly flex-wrap h-auto align-items-center'>

      <div className='datosContainer text-white col-12 col-md-3'>
        <ul>
          <li><i class="bi bi-house"></i> Ranelagh Club</li>
          <li><i class="bi bi-geo-alt"></i> Av. Dr. A. Sabin 1751, B1886 Gran Buenos Aires, Provincia de Buenos Aires</li>
          <li><i class="bi bi-phone"></i> +54 9 11 3838-6877</li>
        </ul>
      </div>

      <div className='m-1 p-1 col-12 col-md-3 d-flex justify-content-center'>
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3276.622582601951!2d-58.205617824993375!3d-34.79027546737337!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95a32890db70f05f%3A0xc241f1efa8411636!2sRanelagh%20Club!5e0!3m2!1sen!2sar!4v1684184520523!5m2!1sen!2sar" maxwidth="400" minwidth="300" height="300" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
      </div>

      <div className='socialContainer col-12 col-md-3 m-1 d-flex justify-content-center'>

        <div className='m-2' >
          <a href='https://wa.me/######'>
            <img src={whatsapp} alt='whatsapp' className='whatsappImg' />
          </a>
        </div>

        <div className='m-2'>
          <a href="">
            <img src={instagram} alt='instagram' className='instagramImg' />
          </a>
        </div>

      </div>

    </div>
  )
}

export default Footer