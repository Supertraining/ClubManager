import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAxiosInstance } from '../../hooks';
import { useClub } from '../../components/club/useClub';
import './ClubSettings.css';

export default function InviteMember() {
  const { club } = useClub();
  const api = useAxiosInstance();
  const [notice, setNotice] = useState(null);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const invite = async ({ email }) => {
    setNotice(null);
    try {
      await api.post('/memberships/invitations', { email });
      reset();
      setNotice({ text: 'Invitación habilitada para ' + email + '.' });
    } catch (error) {
      const detail = error.response?.data;
      setNotice({ error: true, text: typeof detail === 'string' ? detail : 'No pudimos guardar la invitación.' });
    }
  };

  return (
    <main className='container py-3 club-admin-form'>
      <h1>Invitar socio</h1>
      <form onSubmit={handleSubmit(invite)} className='row g-3'>
        <div className='col-12 col-md-6'>
          <label htmlFor='member-email' className='form-label'>Correo que usará el socio</label>
          <input id='member-email' type='email' autoComplete='email' maxLength={254} required className='form-control' {...register('email')} />
        </div>
        <div className='col-12'>
          <button type='submit' className='btn btn-success' disabled={isSubmitting}>{isSubmitting ? 'Guardando…' : 'Habilitar invitación'}</button>
        </div>
      </form>
      {notice && <div className='mt-3' role={notice.error ? 'alert' : 'status'}>
        <p>{notice.text}</p>
        {!notice.error && <p>Compartí la página del portal de socios con esta ruta <code>{'/clubes/' + club.slug + '/register'}</code>.</p>}
      </div>}
    </main>
  );
}
