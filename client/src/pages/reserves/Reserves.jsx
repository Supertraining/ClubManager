import { useSearchParams } from 'react-router-dom';
import CourtPage from '../../components/booking/CourtPage';

const Reserves = () => {
  const [searchParams] = useSearchParams();
  const court = searchParams.get('court') || 'futbol';

  return <CourtPage court={court} />;
};

export default Reserves;
