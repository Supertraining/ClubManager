import React from 'react'
import { Link } from 'react-router-dom'
const ActividadesCard = ({ img, imgText, title, description, data_target }) => {
    console.log(data_target);
  return (

    <div className='col-4 card-wrapper mx-1'>
      <div className="card">
        <img className="card-img" src={ img } alt={ imgText } />
        <div className="card-body">
          <h5 className="card-title">{ title }</h5>
          <p className="card-text">{ description }</p>
        </div>
        <div className="card-body">
          <Link data-toggle="modal" data-target={data_target} className="card-link">Card link</Link>
        </div>
      </div>
    </div>

  )
}

export default ActividadesCard