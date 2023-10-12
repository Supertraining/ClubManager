import './HomeCarousel.css'
import patinaje from '../../assets/home/child-roller-skates.webp'
import gimnasia from '../../assets/home/child-gymnastics-1.webp'
import futbol from '../../assets/home/child-football-1.webp'
import functional from '../../assets/home/functional.webp'


const HomeCarousel = () => {

  return (

    <div id="carouselExampleIndicators" className="carousel slide carousel-fade" data-bs-ride="carousel">

      <div className="carousel-inner">
        <div className="carousel-item active">
          <img loading='lazy' className="d-block w-100" src={patinaje} alt="First slide" />
          <div className="carousel-caption d-none d-md-block">
            <h5 className='carousel-caption-text'>Patinaje Artístico</h5>
          </div>
        </div>

        <div className="carousel-item">
          <img loading='lazy' className="d-block w-100" src={gimnasia} alt="Second slide" />
          <div className="carousel-caption d-none d-md-block">
            <h5 className='carousel-caption-text'>Gimnasia Artística</h5>
          </div>
        </div>

        <div className="carousel-item">
          <img loading='lazy' className="d-block w-100" src={futbol} alt="Third slide" />
          <div className="carousel-caption d-none d-md-block">
            <h5 className='carousel-caption-text'>Fútbol Infantil</h5>
          </div>
        </div>

        <div className="carousel-item">
          <img loading='lazy' className="d-block w-100" src={functional} alt="Third slide" />
          <div className="carousel-caption d-none d-md-block">
            <h5 className='carousel-caption-text'>Entrenamiento funcional</h5>
          </div>
        </div>

      </div>

    </div>

  )
}

export default HomeCarousel