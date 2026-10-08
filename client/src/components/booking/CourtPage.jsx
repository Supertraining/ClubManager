import { useEffect, useMemo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useFetch, useNotifications, useReservesAPI } from '../../hooks';
import { userStore } from '../../stores';

import {
  getCourt,
  getCourtHours,
  getSlotsForDay,
  toDateKey,
  DEFAULT_DURATION_MIN,
} from './courtConfig';
import {
  flattenReserves,
  findReservationForSlot,
  getWeekDays,
  isSameDay,
  isSlotPast,
  slotEnd,
} from './helpers';

import DateStrip from './DateStrip';
import TimeTabs from './TimeTabs';
import SlotGrid from './SlotGrid';
import BookingPanel from './BookingPanel';
import BookingInstructions from './BookingInstructions';
import NextSlotFab from './NextSlotFab';
import './CourtPage.css';

const RANGE_ORDER = ['manana', 'tarde', 'noche'];

const CourtPage = ({ court }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const courtFromUrl = searchParams.get('court');
  const courtName = court || courtFromUrl || 'futbol';

  const courtConfig = getCourt(courtName);
  const user = userStore((s) => s.user?.user);

  const { data: courtReserves, reFetch } = useFetch(`/courts/${courtName}`);
  const { createReserve } = useReservesAPI();
  const { notifySuccess, notifyWarning } = useNotifications();

  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [range, setRange] = useState('manana');
  const [startTime, setStartTime] = useState(null);
  const [durationMin, setDurationMin] = useState(DEFAULT_DURATION_MIN);
  const [submitting, setSubmitting] = useState(false);

  // Refetch on mount + on court change
  useEffect(() => {
    reFetch();
  }, [courtName, reFetch]);

  // Reset selection on court change
  useEffect(() => {
    setStartTime(null);
    setSelectedDate(new Date());
    setRange('manana');
    setDurationMin(DEFAULT_DURATION_MIN);
  }, [courtName]);

  // Derived: slots for the selected day
  const slotsByRange = useMemo(
    () => getSlotsForDay(courtName, selectedDate),
    [courtName, selectedDate],
  );

  // Derived: flat list of reservations
  const reserves = useMemo(() => flattenReserves(courtReserves), [courtReserves]);

  // Counts per range (bookable slots). Availability depends on the chosen
  // duration: a slot someone else holds for 1 h may still fit a different
  // start, so the counts are recomputed when the duration changes. Elapsed
  // slots are excluded too, otherwise the tab advertises a number of slots
  // that are rendered disabled.
  const rangeCounts = useMemo(() => {
    const dateKey = toDateKey(selectedDate);
    const counts = {};
    for (const r of RANGE_ORDER) {
      counts[r] = (slotsByRange[r] || []).filter((slot) => (
        !findReservationForSlot(reserves, dateKey, slot, durationMin)
        && !isSlotPast(slot, dateKey)
      )).length;
    }
    return counts;
  }, [slotsByRange, reserves, selectedDate, durationMin]);

  // Adjust range to first non-empty if current becomes empty
  useEffect(() => {
    if (rangeCounts[range] === 0) {
      const first = RANGE_ORDER.find((r) => rangeCounts[r] > 0);
      if (first) setRange(first);
    }
  }, [rangeCounts, range]);

  const slots = slotsByRange[range] || [];

  const getReservation = useCallback(
    (slot) => findReservationForSlot(reserves, toDateKey(selectedDate), slot, durationMin),
    [reserves, selectedDate, durationMin],
  );

  // Find next available slot across the next 7 days
  const nextSlot = useMemo(() => {
    const week = getWeekDays();
    for (const day of week) {
      const dayKey = toDateKey(day);
      const slots = getSlotsForDay(courtName, day);
      for (const r of RANGE_ORDER) {
        for (const s of slots[r] || []) {
          if (!findReservationForSlot(reserves, dayKey, s, durationMin)) {
            // Skip past slots of today
            if (isSameDay(day, new Date())) {
              const [h, m] = s.split(':').map(Number);
              const slotDate = new Date();
              slotDate.setHours(h, m, 0, 0);
              if (slotDate.getTime() <= Date.now()) continue;
            }
            return { day, dayKey, range: r, slot: s };
          }
        }
      }
    }
    return null;
  }, [courtName, reserves, durationMin]);

  const nextSlotHint = nextSlot
    ? `Próximo libre: ${nextSlot.day.toLocaleDateString('es-AR', { weekday: 'short' })} ${nextSlot.day.getDate()} · ${nextSlot.slot}`
    : null;

  const onUseNextSlot = useCallback(() => {
    if (!nextSlot) return;
    setSelectedDate(nextSlot.day);
    setRange(nextSlot.range);
    setStartTime(nextSlot.slot);
    // Scroll the grid into view
    setTimeout(() => {
      const el = document.getElementById('booking-slot-grid');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }, [nextSlot]);

  const handleConfirm = useCallback(async () => {
    if (!startTime || !user) {
      if (!user) navigate(`/login?next=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }
    setSubmitting(true);
    const end = slotEnd(startTime, durationMin);
    const dateKey = toDateKey(selectedDate);
    const result = await createReserve(courtName, dateKey, startTime, end);
    setSubmitting(false);
    if (result !== null) {
      notifySuccess('Listo, te guardamos el turno. Si no podés venir, avisanos así otro socio lo aprovecha.');
      setStartTime(null);
      reFetch();
    } else {
      notifyWarning('No se pudo reservar. Probá con otro horario.');
      reFetch();
    }
  }, [startTime, durationMin, user, createReserve, courtName, selectedDate, reFetch, navigate, notifySuccess, notifyWarning]);

  // Auth gate
  if (!user) {
    return (
      <div className='court-page court-page--gate'>
        <div className='court-page__hero' style={{ backgroundImage: `linear-gradient(rgba(15, 79, 63, 0.55), rgba(10, 56, 44, 0.7)), url(${courtConfig?.image})` }}>
          <div className='container-xl court-page__hero-inner'>
            <span className='eyebrow eyebrow--inverse'>— Cancha</span>
            <h1 className='court-page__title'>{courtConfig?.displayName || 'Cancha'}</h1>
            <p className='court-page__sub'>{courtConfig?.surface}</p>
            <ul className='court-page__pills'>
              {courtConfig?.pills?.map((p) => (
                <li key={p} className='tag tag--inverse'>{p}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className='container-xl court-page__body'>
          <BookingInstructions />

          <div className='court-page__grid'>
            <div className='court-page__main'>
              <h2 className='court-page__section-title'>Mirá la disponibilidad</h2>
              <p className='court-page__hint'>Iniciá sesión para reservar un turno.</p>

              <DateStrip selected={selectedDate} onSelect={setSelectedDate} />
              <TimeTabs
                value={range}
                onChange={setRange}
                counts={rangeCounts}
              />

              <div id='booking-slot-grid'>
                <SlotGrid
                  slots={slots}
                  selectedStart={startTime}
                  onSelect={() => navigate('/login?next=' + encodeURIComponent(window.location.pathname + window.location.search))}
                  getReservation={getReservation}
                  currentUserId={null}
                  durationMin={durationMin}
                  dateKey={toDateKey(selectedDate)}
                  closeMin={getCourtHours(courtName, selectedDate)?.closeMin ?? null}
                />
              </div>
            </div>

            <div className='court-page__side'>
              <BookingPanel
                date={selectedDate}
                startTime={null}
                courtDisplayName={courtConfig?.displayName || '—'}
                onConfirm={() => navigate('/login?next=' + encodeURIComponent(window.location.pathname + window.location.search))}
                isSubmitting={false}
                isAuthenticated={false}
                nextSlotHint={nextSlotHint}
                onUseNextSlot={onUseNextSlot}
                durationMin={durationMin}
                onDurationChange={setDurationMin}
                closeMin={getCourtHours(courtName, selectedDate)?.closeMin ?? null}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='court-page'>
      <div className='court-page__hero' style={{ backgroundImage: `linear-gradient(rgba(15, 79, 63, 0.55), rgba(10, 56, 44, 0.78)), url(${courtConfig?.image})` }}>
        <div className='container-xl court-page__hero-inner'>
          <span className='eyebrow eyebrow--inverse'>— Cancha</span>
          <h1 className='court-page__title'>{courtConfig?.displayName || 'Cancha'}</h1>
          <p className='court-page__sub'>{courtConfig?.surface}</p>
          <ul className='court-page__pills'>
            {courtConfig?.pills?.map((p) => (
              <li key={p} className='tag tag--inverse'>{p}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className='container-xl court-page__body'>
        <BookingInstructions />

        <div className='court-page__grid'>
          <div className='court-page__main'>
            <h2 className='court-page__section-title'>Elegí día y horario</h2>

            <DateStrip selected={selectedDate} onSelect={setSelectedDate} />

            <TimeTabs
              value={range}
              onChange={setRange}
              counts={rangeCounts}
            />

            <div id='booking-slot-grid'>
              <SlotGrid
                slots={slots}
                selectedStart={startTime}
                onSelect={setStartTime}
                getReservation={getReservation}
                currentUserId={user?.id}
                durationMin={durationMin}
                dateKey={toDateKey(selectedDate)}
                closeMin={getCourtHours(courtName, selectedDate)?.closeMin ?? null}
              />
            </div>
          </div>

          <div className='court-page__side'>
            <BookingPanel
              date={selectedDate}
              startTime={startTime}
              courtDisplayName={courtConfig?.displayName || '—'}
              onConfirm={handleConfirm}
              isSubmitting={submitting}
              isAuthenticated={Boolean(user)}
              nextSlotHint={nextSlotHint}
              onUseNextSlot={onUseNextSlot}
              durationMin={durationMin}
              onDurationChange={setDurationMin}
              closeMin={getCourtHours(courtName, selectedDate)?.closeMin ?? null}
            />
          </div>
        </div>
      </div>

      <NextSlotFab
        hint={nextSlotHint}
        onClick={onUseNextSlot}
        visible={!startTime && Boolean(nextSlot)}
      />
    </div>
  );
};

CourtPage.propTypes = {
  court: PropTypes.string,
};

export default CourtPage;
