import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { Events, Main, Menu, OldReservesDeleted, GetAllUsers, CreateActivity, GetAllActivities, UpdateActivities } from '../../components';
import { useNotifications, useAxiosInstance, useReservesAPI, useUserAPI, useCourtAPI } from '../../hooks';
import { userStore } from '../../stores';
import { supabase } from '../../lib/supabaseClient';
import { useClub } from '../../components/club/useClub';
import ClubCourts from '../../components/courts/ClubCourts';
import ClubSettings from '../clubSettings/ClubSettings';
import Billing from '../billing/Billing';
import InviteMember from '../clubSettings/InviteMember';
import './home.css';

const sections = {
  createUser: false, getAllUsers: false, events: false, deleteReserves: false,
  getAllCourts: false, activities: false, getAllActivities: false, main: false, settings: false,
};

export default function Home() {
  const { club } = useClub();
  const [access, setAccess] = useState('loading');
  const [menu, setMenu] = useState(sections);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUserSelected, setIsUserSelected] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const axios = useAxiosInstance();
  const navigate = useNavigate();
  const { getAllUsers, updateUserById, deleteUserById, closeSession } = useUserAPI();
  const { deleteReserve } = useReservesAPI();
  const { deleteOldReserves } = useCourtAPI();
  const { notifySuccess } = useNotifications();

  useEffect(() => {
    const query = new AbortController();
    const load = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (query.signal.aborted) return;
        if (!session) { setAccess('signed-out'); return; }
        const { data: profile } = await axios.get('/users/me', { signal: query.signal });
        if (query.signal.aborted) return;
        if (profile.isAdmin) {
          const { setUser, ACTIONS } = userStore.getState();
          setUser({ type: ACTIONS.LOGIN_SUCCESS, payload: profile });
        }
        setAccess(profile.isAdmin ? 'allowed' : 'denied');
      } catch (error) {
        if (!query.signal.aborted) setAccess(error.response?.status === 403 ? 'denied' : 'error');
      }
    };
    load();
    return () => query.abort();
  }, [axios]);

  const handleMenuClick = useCallback(option => setMenu({ ...sections, [option]: true }), []);
  const handleGetAllUsers = useCallback(async () => setAllUsers(await getAllUsers()), [getAllUsers]);
  const update = async (credentials, id) => {
    const profile = await updateUserById(id, credentials);
    setSelectedUser(current => current?.id === id ? profile : current);
    setAllUsers(users => users.map(user => user.id === id ? profile : user));
  };
  const suspend = async target => {
    if (!target?.id) return;
    try {
      await deleteUserById(target.id);
      notifySuccess('Socio dado de baja en el club.');
      setIsUserSelected(false);
      setConfirmDelete(false);
      await handleGetAllUsers();
      navigate('/getAllUsers');
    } catch {
      // The API hook displays the reason.
    }
  };

  if (access === 'loading') return <main className='container py-4' role='status'>Verificando tu acceso al club…</main>;
  if (access === 'signed-out') return <Navigate to='/login' replace />;
  if (access === 'denied') return <Navigate to='/failLogin' replace />;
  if (access === 'error') return <main className='container py-4' role='alert'>No pudimos verificar tu acceso. Recargá la página.</main>;

  return (
    <>
      <header className='container-fluid d-flex gap-3 align-items-center p-3'>
        <button className='navbar-toggler p-2' type='button' data-bs-toggle='offcanvas' data-bs-target='#offcanvasDarkNavbar'
          aria-controls='offcanvasDarkNavbar' aria-label='Abrir menú del club' style={{ minWidth: 44, minHeight: 44 }}>
          <i className='bi bi-menu-button-wide fs-3 text-success' aria-hidden='true' />
        </button>
        {club.logoUrl && <img src={club.logoUrl} alt='' width='36' height='36' />}
        <span className='fw-bold'>{club.name}</span>
      </header>
      <div className='home'>
        {club.readOnly && <p className='alert alert-warning'>El período abonado venció. Podés consultar los datos y cancelar reservas futuras.</p>}
        <Menu menu={menu} handleMenuClick={handleMenuClick} handleGetAllUsers={handleGetAllUsers} handleCloseSession={closeSession} />
        <Routes>
          <Route path='/' element={<Main />} />
          <Route path='/home' element={<Main />} />
          <Route path='/createUser' element={<InviteMember />} />
          <Route path='/configuracion' element={<ClubSettings />} />
          <Route path='/facturacion' element={<Billing />} />
          <Route path='/courts' element={<ClubCourts />} />
          <Route path='/getAllUsers' element={
            <GetAllUsers handleMenuClick={handleMenuClick} menu={menu} handleGetAllUsers={handleGetAllUsers}
              allUsers={allUsers} handleDeleteReserve={deleteReserve} handleUpdateUser={update} handleDeleteUser={suspend}
              setConfirmDelete={setConfirmDelete} confirmDelete={confirmDelete} selectedUser={selectedUser}
              setSelectedUser={setSelectedUser} isUserSelected={isUserSelected} setIsUserSelected={setIsUserSelected} />
          } />
          <Route path='/events' element={<Events handleMenuClick={handleMenuClick} menu={menu} />} />
          <Route path='/activities' element={<CreateActivity handleMenuClick={handleMenuClick} menu={menu} />} />
          <Route path='/getAllActivities' element={<GetAllActivities handleMenuClick={handleMenuClick} menu={menu} />} />
          <Route path='/updateActivities' element={<UpdateActivities />} />
          <Route path='/oldReservesDeleted' element={<OldReservesDeleted handleMenuClick={handleMenuClick} menu={menu}
            setConfirmDelete={setConfirmDelete} confirmDelete={confirmDelete} handleDeleteOldReserves={deleteOldReserves} />} />
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </div>
    </>
  );
}
