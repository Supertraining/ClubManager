import './BookingInstructions.css';

const STEPS = [
  {
    n: 1,
    title: 'Elegí el día y la franja',
    desc: 'Pasá entre Mañana, Tarde y Noche. Cada slot dura 90 minutos.',
  },
  {
    n: 2,
    title: 'Tocá un horario libre',
    desc: 'Los slots en gris ya están reservados. Los tuyos se ven en naranja.',
  },
  {
    n: 3,
    title: 'Confirmá la reserva',
    desc: 'Tu lugar queda bloqueado al instante. Si no podés venir, avisanos.',
  },
];

const BookingInstructions = () => {
  return (
    <ol className='booking-instructions'>
      {STEPS.map((s) => (
        <li key={s.n} className='booking-instructions__item'>
          <span className='booking-instructions__num'>{s.n}</span>
          <div className='booking-instructions__copy'>
            <h4 className='booking-instructions__title'>{s.title}</h4>
            <p className='booking-instructions__desc'>{s.desc}</p>
          </div>
        </li>
      ))}
    </ol>
  );
};

export default BookingInstructions;
