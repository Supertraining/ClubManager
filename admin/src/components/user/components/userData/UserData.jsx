import { useEffect, useId, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import './UserData.css';

const fields = [
  { name: 'first_name', label: 'Nombre', type: 'text', rules: { validate: value => Boolean(value.trim()) || 'Ingresá el nombre.', maxLength: 80 } },
  { name: 'last_name', label: 'Apellido', type: 'text', rules: { validate: value => Boolean(value.trim()) || 'Ingresá el apellido.', maxLength: 80 } },
  { name: 'age', label: 'Edad', type: 'number', rules: {
    valueAsNumber: true,
    validate: value => (Number.isInteger(value) && value >= 12 && value <= 99) || 'Ingresá una edad entre 12 y 99 años.',
  } },
  { name: 'phone', label: 'Teléfono', type: 'tel', rules: { maxLength: 80 } },
];

function formValues(user) {
  return {
    first_name: user.first_name ?? '',
    last_name: user.last_name ?? '',
    age: user.age ?? '',
    phone: user.phone ?? '',
  };
}

function saveError(error) {
  const { status, data } = error.response ?? {};
  if (status >= 400 && status < 500 && typeof data === 'string') return data;
  return error.response
    ? 'No pudimos guardar los cambios. Volvé a intentar.'
    : 'Revisá tu conexión y volvé a intentar guardar los cambios.';
}

export default function UserData({ selectedUser, handleUpdateUser, handleDeleteUser, setConfirmDelete, confirmDelete }) {
  const id = useId();
  const editButton = useRef(null);
  const [editing, setEditing] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const { register, reset, handleSubmit, setFocus, formState: { errors, isSubmitting } } = useForm({
    defaultValues: formValues(selectedUser),
  });

  useEffect(() => {
    if (editing) setFocus('first_name');
  }, [editing, setFocus]);

  const name = [selectedUser.first_name, selectedUser.last_name].filter(Boolean).join(' ') || selectedUser.email;
  const initials = [selectedUser.first_name, selectedUser.last_name].filter(Boolean).map(value => value.trim()[0]).join('').toUpperCase() || 'S';
  const administrator = selectedUser.role === 'admin';

  function startEdit() {
    reset(formValues(selectedUser));
    setFeedback(null);
    setEditing(true);
  }

  function closeEdit() {
    setEditing(false);
    requestAnimationFrame(() => editButton.current?.focus());
  }

  async function save(values) {
    setFeedback(null);
    try {
      await handleUpdateUser(values, selectedUser.id);
      closeEdit();
      setFeedback({ text: 'Guardamos los cambios.' });
    } catch (error) {
      setFeedback({ error: true, text: saveError(error) });
    }
  }

  return (
    <section className='member-profile' aria-label='Datos del socio'>
      <header className='member-profile__header'>
        <span className='member-profile__initials' aria-hidden='true'>{initials}</span>
        <div className='member-profile__identity'>
          <h2>{name}</h2>
          <p>{selectedUser.email}</p>
          <span className='member-profile__role'>{administrator ? 'Administrador' : 'Socio'}</span>
        </div>
        {!editing && !confirmDelete && (
          <button ref={editButton} type='button' className='btn btn-outline-success'
            onClick={startEdit}>
            <i className='bi bi-pencil' aria-hidden='true' /> Editar datos
          </button>
        )}
      </header>

      {editing ? (
        <form className='member-profile__body' onSubmit={handleSubmit(save)} noValidate autoComplete='off'>
          <h3>Editar datos</h3>
          <fieldset className='member-profile__grid' disabled={isSubmitting}>
            {fields.map(({ name, label, type, rules }) => (
              <div className='member-profile__field' key={name}>
                <label htmlFor={id + name}>{label}</label>
                <input id={id + name} type={type} className='form-control'
                  min={name === 'age' ? 12 : undefined} max={name === 'age' ? 99 : undefined}
                  maxLength={rules.maxLength} aria-required={name !== 'phone'}
                  aria-invalid={Boolean(errors[name])} aria-describedby={errors[name] ? id + name + '-error' : undefined}
                  {...register(name, rules)} />
                {errors[name] && <p className='member-profile__error' id={id + name + '-error'}>{errors[name].message || 'Ingresá hasta 80 caracteres.'}</p>}
              </div>
            ))}
          </fieldset>

          {feedback?.error && <p className='member-profile__error' role='alert'>{feedback.text}</p>}

          <div className='member-profile__actions'>
            <button type='button' className='btn btn-outline-secondary' disabled={isSubmitting}
              onClick={() => { setFeedback(null); closeEdit(); }}>Cancelar</button>
            <button type='submit' className='btn btn-success' disabled={isSubmitting}>
              {isSubmitting ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      ) : (
        <div className='member-profile__body'>
          {feedback && <p className='member-profile__success' role='status'>{feedback.text}</p>}
          <dl className='member-profile__grid'>
            <div><dt>Edad</dt><dd>{selectedUser.age ? selectedUser.age + ' años' : 'Sin informar'}</dd></div>
            <div><dt>Teléfono</dt><dd>{selectedUser.phone || 'Sin informar'}</dd></div>
          </dl>

          {!administrator && (confirmDelete ? (
            <div className='member-profile__deactivation'>
              <h3>¿Dar de baja a este socio?</h3>
              <p>La persona perderá el acceso a este club.</p>
              <div className='member-profile__actions'>
                <button type='button' className='btn btn-outline-secondary' onClick={() => setConfirmDelete(false)}>Cancelar</button>
                <button type='button' className='btn btn-danger' onClick={() => handleDeleteUser(selectedUser)}>Confirmar baja</button>
              </div>
            </div>
          ) : (
            <button type='button' className='btn member-profile__deactivate' onClick={() => setConfirmDelete(true)}>
              Dar de baja del club
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

UserData.propTypes = {
  selectedUser: PropTypes.shape({
    id: PropTypes.string.isRequired,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
    age: PropTypes.number,
    phone: PropTypes.string,
  }).isRequired,
  handleUpdateUser: PropTypes.func.isRequired,
  handleDeleteUser: PropTypes.func.isRequired,
  setConfirmDelete: PropTypes.func.isRequired,
  confirmDelete: PropTypes.bool,
};
