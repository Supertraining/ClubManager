import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useFetch, useNotifications, useReservesAPI } from '../../hooks';
import { userStore as useUserStore } from '../../stores';
import { useClub } from '../club/useClub';
import { getCourt, getCourtHours, getSlotsForDay, toDateKey } from './courtConfig';
import { clubClock, clubDateKey, clubToday, findReservationForSlot, flattenReserves, getWeekDays, isSlotPast, slotEnd, toMinutes } from './helpers';
import DateStrip from './DateStrip';
import TimeTabs from './TimeTabs';
import SlotGrid from './SlotGrid';
import BookingPanel from './BookingPanel';
import BookingInstructions from './BookingInstructions';
import NextSlotFab from './NextSlotFab';
import './CourtPage.css';

const ranges = ['manana', 'tarde', 'noche'];

function availableWindows(hours, reserves, dateKey, minDuration, nowMinutes) {
  if (!hours) return [];
  const bookings = reserves.filter(row => row.date === dateKey)
    .map(row => ({ from: toMinutes(row.initialTime), to: toMinutes(row.finalTime) }))
    .sort((a, b) => a.from - b.from);
  const windows = [];
  let cursor = Math.max(hours.openMin, nowMinutes);
  for (const booking of bookings) {
    if (booking.from - cursor >= minDuration) windows.push({ from: cursor, to: booking.from });
    cursor = Math.max(cursor, booking.to);
  }
  if (hours.closeMin - cursor >= minDuration) windows.push({ from: cursor, to: hours.closeMin });
  return windows;
}

