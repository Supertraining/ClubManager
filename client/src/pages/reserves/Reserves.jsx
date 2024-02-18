import Football from '../../components/courts/football/Football';
import Paleta from '../../components/courts/pelotaPaleta/Paleta';
import Paddle from '../../components/courts/paddle/Paddle';
import Squash from '../../components/courts/squash/Squash';
import { useNavigate, useLocation } from 'react-router-dom';
import { userStore } from '../../stores';
import { useEffect } from 'react';

const Reserves = () => {

  const {
    user: { user },
  } = userStore();

  const location = useLocation();
  const id = location.state?.court;
  const navigate = useNavigate();

  useEffect(() => {
    if (!id || !user) navigate('/');
  }, [user]);

  return (
    <>
      {id === 'futbol' && <Football court={id} />}
      {id === 'paleta' && <Paleta court={id} />}
      {id === 'paddle' && <Paddle court={id} />}
      {id === 'squash' && <Squash court={id} />}
    </>
  );
};

export default Reserves;
