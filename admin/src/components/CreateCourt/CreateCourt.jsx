import { useState } from 'react';
import './createCourt.css';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
const CreateCourt = ({ setMenu, menu, handleCreateCourt }) => {

  const [court, setCourt] = useState({ name: '' })

  const handleChange = (e) => {

    setCourt({
      ...court,
      [e.target.name]: e.target.value
    })

  }

  return (

    <div
      className='col-9 d-flex flex-column align-items-center p-1'>

      <div
        className='col-12 my-3'>

        <Link
          to={'/'}
          className='btn btn-close border border-dark p-2'
          onClick={() => { setMenu({ ...menu, main: true, createCourt: false}) }}>
        </Link>

      </div>

      <form
        className='m-auto'>

        <label
          className='text-success fw-bold mx-1'
          htmlFor="name">
          Cancha que deseas crear
        </label>

        <input
          className='p-2'
          type="text"
          name="name"
          id="name"
          placeholder='Nombre de la cancha'
          onChange={handleChange}
        />

        <input type="submit" value="Crear" onClick={(e) => handleCreateCourt(e,court)} />

      </form>

      <div>
        <ToastContainer />
      </div>

    </div>
  )
}

export default CreateCourt