export default function CourtPage({ court }) {
  const { club, access } = useClub();
  const user = useUserStore(state => state.user.user);
  const member = Boolean(user) && access === 'member';
  const canBook = member && club.bookingEnabled;
  const navigate = useNavigate();
  const location = useLocation();
  const timeZone = club.timezone;
  const today = clubToday(timeZone);
  const durations = court.durationOptionsMin;
  const minDuration = durations[0];
  const artwork = club.slug === 'ranelagh' ? getCourt(court.slug) : null;
  const image = artwork?.image ?? club.coverImageUrl;
  const { createReserve } = useReservesAPI();
  const { notifySuccess } = useNotifications();
  const { data, loading, error, reFetch } = useFetch('/courts/' + court.slug + (member ? '' : '/availability'));

  const [date, setDate] = useState(today);
  const [preferredRange, setRange] = useState('manana');
  const [start, setStart] = useState(null);
  const [duration, setDuration] = useState(minDuration);
  const [submitting, setSubmitting] = useState(false);

  const reserves = useMemo(() => flattenReserves(data).map(row => {
    const startTime = row.startTime ?? row.initialTime;
    const endTime = row.endTime ?? row.finalTime;
    const startDate = clubDateKey(startTime, timeZone);
    return {
      date: startDate,
      initialTime: clubClock(startTime, timeZone),
      finalTime: clubDateKey(endTime, timeZone) > startDate ? '24:00' : clubClock(endTime, timeZone),
      user: row.user ?? (row.mine ? user?.id : null),
      permanent: row.permanent ?? false,
    };
  }), [data, timeZone, user?.id]);

  const dateKey = toDateKey(date);
  const hours = getCourtHours(court, date);
  const slots = getSlotsForDay(court, date, minDuration);
  const available = (slot, dayKey, close) => (
    toMinutes(slot) + duration <= close && !isSlotPast(slot, dayKey, timeZone)
      && !findReservationForSlot(reserves, dayKey, slot, duration)
  );
  const counts = Object.fromEntries(ranges.map(range => [range, slots[range].filter(slot => available(slot, dateKey, hours?.closeMin)).length]));
  const range = counts[preferredRange] ? preferredRange : ranges.find(item => counts[item] > 0) ?? preferredRange;
  const windows = availableWindows(hours, reserves, dateKey, minDuration,
    toDateKey(today) === dateKey ? (Math.floor(toMinutes(clubClock(new Date(), timeZone)) / 30) + 1) * 30 : 0);

  let nextSlot;
  if (canBook && !loading && !error) {
    for (const day of getWeekDays(today)) {
      const daySlots = getSlotsForDay(court, day, minDuration);
      const dayHours = getCourtHours(court, day);
      for (const dayRange of ranges) {
        const slot = daySlots[dayRange].find(item => available(item, toDateKey(day), dayHours.closeMin));
        if (slot) {
          nextSlot = { day, range: dayRange, slot };
          break;
        }
      }
      if (nextSlot) break;
    }
  }

  const nextSlotHint = nextSlot ? 'Próximo libre: ' + nextSlot.day.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric' }) + ' · ' + nextSlot.slot : null;
  const login = '/login?next=' + encodeURIComponent(location.pathname + location.search);
  const chooseDay = day => {
    setDate(day);
    setStart(null);
  };
  const useNextSlot = () => {
    if (!nextSlot) return;
    setDate(nextSlot.day);
    setRange(nextSlot.range);
    setStart(nextSlot.slot);
  };
  const confirm = async () => {
    if (!canBook || !start || submitting || !available(start, dateKey, hours?.closeMin)) return;
    setSubmitting(true);
    try {
      const result = await createReserve(court.slug, dateKey, start, slotEnd(start, duration));
      if (result !== null) {
        setStart(null);
        setDuration(minDuration);
        notifySuccess('Listo, te guardamos el turno.');
      }
      await reFetch();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='court-page'>
      <header className='court-page__hero' style={image ? { backgroundImage: 'linear-gradient(rgba(15, 79, 63, 0.55), rgba(10, 56, 44, 0.78)), url("' + image + '")' } : { backgroundColor: 'var(--c-brand)' }}>
        <div className='container-xl court-page__hero-inner'>
          <h1 className='court-page__title'>{court.displayName}</h1>
          {court.surface && <p className='court-page__sub'>{court.surface}</p>}
          {artwork?.pills && <ul className='court-page__pills'>{artwork.pills.map(item => <li className='tag tag--inverse' key={item}>{item}</li>)}</ul>}
        </div>
      </header>
      <div className='container-xl court-page__body'>
        <BookingInstructions />
        <div className='court-page__grid'>
          <section className='court-page__main'>
            <h2 className='court-page__section-title'>Elegí día y horario</h2>
            <DateStrip selected={date} today={today} onSelect={chooseDay} />
            {loading ? <p role='status'>Cargando horarios…</p> : error
              ? <p role='alert'>No pudimos consultar los horarios. <button type='button' className='btn btn--ghost' onClick={reFetch}>Reintentar</button></p>
              : <>
                <TimeTabs value={range} onChange={value => { setRange(value); setStart(null); }} counts={counts} />
                <div id='booking-slot-grid'>
                  <SlotGrid slots={slots[range]} selectedStart={start} getReservation={slot => findReservationForSlot(reserves, dateKey, slot, duration)}
                    onSelect={slot => canBook ? setStart(slot) : club.bookingEnabled && navigate(user ? '/register' : login)}
                    dateKey={dateKey} timeZone={timeZone} currentUserId={user?.id}
                    durationMin={duration} closeMin={hours?.closeMin} />
                </div>
              </>}
          </section>
          <div className='court-page__side'>
            {!club.bookingEnabled ? <p>El club pausó la toma de reservas.</p> : user && !canBook
              ? <Link to='/register' className='btn btn--primary btn--pill'>Sumarme al club</Link>
              : <BookingPanel date={date} startTime={start} courtDisplayName={court.displayName}
                onConfirm={confirm} isSubmitting={submitting || loading || Boolean(error)} isAuthenticated={canBook}
                nextSlotHint={nextSlotHint} onUseNextSlot={useNextSlot} durationMin={duration}
                durationOptions={durations} onDurationChange={setDuration} closeMin={hours?.closeMin}
                freeWindows={loading || error ? [] : windows} />}
          </div>
        </div>
      </div>
      <NextSlotFab hint={nextSlotHint} onClick={useNextSlot} visible={!start && Boolean(nextSlot)} />
    </div>
  );
}

CourtPage.propTypes = {
  court: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    surface: PropTypes.string,
    durationOptionsMin: PropTypes.arrayOf(PropTypes.number).isRequired,
  }).isRequired,
};
