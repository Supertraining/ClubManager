import './HomeCarousel.css'
import patinaje from '../../assets/home/child-roller-skates.jpg'
import gimnasia from '../../assets/home/child-gymnastics-1.jpg'
import futbol from '../../assets/home/child-football-1.jpg'
import functional from '../../assets/home/functional.jpg'


const HomeCarousel = () => {

  return (

    <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">

      <ol className="carousel-indicators">
        <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"></li>
        <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
        <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
      </ol>

      <div className="carousel-inner">
        <div className="carousel-item active">
          <img className="d-block w-100" src={patinaje} alt="First slide" />
          <div className="carousel-caption d-none d-md-block">
            <h5 className='carousel-caption-text'>Patinaje Artístico</h5>
          </div>
        </div>

        <div className="carousel-item">
          <img className="d-block w-100" src={gimnasia} alt="Second slide" />
          <div className="carousel-caption d-none d-md-block">
            <h5 className='carousel-caption-text'>Gimnasia Artística</h5>
          </div>
        </div>

        <div className="carousel-item">
          <img className="d-block w-100" src={futbol} alt="Third slide" />
          <div className="carousel-caption d-none d-md-block">
            <h5 className='carousel-caption-text'>Fútbol Infantil</h5>
          </div>
        </div>

        <div className="carousel-item">
          <img className="d-block w-100" src={functional} alt="Third slide" />
          <div className="carousel-caption d-none d-md-block">
            <h5 className='carousel-caption-text'>Entrenamiento funcional</h5>
          </div>
        </div>

      </div>

      <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
      </a>
      <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
      </a>

    </div>

  )
}

export default HomeCarousel