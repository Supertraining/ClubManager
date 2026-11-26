import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAxiosInstance } from '../../hooks';
import { useClub } from '../../components/club/useClub';
import './ClubSettings.css';

export default function ClubSettings() {
  const { club, setClub } = useClub();
  const api = useAxiosInstance();
  const [notice, setNotice] = useState(null);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({ defaultValues: club });

  const save = async fields => {
    setNotice(null);
    try {
      const { data } = await api.put('/settings', fields);
      setClub(data);
      reset(data);
      setNotice({ text: 'Guardamos los datos del club.' });
    } catch (error) {
      const detail = error.response?.data;
      setNotice({ error: true, text: typeof detail === 'string' ? detail : 'No pudimos guardar los datos.' });
    }
  };

  return (
    <main className='container py-3 club-admin-form'>
      <h1>Datos del club</h1>
      <form className='row g-3' onSubmit={handleSubmit(save)}>
        <div className='col-12 col-md-6'>
          <label className='form-label' htmlFor='club-name'>Nombre del club</label>
          <input className='form-control' id='club-name' maxLength={100} required {...register('name')} />
        </div>
        <div className='col-12 col-md-6'>
          <label className='form-label' htmlFor='club-signup'>Alta de socios</label>
          <select className='form-select' id='club-signup' {...register('signupMode')}>
            <option value='invitation'>Por invitación</option>
            <option value='open'>Registro abierto</option>
          </select>
        </div>
        {[
          ['logoUrl', 'URL del logo', 'url'], ['coverImageUrl', 'URL de la foto del club', 'url'],
          ['contact.address', 'Dirección', 'text'], ['contact.whatsapp', 'WhatsApp', 'tel'],
          ['contact.instagram', 'Instagram', 'url'], ['contact.facebook', 'Facebook', 'url'],
        ].map(([field, label, type]) => (
          <div className='col-12 col-md-6' key={field}>
            <label className='form-label' htmlFor={field}>{label}</label>
            <input className='form-control' id={field} type={type} maxLength={300} {...register(field)} />
          </div>
        ))}
        <div className='col-12'>
          {notice && <p role={notice.error ? 'alert' : 'status'}>{notice.text}</p>}
          <button type='submit' className='btn btn-success' disabled={isSubmitting}>{isSubmitting ? 'Guardando…' : 'Guardar datos del club'}</button>
        </div>
      </form>
    </main>
  );
}
