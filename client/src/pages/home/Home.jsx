import HomeCarousel from '../../components/homeCarousel/HomeCarousel';
import HomeText from '../../components/homeText/HomeText';
import whatsapp from '../../assets/footer/icons/whatsapp.png';
import './home.css';

const Home = () => {
  return (
    <div>
      <HomeCarousel />
      <div className='whatsapp-div d-flex col-1'>
        <a aria-label="Chat on WhatsApp" target='_blank' href='https://wa.me/+541138386877'
          className='d-flex flex-column align-items-center text-decoration-none text-success'>
          <img src={whatsapp} alt='whatsapp' />
        </a>
      </div>
      <HomeText />
    </div>
  );
};

export default Home;
