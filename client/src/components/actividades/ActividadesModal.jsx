import React from 'react'

const ActividadesModal = ({ category }) => {

  return (
    <>
      { category?.map((category) => (
        <div key={ category.name }>

          <ul className="d-flex flex-column align-items-center">
            <h6 className='fs-5 text-decoration-underline'>
              { category.days }
            </h6>
            <li>
              <b>Categoría: </b>
              <i className='text-success'>
                { category.name }
              </i>
            </li>
            <li>
              <b>Horario: </b>
              <i className='text-success'>
                { category.schedule }
              </i>
            </li>
            <li>
              <b>Edad: </b>
              <i className='text-success'>
                { category.age_range }
              </i>
            </li>
          </ul>

        </div>
      )) }
    </>

  )
}

export default ActividadesModal

