import { useState } from 'react';
import './createCourt.css';
import { ToastContainer } from 'react-toastify';

const CreateCourt = ({ handleCreateCourt }) => {

  const [court, setCourt] = useState({ name: '' })

  const handleChange = (e) => {

    setCourt({
      ...court,
      [e.target.name]: (e.target.value).toLowerCase()
    })

  }
 
  return (

    <div
      className='col-12 d-flex flex-column align-items-center justify-content-center p-1'>

      <div className='border p-3 shadow rounded'>

        <h3 className='text-center'>Crear cancha</h3>
        <form
          className='m-auto d-flex flex-column align-items-center'>
          <div
            className="input-group align-items-center">

            <div
              className="input-group-prepend mx-1 p-1">

              <i
                className="bi bi-card-list fs-4">
              </i>

            </div>

            <input
              id="name"
              name='name'
              placeholder='Nombre de la cancha'
              className='form-control my-2 text-center border-0 border-bottom' type='text'
              value={court.name}
              onChange={handleChange}
            />

          </div>

          <div
            className="input-group my-2 justify-content-center align-items-center">

            <div
              className="input-group-prepend mx-2">
              {
                court.name === ''
                  ? <i
                    className="bi bi-plus-square fs-4">
                  </i>
                  : <i
                    className="bi bi-plus-square-fill fs-4">
                    </i>
              }


            </div>

            <input
              className="my-2 text-center border border-success w-25 rounded bg-white text-secondary p-2"
              type="submit"
              value='Crear'
              disabled={court.name === ''}
              onClick={(e) => { handleCreateCourt(e, court), setCourt({ name: '' }) }}
            />

          </div>

        </form>

      </div>

      <div>
        <ToastContainer />
      </div>

    </div>
  )
}

export default CreateCourt