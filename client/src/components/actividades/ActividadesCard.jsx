import React from 'react'
import { Link } from 'react-router-dom'
const ActividadesCard = ({ img, imgText, title, description, data_target }) => {

  return (

    <div className='col-4 card-wrapper mx-1 shadow'>

      <div className="card">
        <img className="card-img p-2" src={ img } alt={ imgText } />
        <div className="card-body">
          <h5 className="card-title">{ title }</h5>
          <p className="card-text">{ description }</p>
        </div>
        <div className="card-body">
          <Link data-toggle="modal" data-target={ data_target } className="card-link text-decoration-none text-success border rounded p-2 ">
            <i className="bi bi-calendar-week"> Días y horarios
            </i>
          </Link>
        </div>
      </div>

    </div>

  )
}

export default ActividadesCard