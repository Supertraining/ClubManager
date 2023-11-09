import './HomeCarousel.css'
import patinaje from '../../assets/home/child-roller-skates.webp'
import gimnasia from '../../assets/home/child-gymnastics-1.webp'
import futbol from '../../assets/home/child-football-1.webp'
import functional from '../../assets/home/functional.webp'
import Carousel from 'react-bootstrap/Carousel';

function CarouselFadeExample() {
  return (
    <Carousel fade >

      <Carousel.Item>
        <img loading='lazy' className="d-block w-100 carousel-img" src={ patinaje } alt="First slide" />
      </Carousel.Item>

      <Carousel.Item>
        <img loading='lazy' className="d-block w-100" src={ gimnasia } alt="Second slide" />
      </Carousel.Item>

      <Carousel.Item>
        <img loading='lazy' className="d-block w-100" src={ futbol } alt="Third slide" />
      </Carousel.Item>

      <Carousel.Item>
        <img loading='lazy' className="d-block w-100" src={ functional } alt="Third slide" />
      </Carousel.Item>

    </Carousel>
  );
}

export default CarouselFadeExample;

