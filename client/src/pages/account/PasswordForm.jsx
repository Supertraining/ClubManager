import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '../../lib/supabaseClient';

export default function PasswordForm() {
  const [feedback, setFeedback] = useState(null);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const submit = async ({ password, repeatedPassword }) => {
    if (password !== repeatedPassword) {
      setFeedback({ error: true, text: 'Las contraseñas tienen que coincidir.' });
      return;
    }
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        setFeedback({ error: true, text: 'No pudimos cambiar la contraseña. Iniciá sesión de nuevo y volvé a intentarlo.' });
        return;
      }
      reset();
      setFeedback({ text: 'Contraseña actualizada.' });
    } catch {
      setFeedback({ error: true, text: 'No pudimos conectar para actualizar tu contraseña. Volvé a intentarlo.' });
    }
  };

  return (
    <details className='account-reserves card-soft p-4 mb-3'>
      <summary>Cambiar contraseña</summary>
      <form className='d-grid gap-3 mt-3' onSubmit={handleSubmit(submit)}>
        <p>Vas a usar la misma contraseña en todos los clubes de tu cuenta.</p>
        <label>Nueva contraseña
          <input type='password' className='input' required minLength={8} autoComplete='new-password' {...register('password')} />
        </label>
        <label>Repetí la nueva contraseña
          <input type='password' className='input' required minLength={8} autoComplete='new-password' {...register('repeatedPassword')} />
        </label>
        {feedback && <p role={feedback.error ? 'alert' : 'status'}>{feedback.text}</p>}
        <button className='btn btn--primary btn--pill' type='submit' disabled={isSubmitting}>
          {isSubmitting ? 'Guardando…' : 'Actualizar contraseña'}
        </button>
      </form>
    </details>
  );
}
