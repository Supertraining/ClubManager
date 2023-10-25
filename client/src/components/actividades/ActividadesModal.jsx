import React from 'react'

const ActividadesModal = ({ category }) => {
  console.log(category)

  return (
    <>
      { category?.map((category) => (
        <div key={ category.name }>
          
          <h6 className='fs-5 text-center text-decoration-underline'>
            { category.days }
          </h6>

          <ul>
            <li>
              <b>{ category.name }: </b>
              <i className='text-success'>
                { category.schedule }
              </i>
            </li>
          </ul>

        </div>
      )) }
    </>

  )
}

export default ActividadesModal

