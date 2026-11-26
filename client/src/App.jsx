import { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ClubLayout from './components/club/ClubLayout';
import ClubHome from './components/club/ClubHome';
import { useClub } from './components/club/useClub';
import { clubBase } from './lib/clubRoute';
import Navbar from './components/layout/Navbar/Navbar';
import Subscribe from './pages/subscribe/Subscribe';
import Footer from './components/layout/Footer/Footer';
import { supabase } from './lib/supabaseClient';
import { userStore } from './stores';
import { ACTIONS } from './stores/user/actions';

import Home from './pages/home/Home';
import Reserves from './pages/reserves/Reserves';
import Activities from './pages/activities/Activities';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Account from './pages/account/Account';
import NotFound from './pages/notFound/NotFound';

/**
 * React Router no scrollea al hash: cambiar a "/#canchas" navega, pero deja
 * la vista donde estaba. Esto corre después del render, cuando la sección
 * destino ya está en el DOM.
 *
 * Depende de pathname además de hash porque al venir de otra ruta el hash
 * puede no cambiar (pisar dos veces el mismo link de la barra).
 */
function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) return undefined;

    // Un frame: en navegación desde otra ruta la sección se monta en este
    // mismo commit, y hay que esperarla.
    const raf = requestAnimationFrame(() => {
      const target = document.getElementById(hash.slice(1));
      if (!target) return;
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    });

    return () => cancelAnimationFrame(raf);
  }, [pathname, hash]);

  return null;
}

function ClubHomeRoute() {
  const { club } = useClub();
  return club.slug === 'ranelagh' ? <Home /> : <ClubHome />;
}

function ClubAccountRoute() {
  const { access } = useClub();
  if (access === 'loading') return <p role='status'>Cargando tu perfil?</p>;
  if (access === 'error') return <p role='alert'>No pudimos cargar tu perfil. Recargá la página.</p>;
  return access === 'denied' ? <Navigate to='/register' replace /> : <Account />;
}

function App() {
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const { user: { user: currentUser }, setUser } = userStore.getState();
      const sessionUser = session?.user;

      if (!sessionUser) {
        if (currentUser) setUser({ type: ACTIONS.LOGOUT });
      } else if (currentUser?.id !== sessionUser.id) {
        setUser({
          type: ACTIONS.LOGIN_SUCCESS,
          payload: { id: sessionUser.id, email: sessionUser.email },
        });
      } else if (currentUser.email !== sessionUser.email) {
        setUser({
          type: ACTIONS.UPDATE_USER,
          payload: { ...currentUser, email: sessionUser.email },
        });
      }

      setAuthReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (window.location.pathname.replace(/\/$/, '') === '/contratar') return <Subscribe />;

  return (
    <Router basename={clubBase || '/'}>
      <ClubLayout authReady={authReady}>
      <ScrollToHash />
      <Navbar authReady={authReady} />
      <main>
        <Routes>
          <Route exact path='/' element={<ClubHomeRoute />} />
          <Route path='/reserves' element={<Reserves />} />
          <Route path='/activities' element={<Activities />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/account' element={authReady ? <ClubAccountRoute /> : null} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <ToastContainer
        position='top-right'
        autoClose={4000}
        hideProgressBar
        newestOnTop
        closeOnClick
        pauseOnHover
        theme='light'
      />
      </ClubLayout>
    </Router>
  );
}

export default App;
